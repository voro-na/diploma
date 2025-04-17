/**
 * Interface for a test result from Jest
 */
export interface JestTestResult {
  testResults: {
    testFilePath: string;
    assertionResults: {
      ancestorTitles: string[];
      title: string;
      status: 'passed' | 'failed';
    }[];
  }[];
  numFailedTests: number;
  numPassedTests: number;
  numTotalTests: number;
}

/**
 * Options for the test parser
 */
export interface CoverageCheckerOptions {
  /**
   * Path to the Jest test results JSON file
   */
  jestResultsPath?: string;

  /**
   * Jest test results object (alternative to jestResultsPath)
   */
  jestResults?: JestTestResult;

  /**
   * Whether to output results to console
   */
  outputToConsole?: boolean;
}
