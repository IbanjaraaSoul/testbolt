/**
 * Test Runner with parallel execution and retry logic
 */

import { Logger } from '../utils/Logger';
import type { Config } from '../config/Config';

export interface TestResult {
  name: string;
  status: 'passed' | 'failed' | 'skipped';
  duration: number;
  error?: Error;
  screenshots?: string[];
}

export class TestRunner {
  private logger: Logger;
  private config: Config;

  constructor(config: Config) {
    this.config = config;
    this.logger = new Logger(config.logLevel || 'info');
  }

  /**
   * Run a single test with retry logic
   */
  async runTest(testFn: () => Promise<void>, testName: string): Promise<TestResult> {
    const startTime = Date.now();
    const screenshots: string[] = [];

    for (let attempt = 0; attempt < this.config.retries; attempt++) {
      try {
        if (attempt > 0) {
          this.logger.info(`Retrying test: ${testName} (attempt ${attempt + 1}/${this.config.retries})`);
        }

        await testFn();

        const duration = Date.now() - startTime;
        this.logger.info(`✓ Test passed: ${testName} (${duration}ms)`);
        
        return {
          name: testName,
          status: 'passed',
          duration,
          screenshots
        };
      } catch (error) {
        this.logger.error(`Test failed: ${testName}`, error);
        
        if (this.config.screenshotOnFailure) {
          // Take screenshot on failure
          const screenshot = `screenshot_${testName}_${Date.now()}.png`;
          screenshots.push(screenshot);
        }

        if (attempt === this.config.retries - 1) {
          const duration = Date.now() - startTime;
          return {
            name: testName,
            status: 'failed',
            duration,
            error: error as Error,
            screenshots
          };
        }

        // Wait before retry
        await this.sleep(1000);
      }
    }

    return {
      name: testName,
      status: 'failed',
      duration: Date.now() - startTime,
      screenshots
    };
  }

  /**
   * Run multiple tests in parallel
   */
  async runTests(tests: Array<{ name: string; fn: () => Promise<void> }>): Promise<TestResult[]> {
    if (this.config.parallel) {
      return this.runTestsParallel(tests);
    } else {
      return this.runTestsSequential(tests);
    }
  }

  private async runTestsSequential(tests: Array<{ name: string; fn: () => Promise<void> }>): Promise<TestResult[]> {
    const results: TestResult[] = [];
    for (const test of tests) {
      const result = await this.runTest(test.fn, test.name);
      results.push(result);
    }
    return results;
  }

  private async runTestsParallel(tests: Array<{ name: string; fn: () => Promise<void> }>): Promise<TestResult[]> {
    const results: TestResult[] = [];
    const chunks = this.chunkArray(tests, this.config.maxParallel);

    for (const chunk of chunks) {
      const chunkResults = await Promise.all(
        chunk.map(test => this.runTest(test.fn, test.name))
      );
      results.push(...chunkResults);
    }

    return results;
  }

  private chunkArray<T>(array: T[], size: number): T[][] {
    const chunks: T[][] = [];
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size));
    }
    return chunks;
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

