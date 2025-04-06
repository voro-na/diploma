import axios from 'axios';
import {
    CoverageCheckerOptions,
    JestTestResult,
    TestConfig,
    TestResultWithConfig,
    CreateTestGroupDto
} from './types';
import {
    loadTestConfig,
    matchTestsWithConfig,
    parseJestResults,
    printResults
} from './parser';

/**
 * Jest Coverage Checker
 * 
 * Checks Jest test coverage against a configuration file
 */
export class JestCoverageChecker {
    private options: CoverageCheckerOptions;

    /**
     * Creates a new instance of JestCoverageChecker
     * @param options Options for the coverage checker
     */
    constructor(options: CoverageCheckerOptions = {}) {
        this.options = {
            outputToConsole: true,
            ...options
        };
    }

    /**
     * Runs the coverage check
     * @returns Promise that resolves to an array of test results with configuration information
     */
    async run(): Promise<TestResultWithConfig[]> {
        let jestResults: JestTestResult;
        let config: TestConfig;

        // Load Jest results
        if (this.options.jestResults) {
            jestResults = this.options.jestResults;
        } else if (this.options.jestResultsPath) {
            jestResults = parseJestResults(this.options.jestResultsPath);
        } else {
            throw new Error('Either jestResults or jestResultsPath must be provided');
        }

        if (this.options.config) {
            config = this.options.config;
        } else if (this.options.configPath) {
            config = loadTestConfig(this.options.configPath);
        } else {
            throw new Error('Either config or configPath must be provided');
        }

        // Match tests with configuration
        const results = matchTestsWithConfig(jestResults, config);
        // Print results to console if enabled
        if (this.options.outputToConsole) {
            printResults(results);
        }

        // If API URL is provided in options, send results to API
        if (this.options.apiBaseUrl) {
            await this.sendResultsToApi(results, this.options.apiBaseUrl, this.options.projectSlug || 'project-5');
        }

        return results;
    }

    /**
     * Sends test results to an API endpoint
     * @param results Test results with configuration information
     * @param apiBaseUrl Base API URL (e.g., http://localhost:3000/api)
     * @param projectSlug Project slug (default: 'project-5')
     * @returns Promise that resolves when the results have been sent
     */
    async sendResultsToApi(
        results: TestResultWithConfig[],
        apiBaseUrl: string,
        projectSlug: string
    ): Promise<void> {
        try {
            console.log(`Sending results to API: ${apiBaseUrl}`);

            // Get groupSlug and featureSlug from the first result
            const groupSlug = results[0]?.groupSlug || 'default';
            const featureSlug = results[0]?.featureSlug || 'default';

            // Group tests by their status
            const testsByStatus = new Map<string, TestResultWithConfig[]>();

            // Process all test results
            results.forEach((testResult) => {
                const status = testResult.status;
                if (!testsByStatus.has(status)) {
                    testsByStatus.set(status, []);
                }
                testsByStatus.get(status)!.push(testResult);
            });

            // Create payload according to CreateTestGroupDto interface
            const payload: CreateTestGroupDto[] = [];

            // Send results for each status group
            for (const [status, tests] of testsByStatus.entries()) {
                // Format data for API according to CreateTestGroupDto and CreateTestDto interfaces
                const testGroup: CreateTestGroupDto = {
                    name: featureSlug,
                    tests: tests.map(test => ({
                        name: test.name,
                        description: test.description,
                        status: test.status
                    }))
                };

                payload.push(testGroup);
            }

            const apiUrl = `${apiBaseUrl}/projects/${projectSlug}/groups/${groupSlug}/features/${featureSlug}`;
            console.log(`Sending test results to ${apiUrl}`);
            console.log(payload);

            // Make API call
            const response = await axios.post(apiUrl, payload);
            console.log(`API response status: ${response.status}`);

            console.log('All test results sent to API successfully');
        } catch (error) {
            console.error('Error sending results to API:', error);
            throw new Error(`Failed to send results to API: ${(error as Error).message}`);
        }
    }

    /**
     * Fetches test configuration from an API endpoint
     * @param apiUrl API endpoint URL
     * @returns Promise that resolves to a test configuration
     */
    async fetchConfigFromApi(apiUrl: string): Promise<TestConfig> {
        try {
            // This is a placeholder for future implementation
            // In a real implementation, you would use axios or fetch to get the configuration
            console.log(`Fetching config from API: ${apiUrl}`);
            console.log('This feature is not yet implemented');

            // Example implementation:
            // const axios = require('axios');
            // const response = await axios.get(apiUrl);
            // return response.data;

            // Return a dummy config for now
            return {
                tests: []
            };
        } catch (error) {
            console.error('Error fetching config from API:', error);
            throw new Error(`Failed to fetch config from API: ${(error as Error).message}`);
        }
    }
}

// Export types
export * from './types';
