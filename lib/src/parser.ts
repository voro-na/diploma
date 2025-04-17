import * as fs from 'fs';
import { JestTestResult } from './types';

/**
 * Interface for parsed test results
 */
export interface Test {
  featureName: string;
  testGroupName: string;
  testName: string;
  status: string;
}

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
 * Parses Jest test results into a simplified format
 * @param jestResults Jest test results
 * @returns Array of parsed test results
 */
export function parseTestResults(jestResults: JestTestResult): Test[] {
  const tests: Test[] = [];

  jestResults.testResults.forEach((fileResult) => {
    fileResult.assertionResults.forEach((testResult) => {
      const featureName = testResult.ancestorTitles[0];
      const testGroupName = testResult.ancestorTitles[1];

      if (!featureName || !testGroupName) {
        console.warn(`Warning: Test "${testResult.title}" has missing feature name or test group name. Feature: ${featureName || 'missing'}, Group: ${testGroupName || 'missing'}`);
        return; 
      }

      tests.push({
        featureName,
        testGroupName,
        testName: testResult.title,
        status: testResult.status
      });
    });
  });

  return tests;
}

/**
 * Prints test results to the console
 * @param results Parsed test results
 */
export function printResults(results: Test[]): void {
  console.log('\n=== Test Results ===\n');

  const groupedTests = new Map<string, Map<string, Test[]>>();

  results.forEach((test) => {
    if (!groupedTests.has(test.featureName)) {
      groupedTests.set(test.featureName, new Map<string, Test[]>());
    }
    const featureMap = groupedTests.get(test.featureName)!;
    
    if (!featureMap.has(test.testGroupName)) {
      featureMap.set(test.testGroupName, []);
    }
    featureMap.get(test.testGroupName)!.push(test);
  });

  for (const [featureName, featureMap] of groupedTests) {
    console.log(`Feature: ${featureName}`);
    
    for (const [groupName, tests] of featureMap) {
      console.log(`  Group: ${groupName}`);
      
      tests.forEach((test) => {
        const statusColor = 
          test.status === 'passed' ? '\x1b[32m' :  // Green
          test.status === 'failed' ? '\x1b[31m' :  // Red
          '\x1b[33m';                              // Yellow for other statuses
        const resetColor = '\x1b[0m';
        
        console.log(`    ${test.testName}: ${statusColor}${test.status}${resetColor}`);
      });
      console.log('');
    }
    console.log('');
  }

  const passed = results.filter(r => r.status === 'passed').length;
  const failed = results.filter(r => r.status === 'failed').length;
  const total = results.length;

  console.log('Summary:');
  console.log(`  Total tests: ${total}`);
  console.log(`  Passed: ${passed}`);
  console.log(`  Failed: ${failed}`);
  console.log('\n================\n');
}
