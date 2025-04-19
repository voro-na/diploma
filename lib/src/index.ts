import {
    CoverageCheckerOptions,
    JestTestResult
} from './types';
import {
    parseJestResults,
    parseTestResults,
    printResults,
    Test
} from './parser';
import axios from 'axios';

interface TestProcessingResult {
    testName: string;
    status: 'success' | 'error';
    error?: string;
}

/**
 * Jest Test Results Parser
 * 
 * Parses Jest test results into a simplified format
 */
export class JestTestParser {
    private options: CoverageCheckerOptions;

    /**
     * Creates a new instance of JestTestParser
     * @param options Options for the parser
     */
    constructor(options: CoverageCheckerOptions = {}) {
        this.options = {
            outputToConsole: true,
            ...options
        };
    }

    /**
     * Prints processing results from the backend
     * @param results Array of test processing results
     */
    private printProcessingResults(results: TestProcessingResult[]): void {
        console.log('\n=== Backend Processing Results ===\n');

        const successTests = results.filter(r => r.status === 'success');
        const failedTests = results.filter(r => r.status === 'error');

        if (successTests.length > 0) {
            console.log('Successfully processed tests:');
            successTests.forEach(test => {
                console.log(`  \x1b[32m✓\x1b[0m ${test.testName}`);
            });
            console.log('');
        }

        if (failedTests.length > 0) {
            console.log('Failed to process tests:');
            failedTests.forEach(test => {
                console.log(`  \x1b[31m✗\x1b[0m ${test.testName}`);
                if (test.error) {
                    console.log(`    Error: ${test.error}`);
                }
            });
            console.log('');
        }

        console.log('Summary:');
        console.log(`  Total processed: ${results.length}`);
        console.log(`  Successful: \x1b[32m${successTests.length}\x1b[0m`);
        console.log(`  Failed: \x1b[31m${failedTests.length}\x1b[0m`);
        console.log('\n===============================\n');
    }

    private async sendTestResults(projectSlug: string, apiUrl: string, tests: Test[]): Promise<TestProcessingResult[]> {
        const endpoint = `${apiUrl}/projects/${projectSlug}/tests/update`;

        try {
            const response = await axios.post(endpoint, {tests});
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw new Error(`Failed to send test results: ${error.response?.data?.message || error.message}`);
            }
            throw error;
        }
    }

    /**
     * Parses Jest test results and optionally sends them to the backend
     * @param options Additional options for processing
     * @param options.apiUrl The base URL of the API server (required for sending results to backend)
     * @param options.projectSlug The project identifier (required for sending results to backend)
     * @returns Promise that resolves to an array of parsed test results
     */
    async parse(options?: { apiUrl?: string; projectSlug?: string }): Promise<Test[]> {
        let jestResults: JestTestResult;

        if (this.options.jestResults) {
            jestResults = this.options.jestResults;
        } else if (this.options.jestResultsPath) {
            jestResults = parseJestResults(this.options.jestResultsPath);
        } else {
            throw new Error('Either jestResults or jestResultsPath must be provided');
        }

        const results = parseTestResults(jestResults);

        if (this.options.outputToConsole) {
            printResults(results);
        }

        if (options?.apiUrl && options?.projectSlug) {
            try {
                console.log('\nSending test results to backend...');
                const processingResults = await this.sendTestResults(options.projectSlug, options.apiUrl, results);
                this.printProcessingResults(processingResults);
            } catch (error) {
                console.error('Failed to send test results to backend:', error);
            }
        }

        return results;
    }
}

export * from './types';
export * from './parser';
