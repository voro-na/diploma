import { JestTestParser } from './index';
import { Test } from './parser';

// Parse command line arguments
const args = process.argv.slice(2);
let jestResultsPath: string | undefined;

// Process arguments
for (let i = 0; i < args.length; i++) {
  const arg = args[i];

  if (arg === '--results' || arg === '-r') {
    jestResultsPath = args[++i];
  } else if (arg === '--help' || arg === '-h') {
    printHelp();
    process.exit(0);
  }
}

// Print help message
function printHelp() {
  console.log(`
Jest Test Parser - Parse Jest test results into a simplified format

Usage:
  jest-test-parser [options]

Options:
  --results, -r <path>    Path to Jest test results JSON file (required)
  --help, -h              Show this help message
  
Examples:
  jest-test-parser --results ./jest-results.json
  jest-test-parser -r ./jest-results.json

Output Format:
  The parser will output an array of test results in the following format:
  {
    featureName: string;    // First ancestor title
    testGroupName: string;  // Second ancestor title
    testName: string;       // Test title
    status: string;         // Test status (passed/failed)
  }
`);
}

// Validate arguments
if (!jestResultsPath) {
  console.error('Error: Jest results path is required (--results or -r)');
  printHelp();
  process.exit(1);
}

// Run the coverage checker
async function run() {
  try {
    const parser = new JestTestParser({
      jestResultsPath,
      outputToConsole: true
    });

    // Parse the test results
    const results: Test[] = await parser.parse({apiUrl: 'http://localhost:3001', projectSlug: 'test'});

    // Exit with appropriate code based on test results
    const hasFailedTests = results.some((r: Test) => r.status === 'failed');

    if (hasFailedTests) {
      process.exit(1); // Exit with error if any tests failed
    } else {
      process.exit(0); // Exit with success if all tests passed
    }
  } catch (error) {
    console.error('Error:', (error as Error).message);
    process.exit(1);
  }
}

run();
