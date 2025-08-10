import { SwagPhase } from '@/types/swag-retirement';

export interface PhaseConfig {
  id: string;
  name: string;
  horizonYears: number;
  liquidityTarget: number; // percentage
  driftThreshold: number; // percentage
  feeCap: number; // percentage
  riskTolerance: 'conservative' | 'moderate' | 'aggressive';
  cashFlowRequirement: 'high' | 'medium' | 'low';
  taxSensitivity: 'high' | 'medium' | 'low';
  allocationConstraints: {
    minCash: number;
    maxAlts: number;
    maxSingleAsset: number;
    minDiversification: number;
  };
}

export const SWAG_PHASE_CONFIGS: Record<string, PhaseConfig> = {
  income_now: {
    id: 'income_now',
    name: 'Income Now',
    horizonYears: 5,
    liquidityTarget: 0.8, // 80% liquid assets
    driftThreshold: 0.03, // 3% drift triggers rebalance
    feeCap: 0.005, // 0.5% fee cap
    riskTolerance: 'conservative',
    cashFlowRequirement: 'high',
    taxSensitivity: 'high',
    allocationConstraints: {
      minCash: 0.1, // 10% minimum cash
      maxAlts: 0.1, // 10% maximum alternatives
      maxSingleAsset: 0.3, // 30% maximum single asset
      minDiversification: 5 // minimum 5 asset classes
    }
  },
  income_later: {
    id: 'income_later',
    name: 'Income Later',
    horizonYears: 15,
    liquidityTarget: 0.6, // 60% liquid assets
    driftThreshold: 0.05, // 5% drift triggers rebalance
    feeCap: 0.0075, // 0.75% fee cap
    riskTolerance: 'moderate',
    cashFlowRequirement: 'medium',
    taxSensitivity: 'medium',
    allocationConstraints: {
      minCash: 0.05, // 5% minimum cash
      maxAlts: 0.25, // 25% maximum alternatives
      maxSingleAsset: 0.4, // 40% maximum single asset
      minDiversification: 6 // minimum 6 asset classes
    }
  },
  growth: {
    id: 'growth',
    name: 'Growth',
    horizonYears: 25,
    liquidityTarget: 0.4, // 40% liquid assets
    driftThreshold: 0.07, // 7% drift triggers rebalance
    feeCap: 0.01, // 1% fee cap
    riskTolerance: 'aggressive',
    cashFlowRequirement: 'low',
    taxSensitivity: 'low',
    allocationConstraints: {
      minCash: 0.02, // 2% minimum cash
      maxAlts: 0.4, // 40% maximum alternatives
      maxSingleAsset: 0.5, // 50% maximum single asset
      minDiversification: 7 // minimum 7 asset classes
    }
  },
  legacy: {
    id: 'legacy',
    name: 'Legacy',
    horizonYears: 50,
    liquidityTarget: 0.3, // 30% liquid assets
    driftThreshold: 0.1, // 10% drift triggers rebalance
    feeCap: 0.015, // 1.5% fee cap
    riskTolerance: 'moderate',
    cashFlowRequirement: 'low',
    taxSensitivity: 'high',
    allocationConstraints: {
      minCash: 0.05, // 5% minimum cash
      maxAlts: 0.5, // 50% maximum alternatives
      maxSingleAsset: 0.6, // 60% maximum single asset
      minDiversification: 8 // minimum 8 asset classes
    }
  }
};

export interface AdvisorConstraintOverlay {
  userId: string;
  phaseId: string;
  customConstraints: {
    excludedAssetClasses?: string[];
    minAllocations?: Record<string, number>;
    maxAllocations?: Record<string, number>;
    esgRequirements?: boolean;
    halalCompliant?: boolean;
    taxOptimized?: boolean;
  };
  riskAdjustment?: number; // -1 to 1 multiplier
  feePreference?: 'minimize' | 'balance' | 'performance';
}

export class PhasePolicy {
  static getPhaseConfig(phaseId: string): PhaseConfig {
    const config = SWAG_PHASE_CONFIGS[phaseId];
    if (!config) {
      throw new Error(`Unknown phase: ${phaseId}`);
    }
    return config;
  }

  static getAllPhaseConfigs(): PhaseConfig[] {
    return Object.values(SWAG_PHASE_CONFIGS);
  }

  static applyAdvisorOverlay(
    baseConfig: PhaseConfig,
    overlay: AdvisorConstraintOverlay
  ): PhaseConfig {
    const modified = { ...baseConfig };

    // Apply risk adjustment
    if (overlay.riskAdjustment) {
      const riskMap = { conservative: 0, moderate: 1, aggressive: 2 };
      const currentRisk = riskMap[baseConfig.riskTolerance];
      const adjustedRisk = Math.max(0, Math.min(2, currentRisk + overlay.riskAdjustment));
      modified.riskTolerance = ['conservative', 'moderate', 'aggressive'][adjustedRisk] as any;
    }

    // Apply custom constraints
    if (overlay.customConstraints.minAllocations) {
      // Merge with existing constraints
      Object.assign(modified.allocationConstraints, overlay.customConstraints.minAllocations);
    }

    // Adjust fee cap based on preference
    if (overlay.feePreference === 'minimize') {
      modified.feeCap *= 0.8; // 20% lower fee cap
    } else if (overlay.feePreference === 'performance') {
      modified.feeCap *= 1.5; // 50% higher fee cap for performance
    }

    return modified;
  }

  static validatePhaseAllocation(
    allocation: Record<string, number>,
    phaseConfig: PhaseConfig
  ): { valid: boolean; violations: string[] } {
    const violations: string[] = [];
    const { allocationConstraints } = phaseConfig;

    // Check minimum cash
    const cashAllocation = allocation.cash || 0;
    if (cashAllocation < allocationConstraints.minCash) {
      violations.push(`Cash allocation ${(cashAllocation * 100).toFixed(1)}% below minimum ${(allocationConstraints.minCash * 100).toFixed(1)}%`);
    }

    // Check maximum alternatives
    const altsAllocation = (allocation.private_equity || 0) + (allocation.private_debt || 0) + (allocation.real_estate || 0);
    if (altsAllocation > allocationConstraints.maxAlts) {
      violations.push(`Alternatives allocation ${(altsAllocation * 100).toFixed(1)}% exceeds maximum ${(allocationConstraints.maxAlts * 100).toFixed(1)}%`);
    }

    // Check maximum single asset
    const maxSingleAsset = Math.max(...Object.values(allocation));
    if (maxSingleAsset > allocationConstraints.maxSingleAsset) {
      violations.push(`Single asset allocation ${(maxSingleAsset * 100).toFixed(1)}% exceeds maximum ${(allocationConstraints.maxSingleAsset * 100).toFixed(1)}%`);
    }

    // Check diversification
    const nonZeroAssets = Object.values(allocation).filter(weight => weight > 0.01).length;
    if (nonZeroAssets < allocationConstraints.minDiversification) {
      violations.push(`Only ${nonZeroAssets} asset classes, minimum required: ${allocationConstraints.minDiversification}`);
    }

    return {
      valid: violations.length === 0,
      violations
    };
  }
}