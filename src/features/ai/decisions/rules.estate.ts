import type { Rule } from './dsl';

export const ESTATE_RULES: Rule[] = [
  {
    id: 'missing_will',
    when: (c) => !c.hasWill,
    then: (c) => ({
      action: 'estate.create_will',
      reasons: ['no_will_found', 'intestacy_risk'],
      next: ['Schedule consultation with estate planning attorney']
    })
  },
  {
    id: 'trust_recommended', 
    when: (c) => (c.netWorth || 0) > 1000000,
    then: (c) => ({
      action: 'estate.consider_trust',
      reasons: ['high_net_worth', 'tax_optimization'],
      next: ['Evaluate revocable living trust benefits']
    })
  }
];

export const sampleEstateContext = {
  userId: 'user123',
  hasWill: false,
  netWorth: 750000
};