#!/usr/bin/env node
import * as fs from 'fs';
import * as path from 'path';
import { JestCoverageChecker } from './index';
import { parseJestResults } from './parser';

// Parse command line arguments
const args = process.argv.slice(2);
let jestResultsPath: string | undefined;
let configPath: string | undefined;
let apiUrl: string | undefined;
let fetchConfig = false;
let sendResults = false;

// Process arguments
for (let i = 0; i < args.length; i++) {
  const arg = args[i];

  if (arg === '--results' || arg === '-r') {
    jestResultsPath = args[++i];
  } else if (arg === '--config' || arg === '-c') {
    configPath = args[++i];
  } else if (arg === '--api-url' || arg === '-a') {
    apiUrl = args[++i];
  } else if (arg === '--fetch-config') {
    fetchConfig = true;
  } else if (arg === '--send-results') {
    sendResults = true;
  } else if (arg === '--help' || arg === '-h') {
    printHelp();
    process.exit(0);
  }
}

// Print help message
function printHelp() {
  console.log(`
Jest Coverage Checker - Check Jest test coverage against a configuration file

Usage:
  jest-coverage-checker [options]

Options:
  --results, -r <path>    Path to Jest test results JSON file (required unless using --fetch-config)
  --config, -c <path>     Path to test configuration JSON file (required unless using --fetch-config)
  --api-url, -a <url>     Base API URL for fetching config or sending results (e.g., http://localhost:3000/api)
  --fetch-config          Fetch test configuration from API
  --send-results          Send test results to API
  --help, -h              Show this help message
  
Examples:
  jest-coverage-checker --results ./jest-results.json --config ./test-config.json
  jest-coverage-checker -r ./jest-results.json -c ./test-config.json
  jest-coverage-checker -r ./jest-results.json -a http://localhost:3000/api --fetch-config
  jest-coverage-checker -r ./jest-results.json -c ./test-config.json -a http://localhost:3000/api --send-results

API Integration:
  When using --send-results, the tool will send test results to:
  {api-url}/projects/project-5/groups/{groupSlug}/features/{featureSlug}
  
  Where:
  - groupSlug is derived from the first element of the test's ancestorTitles array
  - featureSlug is derived from the second element (or 'default' if not present)
`);
}

// Validate arguments
if (!jestResultsPath && !fetchConfig) {
  console.error('Error: Jest results path is required (--results or -r)');
  printHelp();
  process.exit(1);
}

if (!configPath && !fetchConfig) {
  console.error('Error: Test configuration path is required (--config or -c)');
  printHelp();
  process.exit(1);
}

if ((fetchConfig || sendResults) && !apiUrl) {
  console.error('Error: API URL is required for fetching config or sending results (--api-url or -a)');
  printHelp();
  process.exit(1);
}

// Run the coverage checker
async function run() {
  try {
    const checker = new JestCoverageChecker({
      jestResultsPath,
      configPath,
      projectSlug: 'project-4'
    });

    // Fetch config from API if requested
    if (fetchConfig && apiUrl) {
      const config = await checker.fetchConfigFromApi(apiUrl);
      console.log('Fetched config from API');
    }

    // Run the coverage check
    const results = await checker.run();

    // Send results to API if requested
    if (sendResults && apiUrl && jestResultsPath) {
      try {
        // Send the results to the API
        await checker.sendResultsToApi(results, apiUrl, 'project-4');
        console.log('Sent results to API');
      } catch (error) {
        console.error('Error sending results to API:', error);
      }
    }

    // Exit with appropriate code based on test results
    const hasFailedTests = results.some(r => r.status === 'failed');
    const hasNotFoundTests = results.some(r => r.status === 'not found');

    if (hasFailedTests) {
      process.exit(1); // Exit with error if any tests failed
    } else if (hasNotFoundTests) {
      process.exit(2); // Exit with code 2 if any tests were not found
    } else {
      process.exit(0); // Exit with success if all tests passed
    }
  } catch (error) {
    console.error('Error:', (error as Error).message);
    process.exit(1);
  }
}

run();
