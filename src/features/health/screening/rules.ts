export interface ScreeningRule {
  key: string;
  name: string;
  guideline: string;
  interval: string;
  description: string;
  zk: {
    ageGte?: number;
    ageLte?: number;
    sexRequired?: 'male' | 'female';
  };
  planCoverage: {
    preventive: boolean;
    requires_referral?: boolean;
  };
}

export interface ScreeningFacts {
  age: number;
  sex: 'male' | 'female' | 'other';
  plan: {
    preventive_coverage: boolean;
    specialist_referral_required: boolean;
  };
}

const SCREENING_RULES: ScreeningRule[] = [
  {
    key: 'colorectal',
    name: 'Colorectal Cancer Screening',
    guideline: 'USPSTF Grade A',
    interval: '10 years (colonoscopy)',
    description: 'Screening for colorectal cancer in asymptomatic adults',
    zk: {
      ageGte: 45,
      ageLte: 75
    },
    planCoverage: {
      preventive: true,
      requires_referral: false
    }
  },
  {
    key: 'mammography',
    name: 'Breast Cancer Screening (Mammography)',
    guideline: 'USPSTF Grade B',
    interval: '2 years',
    description: 'Screening mammography for breast cancer',
    zk: {
      ageGte: 50,
      ageLte: 74,
      sexRequired: 'female'
    },
    planCoverage: {
      preventive: true,
      requires_referral: false
    }
  },
  {
    key: 'cervical',
    name: 'Cervical Cancer Screening',
    guideline: 'USPSTF Grade A',
    interval: '3 years (Pap) or 5 years (HPV)',
    description: 'Screening for cervical cancer with cervical cytology',
    zk: {
      ageGte: 21,
      ageLte: 65,
      sexRequired: 'female'
    },
    planCoverage: {
      preventive: true,
      requires_referral: false
    }
  },
  {
    key: 'prostate_psa',
    name: 'Prostate Cancer Screening (PSA)',
    guideline: 'USPSTF Grade C',
    interval: '1-2 years (if elected)',
    description: 'PSA-based screening for prostate cancer',
    zk: {
      ageGte: 55,
      ageLte: 69,
      sexRequired: 'male'
    },
    planCoverage: {
      preventive: true,
      requires_referral: false
    }
  },
  {
    key: 'lung_cancer',
    name: 'Lung Cancer Screening (LDCT)',
    guideline: 'USPSTF Grade B',
    interval: '1 year',
    description: 'Low-dose CT screening for lung cancer in high-risk individuals',
    zk: {
      ageGte: 50,
      ageLte: 80
    },
    planCoverage: {
      preventive: true,
      requires_referral: true
    }
  },
  {
    key: 'bone_density',
    name: 'Osteoporosis Screening (DEXA)',
    guideline: 'USPSTF Grade B',
    interval: '2 years',
    description: 'Screening for osteoporosis to prevent fractures',
    zk: {
      ageGte: 65,
      sexRequired: 'female'
    },
    planCoverage: {
      preventive: true,
      requires_referral: false
    }
  },
  {
    key: 'cholesterol',
    name: 'Lipid Screening',
    guideline: 'USPSTF Grade A/B',
    interval: '5 years',
    description: 'Screening for lipid disorders and cardiovascular risk',
    zk: {
      ageGte: 40,
      ageLte: 75
    },
    planCoverage: {
      preventive: true,
      requires_referral: false
    }
  },
  {
    key: 'diabetes',
    name: 'Type 2 Diabetes Screening',
    guideline: 'USPSTF Grade B',
    interval: '3 years',
    description: 'Screening for prediabetes and type 2 diabetes',
    zk: {
      ageGte: 35,
      ageLte: 70
    },
    planCoverage: {
      preventive: true,
      requires_referral: false
    }
  }
];

/**
 * Get applicable screenings based on ZK age proofs and demographics
 */
export function getScreenings(facts: ScreeningFacts): ScreeningRule[] {
  return SCREENING_RULES.filter(rule => {
    // Check ZK age predicates
    if (rule.zk.ageGte && facts.age < rule.zk.ageGte) {
      return false;
    }
    
    if (rule.zk.ageLte && facts.age > rule.zk.ageLte) {
      return false;
    }
    
    // Check sex requirements
    if (rule.zk.sexRequired && facts.sex !== rule.zk.sexRequired) {
      return false;
    }
    
    return true;
  });
}

/**
 * Generate zero-knowledge age predicates for privacy
 */
export function generateZKPredicates(age: number): Record<string, boolean> {
  return {
    ageGte21: age >= 21,
    ageGte35: age >= 35,
    ageGte40: age >= 40,
    ageGte45: age >= 45,
    ageGte50: age >= 50,
    ageGte55: age >= 55,
    ageGte65: age >= 65,
    ageLte65: age <= 65,
    ageLte69: age <= 69,
    ageLte70: age <= 70,
    ageLte74: age <= 74,
    ageLte75: age <= 75,
    ageLte80: age <= 80
  };
}

/**
 * Check if screening is covered by plan
 */
export function isScreeningCovered(rule: ScreeningRule, facts: ScreeningFacts): boolean {
  if (!rule.planCoverage.preventive) {
    return false;
  }
  
  if (!facts.plan.preventive_coverage) {
    return false;
  }
  
  if (rule.planCoverage.requires_referral && facts.plan.specialist_referral_required) {
    return true; // Covered but needs referral
  }
  
  return true;
}