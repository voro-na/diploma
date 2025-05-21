import axios from 'axios';
import { JestTestParser } from '../index';
import { JestTestResult } from '../types';
import * as parser from '../parser';
import { jest, describe, it, expect, beforeEach, afterEach } from '@jest/globals';

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

// Mock parser functions
jest.mock('../parser', () => ({
  parseJestResults: jest.fn(),
  parseTestResults: jest.fn(),
  printResults: jest.fn()
}));

describe('JestTestParser', () => {
  const sampleJestResults: JestTestResult = {
    testResults: [
      {
        testFilePath: '/test/sample.test.js',
        assertionResults: [
          {
            ancestorTitles: ['Feature A', 'Group 1'],
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

  const sampleParsedResults = [
    {
      featureName: 'Feature A',
      testGroupName: 'Group 1',
      testName: 'should do something',
      status: 'passed'
    }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    (parser.parseJestResults as jest.Mock).mockReturnValue(sampleJestResults);
    (parser.parseTestResults as jest.Mock).mockReturnValue(sampleParsedResults);
  });

  describe('constructor', () => {
    it('should initialize with default options', () => {
      const parser = new JestTestParser();
      expect(parser['options'].outputToConsole).toBe(true);
    });

    it('should initialize with custom options', () => {
      const parser = new JestTestParser({
        outputToConsole: false,
        jestResultsPath: 'results.json'
      });
      expect(parser['options'].outputToConsole).toBe(false);
      expect(parser['options'].jestResultsPath).toBe('results.json');
    });
  });

  describe('parse', () => {
    it('should parse results from file path', async () => {
      const testParser = new JestTestParser({
        jestResultsPath: 'results.json'
      });

      const results = await testParser.parse();

      expect(parser.parseJestResults).toHaveBeenCalledWith('results.json');
      expect(parser.parseTestResults).toHaveBeenCalledWith(sampleJestResults);
      expect(parser.printResults).toHaveBeenCalledWith(sampleParsedResults);
      expect(results).toEqual(sampleParsedResults);
    });

    it('should parse results from provided Jest results object', async () => {
      const testParser = new JestTestParser({
        jestResults: sampleJestResults
      });

      const results = await testParser.parse();

      expect(parser.parseJestResults).not.toHaveBeenCalled();
      expect(parser.parseTestResults).toHaveBeenCalledWith(sampleJestResults);
      expect(results).toEqual(sampleParsedResults);
    });

    it('should not print results when outputToConsole is false', async () => {
      const testParser = new JestTestParser({
        jestResults: sampleJestResults,
        outputToConsole: false
      });

      await testParser.parse();

      expect(parser.printResults).not.toHaveBeenCalled();
    });

    it('should throw error when neither jestResults nor jestResultsPath is provided', async () => {
      const testParser = new JestTestParser();

      await expect(testParser.parse()).rejects.toThrow(
        'Either jestResults or jestResultsPath must be provided'
      );
    });

    it('should send results to API when apiUrl and projectSlug are provided', async () => {
      const testParser = new JestTestParser({
        jestResults: sampleJestResults
      });

      mockedAxios.post.mockResolvedValueOnce({
        data: [
          {
            testName: 'should do something',
            status: 'success'
          }
        ]
      });

      const results = await testParser.parse({
        apiUrl: 'http://api.example.com',
        projectSlug: 'test-project'
      });

      expect(mockedAxios.post).toHaveBeenCalledWith(
        'http://api.example.com/projects/test-project/tests/update',
        { tests: sampleParsedResults }
      );
      expect(results).toEqual(sampleParsedResults);
    });

    it('should handle API error gracefully', async () => {
      const testParser = new JestTestParser({
        jestResults: sampleJestResults
      });

      const errorMessage = 'API Error';
      mockedAxios.post.mockRejectedValueOnce({
        isAxiosError: true,
        response: {
          data: {
            message: errorMessage
          }
        }
      });

      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      const results = await testParser.parse({
        apiUrl: 'http://api.example.com',
        projectSlug: 'test-project'
      });

      expect(consoleSpy).toHaveBeenCalledWith(
        'Failed to send test results to backend:',
        {
          isAxiosError: true,
          response: {
            data: {
              message: errorMessage
            }
          }
        }
      );
      expect(results).toEqual(sampleParsedResults);

      consoleSpy.mockRestore();
    });

    it('should handle non-Axios error gracefully', async () => {
      const testParser = new JestTestParser({
        jestResults: sampleJestResults
      });

      const error = new Error('Unknown error');
      mockedAxios.post.mockRejectedValueOnce(error);

      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      const results = await testParser.parse({
        apiUrl: 'http://api.example.com',
        projectSlug: 'test-project'
      });

      expect(consoleSpy).toHaveBeenCalledWith(
        'Failed to send test results to backend:',
        error
      );
      expect(results).toEqual(sampleParsedResults);
    })
  })})
