
import { defineConfig } from 'cypress'

export default defineConfig({
  e2e: {
    baseUrl: process.env.E2E_URL || 'https://00a95494-1379-485c-9fca-9a2135238b56.lovableproject.com',
    setupNodeEvents(on, config) {
      // implement node event listeners here
      
      // Add task for test reporting
      on('task', {
        log(message) {
          console.log(message)
          return null
        },
        
        // Test results aggregation
        saveTestResults(results) {
          console.log('Saving test results:', results);
          // In a real implementation, this would save to a file or send to monitoring service
          return null
        }
      })
      
      // Add after:run hook for test reporting
      on('after:run', (results) => {
        if (results) {
          const summary = {
            totalTests: results.totalTests,
            totalPassed: results.totalPassed,
            totalFailed: results.totalFailed,
            totalSkipped: results.totalSkipped,
            totalDuration: results.totalDuration,
            startedTestsAt: results.startedTestsAt,
            endedTestsAt: results.endedTestsAt,
            runs: results.runs?.map(run => ({
              spec: run.spec.relative,
              stats: run.stats,
              tests: run.tests?.map(test => ({
                title: test.title,
                state: test.state,
                duration: test.duration,
                err: test.err?.message
              }))
            }))
          };
          
          console.log('\n=== CYPRESS TEST EXECUTION SUMMARY ===');
          console.log(`Total Tests: ${summary.totalTests}`);
          console.log(`Passed: ${summary.totalPassed}`);
          console.log(`Failed: ${summary.totalFailed}`);
          console.log(`Skipped: ${summary.totalSkipped}`);
          console.log(`Duration: ${summary.totalDuration}ms`);
          console.log('=====================================\n');
          
          // Log failed tests
          if (summary.totalFailed > 0) {
            console.log('FAILED TESTS:');
            summary.runs?.forEach(run => {
              run.tests?.forEach(test => {
                if (test.state === 'failed') {
                  console.log(`- ${run.spec}: ${test.title}`);
                  if (test.err) {
                    console.log(`  Error: ${test.err}`);
                  }
                }
              });
            });
            console.log('');
          }
        }
      });
    },
    viewportWidth: 1280,
    viewportHeight: 720,
    video: true,
    screenshotOnRunFailure: true,
    defaultCommandTimeout: 10000,
    requestTimeout: 10000,
    responseTimeout: 10000,
    retries: {
      runMode: 2,
      openMode: 0
    },
    // Test isolation
    testIsolation: true,
    // Environment variables for test configuration
    env: {
      TEST_EMAIL_SERVICE: 'mock',
      RESET_DATA_TIMEOUT: 30000,
      PERFORMANCE_THRESHOLD_MS: 10000
    }
  },
  component: {
    devServer: {
      framework: 'react',
      bundler: 'vite',
    },
  },
})
