import axios from 'axios';
import {
    CoverageCheckerOptions,
    JestTestResult,
    TestConfig,
    TestResultWithConfig
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

        return results;
    }

    /**
     * Sends test results to an API endpoint
     * @param jestResults Raw Jest test results
     * @param apiBaseUrl Base API URL (e.g., http://localhost:3000/api)
     * @param projectSlug Project slug (default: 'project-5')
     * @returns Promise that resolves when the results have been sent
     */
    async sendResultsToApi(
        jestResults: JestTestResult,
        apiBaseUrl: string,
        projectSlug: string = 'project-5'
    ): Promise<void> {
        try {
            console.log(`Sending results to API: ${apiBaseUrl}`);
            
            // Group tests by their ancestor titles
            const testsByGroup = new Map<string, Map<string, any[]>>();
            
            // Process all test results
            jestResults.testResults.forEach((fileResult) => {
                fileResult.testResults.forEach((testResult) => {
                    const groupSlug = testResult.ancestorTitles[0] || 'default';
                    const featureSlug = testResult.ancestorTitles[1] || 'default';
                    
                    // Initialize group if it doesn't exist
                    if (!testsByGroup.has(groupSlug)) {
                        testsByGroup.set(groupSlug, new Map<string, any[]>());
                    }
                    
                    // Initialize feature if it doesn't exist
                    const groupMap = testsByGroup.get(groupSlug)!;
                    if (!groupMap.has(featureSlug)) {
                        groupMap.set(featureSlug, []);
                    }
                    
                    // Add test to feature
                    const featureTests = groupMap.get(featureSlug)!;
                    featureTests.push({
                        name: testResult.title,
                        description: `Test from ${fileResult.testFilePath}`,
                        status: testResult.status
                    });
                });
            });
            
            // Send results for each group and feature
            for (const [groupSlug, groupMap] of testsByGroup.entries()) {
                for (const [featureSlug, tests] of groupMap.entries()) {
                    const url = `${apiBaseUrl}/projects/${projectSlug}/groups/${groupSlug}/features/${featureSlug}`;
                    
                    // Format data according to CreateTestGroupDto
                    const payload = [
                        {
                            name: `${groupSlug} - ${featureSlug}`,
                            tests: tests.map(test => ({
                                name: test.name,
                                description: test.description,
                                status: test.status
                            }))
                        }
                    ];
                    
                    console.log(`Sending ${tests.length} tests to ${url}`);

                    console.log(url, payload)
                    
                    // Make API call
                    const response = await axios.post(url, payload);
                    console.log(`API response status: ${response.status}`);
                }
            }
            
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
