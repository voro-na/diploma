import fs from 'fs';
import { parseJestResults, parseTestResults, printResults, Test } from '../parser';
import { JestTestResult } from '../types';
import { jest, describe, it, expect, beforeEach, afterEach } from '@jest/globals';

// Mock fs module
jest.mock('fs');

// Get the mocked fs module
const mockedFs = jest.mocked(fs);

// Mock console.log and console.warn for testing output
const originalConsoleLog = console.log;
const originalConsoleWarn = console.warn;
let consoleOutput: string[] = [];
let consoleWarnings: string[] = [];

beforeEach(() => {
  consoleOutput = [];
  consoleWarnings = [];
  console.log = (message?: any) => {
    if (message) consoleOutput.push(message.toString());
  };
  console.warn = (message?: any) => {
    if (message) consoleWarnings.push(message.toString());
  };
});

afterEach(() => {
  console.log = originalConsoleLog;
  console.warn = originalConsoleWarn;
  jest.resetAllMocks();
});

describe('parseJestResults', () => {
  const sampleContent = JSON.stringify({
    testResults: [
      {
        testFilePath: "/tests/math.test.js",
        assertionResults: [
          {
            ancestorTitles: ["Math Operations", "Addition"],
            title: "should add two numbers correctly",
            status: "passed"
          },
          {
            ancestorTitles: ["Math Operations", "Addition"],
            title: "should handle negative numbers",
            status: "failed"
          },
          {
            ancestorTitles: ["Math Operations", "Subtraction"],
            title: "should subtract two numbers",
            status: "passed"
          }
        ]
      },
      {
        testFilePath: "/tests/string.test.js",
        assertionResults: [
          {
            ancestorTitles: ["String Operations", "Concatenation"],
            title: "should join two strings",
            status: "passed"
          }
        ]
      }
    ],
    numFailedTests: 1,
    numPassedTests: 3,
    numTotalTests: 4
  });
  const sampleData = JSON.parse(sampleContent);

  beforeEach(() => {
    mockedFs.readFileSync.mockReturnValue(sampleContent);
  });

  it('should successfully parse valid Jest results file', () => {
    
    const result = parseJestResults('dummy-path.json');
    
    expect(result).toEqual(sampleData);
    expect(mockedFs.readFileSync).toHaveBeenCalledWith('dummy-path.json', 'utf-8');
  });

  it('should throw error when file cannot be read', () => {
    mockedFs.readFileSync.mockImplementation(() => {
      throw new Error('File not found');
    });

    expect(() => parseJestResults('nonexistent.json')).toThrow('Failed to parse Jest results: File not found');
  });

  it('should throw error when JSON is invalid', () => {
    mockedFs.readFileSync.mockReturnValue('invalid json');

    expect(() => parseJestResults('invalid.json')).toThrow('Failed to parse Jest results');
  });
});

describe('parseTestResults', () => {
  const sampleJestResults: JestTestResult = {
    testResults: [
      {
        testFilePath: '/test/sample.test.js',
        assertionResults: [
          {
            ancestorTitles: ['Feature A', 'Group 1'],
            title: 'should do something',
            status: 'passed'
          },
          {
            ancestorTitles: ['Feature A', 'Group 1'],
            title: 'should handle error',
            status: 'failed'
          }
        ]
      }
    ],
    numFailedTests: 1,
    numPassedTests: 1,
    numTotalTests: 2
  };

  it('should parse Jest results into simplified format', () => {
    const result = parseTestResults(sampleJestResults);

    expect(result).toEqual([
      {
        featureName: 'Feature A',
        testGroupName: 'Group 1',
        testName: 'should do something',
        status: 'passed'
      },
      {
        featureName: 'Feature A',
        testGroupName: 'Group 1',
        testName: 'should handle error',
        status: 'failed'
      }
    ]);
  });

  it('should skip tests with missing feature or group name', () => {
    const incompleteResults: JestTestResult = {
      testResults: [
        {
          testFilePath: '/test/sample.test.js',
          assertionResults: [
            {
              ancestorTitles: ['Feature A'], // Missing group name
              title: 'should do something',
              status: 'passed'
            }
          ]
        }
      ],
      numFailedTests: 0,
      numPassedTests: 1,
      numTotalTests: 1
    };

    const result = parseTestResults(incompleteResults);

    expect(result).toEqual([]);
    expect(consoleWarnings[0]).toContain('Warning: Test "should do something" has missing feature name or test group name');
  });
});

describe('printResults', () => {
  const sampleTests: Test[] = [
    {
      featureName: 'Feature A',
      testGroupName: 'Group 1',
      testName: 'Test 1',
      status: 'passed'
    },
    {
      featureName: 'Feature A',
      testGroupName: 'Group 1',
      testName: 'Test 2',
      status: 'failed'
    },
    {
      featureName: 'Feature B',
      testGroupName: 'Group 2',
      testName: 'Test 3',
      status: 'passed'
    }
  ];

  it('should print test results grouped by feature and group', () => {
    printResults(sampleTests);

    // Check that output contains feature names
    expect(consoleOutput.some(line => line.includes('Feature A'))).toBe(true);
    expect(consoleOutput.some(line => line.includes('Feature B'))).toBe(true);

    // Check that output contains group names
    expect(consoleOutput.some(line => line.includes('Group 1'))).toBe(true);
    expect(consoleOutput.some(line => line.includes('Group 2'))).toBe(true);

    // Check that output contains test names and statuses
    expect(consoleOutput.some(line => line.includes('Test 1') && line.includes('passed'))).toBe(true);
    expect(consoleOutput.some(line => line.includes('Test 2') && line.includes('failed'))).toBe(true);
    expect(consoleOutput.some(line => line.includes('Test 3') && line.includes('passed'))).toBe(true);

    // Check summary
    expect(consoleOutput.some(line => line.includes('Total tests: 3'))).toBe(true);
    expect(consoleOutput.some(line => line.includes('Passed: 2'))).toBe(true);
    expect(consoleOutput.some(line => line.includes('Failed: 1'))).toBe(true);
  });

  it('should handle empty test results', () => {
    printResults([]);

    expect(consoleOutput.some(line => line.includes('Total tests: 0'))).toBe(true);
    expect(consoleOutput.some(line => line.includes('Passed: 0'))).toBe(true);
    expect(consoleOutput.some(line => line.includes('Failed: 0'))).toBe(true);
  });
});
