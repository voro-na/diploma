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
  groupSlug?: string;
  featureSlug?: string;
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
  status: string;
  description: string;
  groupSlug: string;
  featureSlug: string;
  config?: TestDefinition;
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

  /**
   * Base API URL for sending results (e.g., http://localhost:3000/api)
   */
  apiBaseUrl?: string;

  /**
   * Project slug for API endpoints (default: 'project-5')
   */
  projectSlug?: string;
}

/**
 * Interface for test data sent to the API
 */
export interface CreateTestDto {
  name: string;
  description?: string;
  link?: string;
  status: string;
}

/**
 * Interface for test group data sent to the API
 */
export interface CreateTestGroupDto {
  name: string;
  tests: CreateTestDto[];
}
