// NIL Smoke Tests Runner
// Quick script to run NIL demo smoke tests for safety validation

export async function runNilSmokeTests() {
  const results = {
    passed: 0,
    failed: 0,
    total: 0,
    tests: [] as { name: string; status: 'pass' | 'fail'; error?: string }[]
  };

  console.log('🚀 Running NIL Demo Smoke Tests...');

  // Test 1: Demo Reset Functionality
  try {
    results.total++;
    // Mock test - in real implementation would use actual browser automation
    const demoResetTest = await simulateDemoReset();
    if (demoResetTest.success) {
      results.passed++;
      results.tests.push({ name: 'Demo Reset', status: 'pass' });
      console.log('✅ Demo Reset: PASS');
    } else {
      throw new Error(demoResetTest.error);
    }
  } catch (error) {
    results.failed++;
    results.tests.push({ 
      name: 'Demo Reset', 
      status: 'fail', 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
    console.log('❌ Demo Reset: FAIL');
  }

  // Test 2: Education Modules
  try {
    results.total++;
    const educationTest = await simulateEducationCheck();
    if (educationTest.success) {
      results.passed++;
      results.tests.push({ name: 'Education Modules', status: 'pass' });
      console.log('✅ Education Modules: PASS');
    } else {
      throw new Error(educationTest.error);
    }
  } catch (error) {
    results.failed++;
    results.tests.push({ 
      name: 'Education Modules', 
      status: 'fail', 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
    console.log('❌ Education Modules: FAIL');
  }

  // Test 3: Offer Creation & Receipts
  try {
    results.total++;
    const offerTest = await simulateOfferCreation();
    if (offerTest.success) {
      results.passed++;
      results.tests.push({ name: 'Offer & Receipts', status: 'pass' });
      console.log('✅ Offer & Receipts: PASS');
    } else {
      throw new Error(offerTest.error);
    }
  } catch (error) {
    results.failed++;
    results.tests.push({ 
      name: 'Offer & Receipts', 
      status: 'fail', 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
    console.log('❌ Offer & Receipts: FAIL');
  }

  // Test 4: System Health
  try {
    results.total++;
    const healthTest = await simulateHealthCheck();
    if (healthTest.success) {
      results.passed++;
      results.tests.push({ name: 'System Health', status: 'pass' });
      console.log('✅ System Health: PASS');
    } else {
      throw new Error(healthTest.error);
    }
  } catch (error) {
    results.failed++;
    results.tests.push({ 
      name: 'System Health', 
      status: 'fail', 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
    console.log('❌ System Health: FAIL');
  }

  console.log('\n📊 Test Results:');
  console.log(`✅ Passed: ${results.passed}/${results.total}`);
  console.log(`❌ Failed: ${results.failed}/${results.total}`);
  console.log(`📈 Success Rate: ${Math.round((results.passed / results.total) * 100)}%`);

  return results;
}

// Mock test implementations (would be replaced with actual Playwright tests)
async function simulateDemoReset() {
  try {
    const { loadNilFixtures, getNilFixturesHealth } = await import('@/fixtures/fixtures.nil');
    
    const snapshot = await loadNilFixtures('coach');
    const health = getNilFixturesHealth();
    
    if (snapshot && snapshot.counts.invites > 0) {
      return { success: true };
    } else {
      return { success: false, error: 'No invites found after reset' };
    }
  } catch (error) {
    return { success: false, error: `Demo reset failed: ${error}` };
  }
}

async function simulateEducationCheck() {
  try {
    const { getNilEducationModules } = await import('@/fixtures/fixtures.nil');
    
    const modules = getNilEducationModules();
    
    if (modules.length === 3 && modules.every(m => m.status === 'complete')) {
      return { success: true };
    } else {
      return { success: false, error: `Expected 3 complete modules, got ${modules.length}` };
    }
  } catch (error) {
    return { success: false, error: `Education check failed: ${error}` };
  }
}

async function simulateOfferCreation() {
  try {
    const { getNilOffers } = await import('@/fixtures/fixtures.nil');
    const { listReceipts } = await import('@/features/receipts/record');
    
    const offers = getNilOffers();
    const receipts = listReceipts();
    
    if (offers.length > 0 && receipts.length > 0) {
      return { success: true };
    } else {
      return { success: false, error: 'No offers or receipts found' };
    }
  } catch (error) {
    return { success: false, error: `Offer creation check failed: ${error}` };
  }
}

async function simulateHealthCheck() {
  try {
    const { getNilFixturesHealth } = await import('@/fixtures/fixtures.nil');
    
    const health = getNilFixturesHealth();
    
    if (health && typeof health.hasSnapshot === 'boolean') {
      return { success: true };
    } else {
      return { success: false, error: 'Health check returned invalid data' };
    }
  } catch (error) {
    return { success: false, error: `Health check failed: ${error}` };
  }
}

// Export for use in admin panels or dev tools
export const nilSmokeTestRunner = {
  run: runNilSmokeTests,
  simulateDemoReset,
  simulateEducationCheck,
  simulateOfferCreation,
  simulateHealthCheck
};