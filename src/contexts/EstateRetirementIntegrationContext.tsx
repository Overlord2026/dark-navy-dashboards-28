import React, { createContext, useContext, useState, useCallback } from 'react';
import { RetirementAnalysisInput, InvestmentAccount } from '@/types/retirement';

export interface BeneficiaryInfo {
  id: string;
  name: string;
  relationship: string;
  age: number;
  taxBracket: number;
  dependsOnInheritance: boolean;
}

export interface SECUREActAnalysis {
  accountId: string;
  accountType: string;
  currentBalance: number;
  projectedBalance: number;
  inheritanceTaxImpact: {
    totalTaxes: number;
    yearlyWithdrawals: Array<{
      year: number;
      withdrawal: number;
      taxes: number;
      afterTaxAmount: number;
    }>;
  };
  rothConversionBenefit: {
    lifetimeSavings: number;
    recommendedConversions: Array<{
      year: number;
      amount: number;
      taxCost: number;
      beneficiarySavings: number;
    }>;
  };
}

export interface EstateSettlementAnalysis {
  totalEstate: number;
  stepUpBasisAssets: number;
  ordinaryIncomeAssets: number;
  beneficiaryTaxBurden: number;
  estimatedSettlementCosts: number;
  liquidityNeeds: number;
  recommendations: Array<{
    id: string;
    type: 'roth_conversion' | 'life_insurance' | 'tax_strategy' | 'liquidity';
    priority: 'high' | 'medium' | 'low';
    description: string;
    impact: number;
    timeline: string;
  }>;
}

interface EstateRetirementIntegrationContextType {
  // Data State
  retirementData: RetirementAnalysisInput | null;
  beneficiaries: BeneficiaryInfo[];
  secureActAnalysis: SECUREActAnalysis[];
  estateSettlement: EstateSettlementAnalysis | null;
  
  // Actions
  setRetirementData: (data: RetirementAnalysisInput) => void;
  addBeneficiary: (beneficiary: BeneficiaryInfo) => void;
  updateBeneficiary: (id: string, updates: Partial<BeneficiaryInfo>) => void;
  removeBeneficiary: (id: string) => void;
  analyzeSecureActImpact: (accounts: InvestmentAccount[]) => Promise<void>;
  generateEstateSettlement: () => Promise<void>;
  
  // Loading States
  loading: boolean;
  analyzing: boolean;
}

const EstateRetirementIntegrationContext = createContext<EstateRetirementIntegrationContextType | undefined>(undefined);

export function EstateRetirementIntegrationProvider({ children }: { children: React.ReactNode }) {
  const [retirementData, setRetirementDataState] = useState<RetirementAnalysisInput | null>(null);
  const [beneficiaries, setBeneficiaries] = useState<BeneficiaryInfo[]>([]);
  const [secureActAnalysis, setSecureActAnalysis] = useState<SECUREActAnalysis[]>([]);
  const [estateSettlement, setEstateSettlement] = useState<EstateSettlementAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);

  const setRetirementData = useCallback((data: RetirementAnalysisInput) => {
    setRetirementDataState(data);
  }, []);

  const addBeneficiary = useCallback((beneficiary: BeneficiaryInfo) => {
    setBeneficiaries(prev => [...prev, beneficiary]);
  }, []);

  const updateBeneficiary = useCallback((id: string, updates: Partial<BeneficiaryInfo>) => {
    setBeneficiaries(prev =>
      prev.map(b => b.id === id ? { ...b, ...updates } : b)
    );
  }, []);

  const removeBeneficiary = useCallback((id: string) => {
    setBeneficiaries(prev => prev.filter(b => b.id !== id));
  }, []);

  const analyzeSecureActImpact = useCallback(async (accounts: InvestmentAccount[]) => {
    setAnalyzing(true);
    try {
      const analysis: SECUREActAnalysis[] = accounts
        .filter(account => 
          account.type === 'traditional_ira' || 
          account.type === '401k' || 
          account.type === '403b' || 
          account.type === '457b'
        )
        .map(account => {
          // Project account balance at retirement (simplified)
          const yearsToRetirement = retirementData?.goals.retirementAge - retirementData?.goals.currentAge || 30;
          const projectedBalance = account.balance * Math.pow(1 + (account.expectedReturn / 100), yearsToRetirement);
          
          // Calculate 10-year withdrawal impact for beneficiaries
          const annualWithdrawal = projectedBalance / 10;
          const avgBeneficiaryTaxRate = beneficiaries.length > 0 
            ? beneficiaries.reduce((sum, b) => sum + b.taxBracket, 0) / beneficiaries.length / 100
            : 0.25; // Default 25%

          const yearlyWithdrawals = Array.from({ length: 10 }, (_, i) => {
            const year = (retirementData?.goals.retirementAge || 65) + i;
            const withdrawal = annualWithdrawal;
            const taxes = withdrawal * avgBeneficiaryTaxRate;
            
            return {
              year,
              withdrawal,
              taxes,
              afterTaxAmount: withdrawal - taxes
            };
          });

          const totalTaxes = yearlyWithdrawals.reduce((sum, w) => sum + w.taxes, 0);

          // Calculate Roth conversion benefits
          const rothConversionBenefit = {
            lifetimeSavings: totalTaxes * 0.7, // Assuming 30% tax rate difference
            recommendedConversions: Array.from({ length: 5 }, (_, i) => {
              const year = (retirementData?.goals.currentAge || 35) + i;
              const amount = projectedBalance * 0.1; // 10% per year
              const taxCost = amount * 0.25; // Current tax rate
              const beneficiarySavings = amount * (avgBeneficiaryTaxRate - 0.25);
              
              return {
                year,
                amount,
                taxCost,
                beneficiarySavings: Math.max(0, beneficiarySavings)
              };
            })
          };

          return {
            accountId: account.id,
            accountType: account.type,
            currentBalance: account.balance,
            projectedBalance,
            inheritanceTaxImpact: {
              totalTaxes,
              yearlyWithdrawals
            },
            rothConversionBenefit
          };
        });

      setSecureActAnalysis(analysis);
    } catch (error) {
      console.error('Error analyzing SECURE Act impact:', error);
    } finally {
      setAnalyzing(false);
    }
  }, [retirementData, beneficiaries]);

  const generateEstateSettlement = useCallback(async () => {
    if (!retirementData) return;
    
    setAnalyzing(true);
    try {
      const totalRetirementAssets = retirementData.accounts.reduce((sum, acc) => sum + acc.balance, 0);
      const stepUpAssets = totalRetirementAssets * 0.4; // Assume 40% get step-up basis
      const ordinaryIncomeAssets = totalRetirementAssets * 0.6; // 60% taxed as ordinary income
      
      const beneficiaryTaxBurden = secureActAnalysis.reduce((sum, analysis) => 
        sum + analysis.inheritanceTaxImpact.totalTaxes, 0
      );
      
      const settlementCosts = totalRetirementAssets * 0.05; // 5% settlement costs
      const liquidityNeeds = beneficiaryTaxBurden + settlementCosts;

      const recommendations = [
        {
          id: '1',
          type: 'roth_conversion' as const,
          priority: 'high' as const,
          description: 'Convert traditional retirement accounts to Roth to reduce beneficiary tax burden',
          impact: beneficiaryTaxBurden * 0.6,
          timeline: '5-10 years before retirement'
        },
        {
          id: '2', 
          type: 'life_insurance' as const,
          priority: 'medium' as const,
          description: 'Consider life insurance to provide liquidity for estate taxes and settlement costs',
          impact: liquidityNeeds,
          timeline: 'Implement within 12 months'
        },
        {
          id: '3',
          type: 'tax_strategy' as const,
          priority: 'high' as const,
          description: 'Coordinate with tax professional for optimal distribution timing',
          impact: beneficiaryTaxBurden * 0.2,
          timeline: 'Annual review required'
        }
      ];

      const settlement: EstateSettlementAnalysis = {
        totalEstate: totalRetirementAssets,
        stepUpBasisAssets: stepUpAssets,
        ordinaryIncomeAssets,
        beneficiaryTaxBurden,
        estimatedSettlementCosts: settlementCosts,
        liquidityNeeds,
        recommendations
      };

      setEstateSettlement(settlement);
    } catch (error) {
      console.error('Error generating estate settlement analysis:', error);
    } finally {
      setAnalyzing(false);
    }
  }, [retirementData, secureActAnalysis]);

  return (
    <EstateRetirementIntegrationContext.Provider
      value={{
        retirementData,
        beneficiaries,
        secureActAnalysis,
        estateSettlement,
        setRetirementData,
        addBeneficiary,
        updateBeneficiary,
        removeBeneficiary,
        analyzeSecureActImpact,
        generateEstateSettlement,
        loading,
        analyzing
      }}
    >
      {children}
    </EstateRetirementIntegrationContext.Provider>
  );
}

export function useEstateRetirementIntegration() {
  const context = useContext(EstateRetirementIntegrationContext);
  if (!context) {
    throw new Error('useEstateRetirementIntegration must be used within EstateRetirementIntegrationProvider');
  }
  return context;
}