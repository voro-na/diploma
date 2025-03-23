// This example shows how to use the Jest Coverage Checker to send results to an API
const { JestCoverageChecker } = require('../dist/index');
const { parseJestResults } = require('../dist/parser');
const path = require('path');

// Paths to the example files
const jestResultsPath = path.join(__dirname, 'jest-results.json');

// API configuration
const apiBaseUrl = 'http://localhost:3001'; // Replace with your API URL
const projectSlug = 'project-5'; // Default project slug

async function run() {
  try {
    console.log('Parsing Jest results...');
    const jestResults = parseJestResults(jestResultsPath);
    
    console.log('Creating Jest Coverage Checker...');
    const checker = new JestCoverageChecker();
    
    console.log(`Sending results to API: ${apiBaseUrl}`);
    await checker.sendResultsToApi(jestResults, apiBaseUrl, projectSlug);
    
    console.log('Results sent successfully!');
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

run();
