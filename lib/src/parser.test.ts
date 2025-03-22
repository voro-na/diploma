import { matchTestsWithConfig, printResults } from './parser';
import { JestTestResult, TestConfig, TestResultWithConfig } from './types';

// Mock console.log for testing printResults
const originalConsoleLog = console.log;
let consoleOutput: string[] = [];
console.log = jest.fn((...args) => {
  consoleOutput.push(args.join(' '));
});

describe('Parser', () => {
  beforeEach(() => {
    consoleOutput = [];
  });

  afterAll(() => {
    console.log = originalConsoleLog;
  });

  describe('matchTestsWithConfig', () => {
    it('should match tests with config correctly', () => {
      // Sample test results
      const jestResults: JestTestResult = {
        testResults: [
          {
            testFilePath: 'src/math.test.js',
            testResults: [
              {
                ancestorTitles: ['Math'],
                title: 'should add two numbers correctly',
                status: 'passed'
              },
              {
                ancestorTitles: ['Math'],
                title: 'should subtract two numbers correctly',
                status: 'failed'
              }
            ]
          }
        ],
        numFailedTests: 1,
        numPassedTests: 1,
        numTotalTests: 2
      };

      // Sample test config
      const config: TestConfig = {
        tests: [
          {
            id: 'test1',
            name: 'Math should add two numbers correctly',
            path: 'src/math.test.js',
            description: 'Tests the add function'
          },
          {
            id: 'test2',
            name: 'Math should subtract two numbers correctly',
            path: 'src/math.test.js',
            description: 'Tests the subtract function'
          },
          {
            id: 'test3',
            name: 'Math should multiply two numbers correctly',
            path: 'src/math.test.js',
            description: 'Tests the multiply function'
          }
        ]
      };

      // Expected results
      const expected: TestResultWithConfig[] = [
        {
          id: 'test1',
          name: 'Math should add two numbers correctly',
          status: 'passed',
          path: 'src/math.test.js',
          description: 'Tests the add function'
        },
        {
          id: 'test2',
          name: 'Math should subtract two numbers correctly',
          status: 'failed',
          path: 'src/math.test.js',
          description: 'Tests the subtract function'
        },
        {
          id: 'test3',
          name: 'Math should multiply two numbers correctly',
          status: 'not found',
          path: 'src/math.test.js',
          description: 'Tests the multiply function'
        }
      ];

      // Run the function
      const results = matchTestsWithConfig(jestResults, config);

      // Check the results
      expect(results).toEqual(expected);
    });
  });

  describe('printResults', () => {
    it('should print results to console', () => {
      // Sample test results
      const results: TestResultWithConfig[] = [
        {
          id: 'test1',
          name: 'Test 1',
          status: 'passed',
          path: 'src/test1.js',
          description: 'Description 1'
        },
        {
          id: 'test2',
          name: 'Test 2',
          status: 'failed',
          path: 'src/test2.js',
          description: 'Description 2'
        },
        {
          id: 'test3',
          name: 'Test 3',
          status: 'not found',
          path: 'src/test3.js',
          description: 'Description 3'
        }
      ];

      // Run the function
      printResults(results);

      // Check that the output contains the expected information
      expect(consoleOutput.some(line => line.includes('Test 1'))).toBe(true);
      expect(consoleOutput.some(line => line.includes('Test 2'))).toBe(true);
      expect(consoleOutput.some(line => line.includes('Test 3'))).toBe(true);
      expect(consoleOutput.some(line => line.includes('passed'))).toBe(true);
      expect(consoleOutput.some(line => line.includes('failed'))).toBe(true);
      expect(consoleOutput.some(line => line.includes('not found'))).toBe(true);
      expect(consoleOutput.some(line => line.includes('Total tests: 3'))).toBe(true);
      expect(consoleOutput.some(line => line.includes('Passed: 1'))).toBe(true);
      expect(consoleOutput.some(line => line.includes('Failed: 1'))).toBe(true);
      expect(consoleOutput.some(line => line.includes('Not found: 1'))).toBe(true);
    });
  });
});
