/**
 * Interface for a test result from Jest
 */
export interface JestTestResult {
  testResults: {
    testFilePath: string;
    testResults: {
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
 * Interface for a test configuration
 */
export interface TestConfig {
  tests: TestDefinition[];
}

/**
 * Interface for a test definition in the configuration
 */
export interface TestDefinition {
  id: string;
  name: string;
  description?: string;
}

/**
 * Interface for a test result with configuration information
 */
export interface TestResultWithConfig {
  id: string;
  name: string;
  status: 'passed' | 'failed' | 'not found';
  description?: string;
}

/**
 * Options for the coverage checker
 */
export interface CoverageCheckerOptions {
  /**
   * Path to the Jest test results JSON file
   */
  jestResultsPath?: string;
  
  /**
   * Path to the test configuration JSON file
   */
  configPath?: string;
  
  /**
   * Test configuration object (alternative to configPath)
   */
  config?: TestConfig;
  
  /**
   * Jest test results object (alternative to jestResultsPath)
   */
  jestResults?: JestTestResult;
  
  /**
   * Whether to output results to console
   */
  outputToConsole?: boolean;
}
