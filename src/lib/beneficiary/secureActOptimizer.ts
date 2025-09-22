import { BeneficiaryDesignation } from '@/types/beneficiary-management';

export interface SecureActAnalysis {
  beneficiary_id: string;
  beneficiary_name: string;
  relationship: string;
  age_at_inheritance?: number;
  subject_to_ten_year_rule: boolean;
  eligible_designated_beneficiary: boolean;
  optimization_strategies: string[];
  projected_tax_brackets: Array<{
    year: number;
    estimated_income: number;
    tax_bracket: string;
    recommended_distribution: number;
  }>;
}

export interface RetirementAccountOptimization {
  account_id: string;
  account_type: string;
  current_balance: number;
  beneficiary_analyses: SecureActAnalysis[];
  overall_strategy: string;
  tax_savings_potential: number;
}

/**
 * Analyzes beneficiary designations for SECURE Act compliance and tax optimization
 */
export class SecureActOptimizer {
  
  /**
   * Determines if a beneficiary is an Eligible Designated Beneficiary (EDB)
   * EDBs include: surviving spouse, disabled/chronically ill, minor child, 
   * person not more than 10 years younger than account owner
   */
  private isEligibleDesignatedBeneficiary(
    beneficiary: BeneficiaryDesignation,
    accountOwnerAge: number = 65
  ): boolean {
    // Spouse is always EDB
    if (beneficiary.relationship === 'spouse') return true;
    
    // Minor child (until age of majority) - simplified check
    if (beneficiary.relationship === 'child' && beneficiary.date_of_birth) {
      const birthDate = new Date(beneficiary.date_of_birth);
      const currentAge = new Date().getFullYear() - birthDate.getFullYear();
      return currentAge < 18; // Simplified - actual rule is more complex
    }
    
    // Disabled/chronically ill would need additional data not in current model
    // Person not more than 10 years younger would need account owner birthdate
    
    return false;
  }

  /**
   * Calculates projected age at time of inheritance
   */
  private calculateAgeAtInheritance(
    beneficiaryBirthDate: string,
    yearsToInheritance: number = 10
  ): number {
    const birthDate = new Date(beneficiaryBirthDate);
    const currentAge = new Date().getFullYear() - birthDate.getFullYear();
    return currentAge + yearsToInheritance;
  }

  /**
   * Generates tax-optimized distribution strategy for 10-year rule
   */
  private generateDistributionStrategy(
    accountBalance: number,
    beneficiaryAge: number,
    relationship: string
  ): Array<{
    year: number;
    estimated_income: number;
    tax_bracket: string;
    recommended_distribution: number;
  }> {
    const strategy = [];
    let remainingBalance = accountBalance;
    
    // Simplified tax bracket assumptions - would use actual tax service in production
    const estimateIncome = (age: number) => {
      if (age < 25) return 45000;
      if (age < 35) return 75000;
      if (age < 50) return 95000;
      if (age < 65) return 110000;
      return 60000; // Retirement income
    };

    const getTaxBracket = (income: number) => {
      if (income <= 44725) return '12%';
      if (income <= 95375) return '22%';
      if (income <= 182050) return '24%';
      if (income <= 231250) return '32%';
      if (income <= 578125) return '35%';
      return '37%';
    };

    // Strategy: Distribute more in lower income/tax bracket years
    for (let year = 1; year <= 10; year++) {
      const ageInYear = beneficiaryAge + year;
      const estimatedIncome = estimateIncome(ageInYear);
      const currentBracket = getTaxBracket(estimatedIncome);
      
      // More sophisticated distribution logic
      let distributionPercentage;
      if (currentBracket === '12%' || currentBracket === '22%') {
        distributionPercentage = 0.15; // Take more in lower tax years
      } else if (currentBracket === '24%') {
        distributionPercentage = 0.10;
      } else {
        distributionPercentage = 0.08; // Take less in higher tax years
      }

      // Ensure we deplete the account by year 10
      if (year === 10) {
        distributionPercentage = 1.0; // Take remaining balance
      }

      const recommendedDistribution = Math.min(
        remainingBalance * distributionPercentage,
        remainingBalance
      );

      strategy.push({
        year,
        estimated_income: estimatedIncome,
        tax_bracket: currentBracket,
        recommended_distribution: Math.round(recommendedDistribution)
      });

      remainingBalance -= recommendedDistribution;
      
      if (remainingBalance <= 0) break;
    }

    return strategy;
  }

  /**
   * Analyzes a single beneficiary for SECURE Act implications
   */
  analyzeSecureActBeneficiary(
    beneficiary: BeneficiaryDesignation,
    accountBalance: number,
    accountOwnerAge: number = 65
  ): SecureActAnalysis {
    const isEDB = this.isEligibleDesignatedBeneficiary(beneficiary, accountOwnerAge);
    const subjectToTenYearRule = !isEDB;
    
    let ageAtInheritance: number | undefined;
    let optimizationStrategies: string[] = [];
    let projectedTaxBrackets: SecureActAnalysis['projected_tax_brackets'] = [];

    if (beneficiary.date_of_birth) {
      ageAtInheritance = this.calculateAgeAtInheritance(beneficiary.date_of_birth);
      
      if (subjectToTenYearRule) {
        projectedTaxBrackets = this.generateDistributionStrategy(
          accountBalance * (beneficiary.percentage / 100),
          ageAtInheritance,
          beneficiary.relationship
        );
      }
    }

    // Generate optimization strategies based on beneficiary profile
    if (beneficiary.relationship === 'spouse') {
      optimizationStrategies.push(
        'Consider spousal rollover to own IRA for maximum deferral',
        'Evaluate Roth conversion opportunities while in lower tax brackets',
        'Plan RMDs based on spouse\'s age for optimal tax management'
      );
    } else if (subjectToTenYearRule) {
      optimizationStrategies.push(
        'Distribute more in lower tax bracket years (typically ages 20-30)',
        'Consider annual distributions to avoid large lump sum in year 10',
        'Coordinate with beneficiary\'s other income sources',
        'Evaluate gift tax implications if supporting beneficiary during 10-year period'
      );
      
      if (ageAtInheritance && ageAtInheritance < 30) {
        optimizationStrategies.push(
          'Beneficiary likely in lower tax brackets - consider larger early distributions'
        );
      }
    } else {
      optimizationStrategies.push(
        'Eligible Designated Beneficiary - can use life expectancy method',
        'Annual RMDs based on beneficiary life expectancy tables'
      );
    }

    return {
      beneficiary_id: beneficiary.id,
      beneficiary_name: beneficiary.beneficiary_name,
      relationship: beneficiary.relationship,
      age_at_inheritance: ageAtInheritance,
      subject_to_ten_year_rule: subjectToTenYearRule,
      eligible_designated_beneficiary: isEDB,
      optimization_strategies: optimizationStrategies,
      projected_tax_brackets: projectedTaxBrackets
    };
  }

  /**
   * Optimizes retirement account beneficiary strategy
   */
  optimizeRetirementAccount(
    accountId: string,
    accountType: string,
    currentBalance: number,
    beneficiaries: BeneficiaryDesignation[],
    accountOwnerAge: number = 65
  ): RetirementAccountOptimization {
    const beneficiaryAnalyses = beneficiaries.map(ben => 
      this.analyzeSecureActBeneficiary(ben, currentBalance, accountOwnerAge)
    );

    // Calculate overall strategy and tax savings potential
    let overallStrategy = '';
    let taxSavingsPotential = 0;

    const hasSpouse = beneficiaries.some(b => b.relationship === 'spouse');
    const hasMinorChildren = beneficiaries.some(b => 
      b.relationship === 'child' && b.date_of_birth && 
      (new Date().getFullYear() - new Date(b.date_of_birth).getFullYear()) < 18
    );

    if (hasSpouse) {
      overallStrategy = 'Spousal beneficiary provides maximum flexibility. Consider spousal rollover for optimal tax deferral and RMD planning.';
      taxSavingsPotential = currentBalance * 0.15; // Estimated 15% tax savings from optimal planning
    } else if (hasMinorChildren) {
      overallStrategy = 'Minor children are Eligible Designated Beneficiaries until age of majority. Plan transition to 10-year rule when they reach adulthood.';
      taxSavingsPotential = currentBalance * 0.08;
    } else {
      overallStrategy = 'All beneficiaries subject to 10-year rule. Focus on tax bracket optimization and annual distribution planning.';
      taxSavingsPotential = currentBalance * 0.05;
    }

    return {
      account_id: accountId,
      account_type: accountType,
      current_balance: currentBalance,
      beneficiary_analyses: beneficiaryAnalyses,
      overall_strategy: overallStrategy,
      tax_savings_potential: Math.round(taxSavingsPotential)
    };
  }
}

export const secureActOptimizer = new SecureActOptimizer();