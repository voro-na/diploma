// This example shows how to use the Jest Coverage Checker to send results to an API
const { JestCoverageChecker } = require('../dist/index');
const path = require('path');

// Paths to the example files
const jestResultsPath = path.join(__dirname, 'jest-results.json');
const configPath = path.join(__dirname, 'test-config.json');

// API configuration
const apiBaseUrl = 'http://localhost:3001'; // Replace with your API URL
const projectSlug = 'project-4'; // Default project slug

async function run() {
  try {
    console.log('Starting Jest Coverage Checker API example...\n');

    // Create checker with API configuration
    const checker = new JestCoverageChecker({
      jestResultsPath,
      configPath,
      outputToConsole: true,
      apiBaseUrl,
      projectSlug
    });

    console.log('Running coverage check with API configuration...');
    const results = await checker.run();
    console.log('Coverage check completed and results sent to API\n');

    // Print summary of results
    console.log('Summary of test results:');
    console.log('------------------------');
    const passedTests = results.filter(r => r.status === 'passed').length;
    const failedTests = results.filter(r => r.status === 'failed').length;
    const notFoundTests = results.filter(r => r.status === 'not found').length;

    console.log(`Total tests: ${results.length}`);
    console.log(`Passed: ${passedTests}`);
    console.log(`Failed: ${failedTests}`);
    console.log(`Not found: ${notFoundTests}`);

    // Exit with appropriate code
    if (failedTests > 0) {
      process.exit(1);
    } else if (notFoundTests > 0) {
      process.exit(2);
    } else {
      process.exit(0);
    }
  } catch (error) {
    console.error('\nError:', error.message);
    if (error.response) {
      console.error('API Response:', error.response.data);
      console.error('Status:', error.response.status);
    }
    process.exit(1);
  }
}

// Run the example
run();
