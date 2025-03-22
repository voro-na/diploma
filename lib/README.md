# Jest Coverage Checker

A package to check Jest test coverage against a configuration file. This package helps you verify that all required tests are present and passing in your Jest test suite.

## Installation

```bash
npm install jest-coverage-checker
```

## Usage

### As a library

```typescript
import { JestCoverageChecker } from 'jest-coverage-checker';

// Create a new instance of the coverage checker
const checker = new JestCoverageChecker({
  jestResultsPath: './jest-results.json',
  configPath: './test-config.json',
  outputToConsole: true
});

// Run the coverage check
checker.run()
  .then(results => {
    console.log('Coverage check completed');
    
    // Process results
    const passedTests = results.filter(r => r.status === 'passed');
    const failedTests = results.filter(r => r.status === 'failed');
    const notFoundTests = results.filter(r => r.status === 'not found');
    
    console.log(`Passed: ${passedTests.length}`);
    console.log(`Failed: ${failedTests.length}`);
    console.log(`Not found: ${notFoundTests.length}`);
  })
  .catch(error => {
    console.error('Error:', error.message);
  });
```

### As a CLI tool

```bash
# Basic usage
jest-coverage-checker --results ./jest-results.json --config ./test-config.json

# Short options
jest-coverage-checker -r ./jest-results.json -c ./test-config.json

# Show help
jest-coverage-checker --help
```

## Configuration

### Test Configuration File

The test configuration file is a JSON file that defines the tests that should be present in your Jest test suite. Here's an example:

```json
{
  "tests": [
    {
      "id": "test1",
      "name": "Math should add two numbers correctly",
      "description": "Tests the add function"
    },
    {
      "id": "test2",
      "name": "Math should subtract two numbers correctly",
      "description": "Tests the subtract function"
    }
  ]
}
```

### Jest Results File

The Jest results file is a JSON file that contains the results of running Jest tests. You can generate this file by running Jest with the `--json` flag:

```bash
jest --json > jest-results.json
```

Or by adding a script to your package.json:

```json
{
  "scripts": {
    "jest-with-report": "jest --json > jest-results.json"
  }
}
```

## API

### JestCoverageChecker

The main class for checking Jest test coverage.

#### Constructor

```typescript
constructor(options: CoverageCheckerOptions = {})
```

Options:
- `jestResultsPath`: Path to the Jest test results JSON file
- `configPath`: Path to the test configuration JSON file
- `config`: Test configuration object (alternative to configPath)
- `jestResults`: Jest test results object (alternative to jestResultsPath)
- `outputToConsole`: Whether to output results to console (default: true)

#### Methods

##### run

```typescript
async run(): Promise<TestResultWithConfig[]>
```

Runs the coverage check and returns an array of test results with configuration information.

##### sendResultsToApi

```typescript
async sendResultsToApi(results: TestResultWithConfig[], apiUrl: string): Promise<void>
```

Sends test results to an API endpoint. (Placeholder for future implementation)

##### fetchConfigFromApi

```typescript
async fetchConfigFromApi(apiUrl: string): Promise<TestConfig>
```

Fetches test configuration from an API endpoint. (Placeholder for future implementation)

## CLI Options

- `--results, -r <path>`: Path to Jest test results JSON file (required unless using --fetch-config)
- `--config, -c <path>`: Path to test configuration JSON file (required unless using --fetch-config)
- `--api-url, -a <url>`: API URL for fetching config or sending results
- `--fetch-config`: Fetch test configuration from API
- `--send-results`: Send test results to API
- `--help, -h`: Show help message

## Future Plans

- Fetch test configuration from an API
- Send test results to an API
- Support for more detailed test matching
- Integration with CI/CD pipelines

## License

ISC
