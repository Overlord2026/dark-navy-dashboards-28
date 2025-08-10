/**
 * Portfolio Risk Navigator GPS - Core Engine
 * Complete optimization stack with SWAG phase integration
 */

export * from './phasePolicy';
export * from './larb';
export * from './utility';
export * from './optimizer';
export * from './regime';
export * from './pm3';

import { optimizePortfolio, OptimizationInput, OptimizationOutput } from './optimizer';
import { classifyMarketRegime, RegimeInput } from './regime';
import { calculatePM3Score, PM3Input } from './pm3';

export const PortfolioNavigatorGPS = {
  optimize: optimizePortfolio,
  classifyRegime: classifyMarketRegime,
  calculatePM3: calculatePM3Score
};

export type {
  OptimizationInput,
  OptimizationOutput,
  RegimeInput,
  PM3Input
};