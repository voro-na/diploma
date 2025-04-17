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
     * Parses the test results
     * @returns Promise that resolves to an array of parsed test results
     */
    async parse(): Promise<Test[]> {
        let jestResults: JestTestResult;

        // Get Jest results from options
        if (this.options.jestResults) {
            jestResults = this.options.jestResults;
        } else if (this.options.jestResultsPath) {
            jestResults = parseJestResults(this.options.jestResultsPath);
        } else {
            throw new Error('Either jestResults or jestResultsPath must be provided');
        }

        // Parse the results into our simplified format
        const results = parseTestResults(jestResults);

        // Print results to console if enabled
        if (this.options.outputToConsole) {
            printResults(results);
        }

        return results;
    }
}

export * from './types';
export * from './parser';
