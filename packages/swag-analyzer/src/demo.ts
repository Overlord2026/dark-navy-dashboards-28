/**
 * SWAG Analyzer Demo Script
 * Runs breach + recovery scenarios and outputs receipts
 */

import { SWAGAnalyzer, createDefaultInput } from './index';
import { makeOutcomeReceipt, outcomeScore } from './core';
import { PhaseId } from './models';

async function runDemo() {
  console.log('🚀 SWAG Analyzer Demo - Breach + Recovery Scenarios');
  console.log('=' * 60);

  const analyzer = new SWAGAnalyzer('demo_seed_2024');
  
  // Base scenario
  const baseInput = {
    ...createDefaultInput('demo_household_001'),
    initialPortfolio: 2000000,
    currentAge: 55,
    retirementAge: 65,
    lifeExpectancy: 90
  };

  // Scenario 1: Market Breach (High DGBP)
  console.log('\n📉 Running BREACH Scenario (Market Crash)...');
  const breachInput = {
    ...baseInput,
    scenario: {
      ...baseInput.scenario!,
      equity: {
        ...baseInput.scenario!.equity,
        mu: [-0.15, -0.30], // Severe bear market
        sigma: [0.35, 0.45]  // High volatility
      }
    }
  };

  const breachResult = await analyzer.analyze(breachInput as any);
  
  // Generate breach receipt
  const breachReceipt = makeOutcomeReceipt({
    policyHash: 'breach_policy_001',
    modelHash: 'swag_v1_breach',
    regimeState: 'bear_market',
    phaseMetrics: breachResult.phaseMetrics,
    trades: ['defensive_rebalance', 'ltc_insurance_increase'],
    lotDeltas: { equity: -0.15, bonds: +0.10, cash: +0.05 },
    seed: 'demo_seed_2024'
  });

  console.log('\n📋 BREACH RECEIPT:');
  console.log('Hash:', breachReceipt.hash);
  console.log('Phase Scores:');
  for (const [phase, metrics] of Object.entries(breachResult.phaseMetrics)) {
    console.log(`  ${phase}: OS=${metrics.OS.toFixed(2)}, DGBP=${(metrics.DGBP * 100).toFixed(1)}%`);
  }

  // Scenario 2: Recovery (Low DGBP, High ISP)
  console.log('\n📈 Running RECOVERY Scenario (Bull Market)...');
  const recoveryInput = {
    ...baseInput,
    scenario: {
      ...baseInput.scenario!,
      equity: {
        ...baseInput.scenario!.equity,
        mu: [0.12, 0.08], // Strong bull market
        sigma: [0.12, 0.16]  // Lower volatility
      }
    }
  };

  const recoveryResult = await analyzer.analyze(recoveryInput as any);
  
  // Generate recovery receipt
  const recoveryReceipt = makeOutcomeReceipt({
    policyHash: 'recovery_policy_001',
    modelHash: 'swag_v1_recovery',
    regimeState: 'bull_market',
    phaseMetrics: recoveryResult.phaseMetrics,
    trades: ['growth_rebalance', 'ltc_premium_optimization'],
    lotDeltas: { equity: +0.10, bonds: -0.05, infrastructure: +0.03, crypto: +0.02 },
    seed: 'demo_seed_2024'
  });

  console.log('\n📋 RECOVERY RECEIPT:');
  console.log('Hash:', recoveryReceipt.hash);
  console.log('Phase Scores:');
  for (const [phase, metrics] of Object.entries(recoveryResult.phaseMetrics)) {
    console.log(`  ${phase}: OS=${metrics.OS.toFixed(2)}, ISP=${(metrics.ISP * 100).toFixed(1)}%`);
  }

  // Comparison Summary
  console.log('\n📊 BREACH vs RECOVERY COMPARISON:');
  console.log('=' * 40);
  
  const phases: PhaseId[] = ['income_now', 'income_later', 'growth', 'legacy'];
  
  for (const phase of phases) {
    const breachOS = breachResult.phaseMetrics[phase]?.OS || 0;
    const recoveryOS = recoveryResult.phaseMetrics[phase]?.OS || 0;
    const improvement = recoveryOS - breachOS;
    
    console.log(`${phase.toUpperCase()}: ${breachOS.toFixed(2)} → ${recoveryOS.toFixed(2)} (Δ${improvement.toFixed(2)})`);
  }

  // Risk Alerts
  console.log('\n⚠️  RISK ALERTS:');
  for (const phase of phases) {
    const breachDGBP = breachResult.phaseMetrics[phase]?.DGBP || 0;
    if (breachDGBP > 0.15) {
      console.log(`  ${phase}: High drawdown risk (${(breachDGBP * 100).toFixed(1)}%)`);
    }
  }

  console.log('\n✅ Demo completed! Receipts generated for audit trail.');
  
  return {
    breachReceipt,
    recoveryReceipt,
    breachResult,
    recoveryResult
  };
}

// Export for use in other scripts
export { runDemo };

// Run if called directly
if (require.main === module) {
  runDemo().catch(console.error);
}