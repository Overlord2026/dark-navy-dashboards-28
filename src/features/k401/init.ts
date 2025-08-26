import { registerMoreProviderRules } from './forms/rulesMore';
import { setProviderRule } from './store';
import { RULES_TOP8 } from './forms/rulesTop8';

// Initialize all provider rules (top 8 + extended list)
export function initializeProviderRules() {
  // Load the top 8 rules first
  for (const rule of RULES_TOP8) {
    setProviderRule(rule);
  }
  
  // Load the extended list (20+ more providers)
  registerMoreProviderRules(setProviderRule);
  
  console.log('✅ Provider rules initialized');
}

// Auto-initialize when module loads
if (typeof window !== 'undefined') {
  initializeProviderRules();
}