// Quick diagnostics test script
const { runDiagnostics } = require('./src/services/diagnostics/index.js');

async function test() {
  try {
    console.log('Running diagnostics...');
    const results = await runDiagnostics();
    console.log('Diagnostics Results:', JSON.stringify(results, null, 2));
  } catch (error) {
    console.error('Diagnostics failed:', error);
  }
}

test();