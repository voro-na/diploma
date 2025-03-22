// This example shows how to use the Jest Coverage Checker as a library
const { JestCoverageChecker } = require('../dist/index');
const path = require('path');

// Paths to the example files
const jestResultsPath = path.join(__dirname, 'jest-results.json');
const configPath = path.join(__dirname, 'test-config.json');

// Create a new instance of the coverage checker
const checker = new JestCoverageChecker({
  jestResultsPath,
  configPath,
  outputToConsole: true
});

// Run the coverage check
checker.run()
  .then(results => {
    console.log('\nCoverage check completed');
    
    // Process results
    const passedTests = results.filter(r => r.status === 'passed');
    const failedTests = results.filter(r => r.status === 'failed');
    const notFoundTests = results.filter(r => r.status === 'not found');
    
    console.log(`\nSummary:`);
    console.log(`  Passed: ${passedTests.length}`);
    console.log(`  Failed: ${failedTests.length}`);
    console.log(`  Not found: ${notFoundTests.length}`);
    
    // Exit with appropriate code
    if (failedTests.length > 0) {
      process.exit(1);
    } else if (notFoundTests.length > 0) {
      process.exit(2);
    } else {
      process.exit(0);
    }
  })
  .catch(error => {
    console.error('Error:', error.message);
    process.exit(1);
  });
