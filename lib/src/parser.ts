import * as fs from 'fs';
import * as path from 'path';
import { JestTestResult, TestConfig, TestResultWithConfig } from './types';

/**
 * Parses Jest test results from a file
 * @param filePath Path to the Jest test results JSON file
 * @returns Parsed Jest test results
 */
export function parseJestResults(filePath: string): JestTestResult {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(content) as JestTestResult;
  } catch (error) {
    console.error(`Error parsing Jest results from ${filePath}:`, error);
    throw new Error(`Failed to parse Jest results: ${(error as Error).message}`);
  }
}

/**
 * Loads test configuration from a file
 * @param filePath Path to the test configuration JSON file
 * @returns Parsed test configuration
 */
export function loadTestConfig(filePath: string): TestConfig {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(content) as TestConfig;
  } catch (error) {
    console.error(`Error loading test config from ${filePath}:`, error);
    throw new Error(`Failed to load test config: ${(error as Error).message}`);
  }
}

/**
 * Matches Jest test results with test configuration
 * @param jestResults Jest test results
 * @param config Test configuration
 * @returns Array of test results with configuration information
 */
export function matchTestsWithConfig(
  jestResults: JestTestResult,
  config: TestConfig
): TestResultWithConfig[] {
  // Create a map of test names to test results
  const testMap = new Map<string, { status: 'passed' | 'failed' }>();
  
  // Process all test results
  jestResults.testResults.forEach((fileResult) => {
    fileResult.testResults.forEach((testResult) => {
      // Create a full test name including ancestor titles
      const fullName = [...testResult.ancestorTitles, testResult.title].join(' ');
      testMap.set(fullName, { status: testResult.status });
    });
  });
  
  // Match tests from config with results
  return config.tests.map((testConfig) => {
    const testResult = testMap.get(testConfig.name);
    
    return {
      id: testConfig.id,
      name: testConfig.name,
      status: testResult ? testResult.status : 'not found',
      path: testConfig.path,
      description: testConfig.description,
    };
  });
}

/**
 * Prints test results to the console
 * @param results Test results with configuration information
 */
export function printResults(results: TestResultWithConfig[]): void {
  console.log('\n=== Jest Coverage Checker Results ===\n');
  
  results.forEach((result) => {
    const statusColor = 
      result.status === 'passed' ? '\x1b[32m' :  // Green
      result.status === 'failed' ? '\x1b[31m' :  // Red
      '\x1b[33m';                                // Yellow for 'not found'
    
    const resetColor = '\x1b[0m';
    
    // Format: Test name from config + exists in results? + pass/fail status
    const existsInResults = result.status !== 'not found';
    const existsText = existsInResults ? 'Found in test results' : 'Not found in test results';
    const existsColor = existsInResults ? '\x1b[36m' : '\x1b[33m'; // Cyan for found, Yellow for not found
    
    console.log(`${result.name}:`);
    console.log(`  ${existsColor}${existsText}${resetColor}`);
    
    if (existsInResults) {
      console.log(`  Status: ${statusColor}${result.status}${resetColor}`);
    }
    
    if (result.description) {
      console.log(`  Description: ${result.description}`);
    }
    
    if (result.path) {
      console.log(`  Path: ${result.path}`);
    }
    
    console.log(''); // Empty line for spacing
  });
  
  // Print summary
  const passed = results.filter(r => r.status === 'passed').length;
  const failed = results.filter(r => r.status === 'failed').length;
  const notFound = results.filter(r => r.status === 'not found').length;
  const found = passed + failed;
  
  console.log('Summary:');
  console.log(`  Total tests in config: ${results.length}`);
  console.log(`  Found in test results: ${found}`);
  console.log(`  Not found in test results: ${notFound}`);
  console.log(`  Passed: ${passed}`);
  console.log(`  Failed: ${failed}`);
  console.log('\n===================================\n');
}
