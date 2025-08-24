/**
 * Production pricing & SLA configuration
 */

export interface NotaryPricing {
  ron: {
    baseFee: number;
    perSignerFee: number;
    witnessServiceFee: number;
  };
  inPerson: {
    baseFee: number;
    travelFee: number;
    mileageRate: number;
  };
  volumeTiers: Array<{
    minVolume: number;
    discount: number; // percentage
  }>;
  sla: {
    acceptTime: number; // minutes
    sessionStart: number; // minutes
    videoUptime: number; // percentage
  };
}

export const PRODUCTION_PRICING: NotaryPricing = {
  ron: {
    baseFee: 25,
    perSignerFee: 10,
    witnessServiceFee: 10
  },
  inPerson: {
    baseFee: 75,
    travelFee: 50,
    mileageRate: 0.65 // per mile
  },
  volumeTiers: [
    { minVolume: 100, discount: 5 },
    { minVolume: 500, discount: 10 },
    { minVolume: 1000, discount: 15 }
  ],
  sla: {
    acceptTime: 2, // < 2 minutes
    sessionStart: 15, // < 15 minutes
    videoUptime: 99.9 // 99.9% uptime
  }
};

export function calculateNotaryFees(
  sessionType: 'RON' | 'IN_PERSON',
  signerCount: number,
  witnessCount: number,
  distance?: number,
  volumeDiscount?: number
): { baseFee: number; additionalFees: number; total: number } {
  const pricing = PRODUCTION_PRICING;
  
  let baseFee = sessionType === 'RON' ? pricing.ron.baseFee : pricing.inPerson.baseFee;
  let additionalFees = 0;
  
  if (sessionType === 'RON') {
    additionalFees += (signerCount - 1) * pricing.ron.perSignerFee;
    additionalFees += witnessCount * pricing.ron.witnessServiceFee;
  } else {
    additionalFees += pricing.inPerson.travelFee;
    if (distance) {
      additionalFees += distance * pricing.inPerson.mileageRate;
    }
  }
  
  let total = baseFee + additionalFees;
  
  if (volumeDiscount) {
    total *= (1 - volumeDiscount / 100);
  }
  
  return { baseFee, additionalFees, total };
}