import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { TaxBracket, TaxDeduction, TaxRule, FilingStatus } from '@/types/tax-rules';
import { taxRulesOrchestrator } from '@/lib/rulesync/rulesClient';
import { TaxRuleBundle } from '@/types/tax-orchestration';

interface UseTaxRulesReturn {
  brackets: TaxBracket[];
  deductions: TaxDeduction[];
  rules: TaxRule[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  getTaxBrackets: (year: number, filingStatus: FilingStatus) => TaxBracket[];
  getStandardDeduction: (year: number, filingStatus: FilingStatus) => number;
  getTaxRule: (ruleType: string, year: number) => TaxRule | null;
  calculateTax: (income: number, year: number, filingStatus: FilingStatus) => number;
  // Enhanced orchestration methods
  getEstateExemption: (year: number, jurisdiction?: string) => Promise<number>;
  getRetirementRules: (year: number) => Promise<any>;
  refreshFromOrchestrator: (year: number, jurisdiction?: string) => Promise<void>;
}

export const useTaxRules = (): UseTaxRulesReturn => {
  const [brackets, setBrackets] = useState<TaxBracket[]>([]);
  const [deductions, setDeductions] = useState<TaxDeduction[]>([]);
  const [rules, setRules] = useState<TaxRule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [orchestratorRules, setOrchestratorRules] = useState<TaxRuleBundle | null>(null);

  const fetchTaxData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Try to fetch from orchestrator first for current year
      const currentYear = new Date().getFullYear();
      await refreshFromOrchestrator(currentYear, 'US');

      // Fetch tax brackets from database (fallback or supplement)
      const { data: bracketsData, error: bracketsError } = await supabase
        .from('tax_brackets')
        .select('*')
        .eq('is_active', true)
        .order('tax_year', { ascending: false })
        .order('bracket_order', { ascending: true });

      if (bracketsError) throw bracketsError;

      // Fetch tax deductions
      const { data: deductionsData, error: deductionsError } = await supabase
        .from('tax_deductions')
        .select('*')
        .eq('is_active', true)
        .order('tax_year', { ascending: false });

      if (deductionsError) throw deductionsError;

      // Fetch tax rules
      const { data: rulesData, error: rulesError } = await supabase
        .from('tax_rules')
        .select('*')
        .eq('is_active', true)
        .order('effective_year', { ascending: false });

      if (rulesError) throw rulesError;

      setBrackets((bracketsData as TaxBracket[]) || []);
      setDeductions((deductionsData as TaxDeduction[]) || []);
      setRules((rulesData as TaxRule[]) || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch tax data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTaxData();
  }, []);

  const getTaxBrackets = (year: number, filingStatus: FilingStatus): TaxBracket[] => {
    return brackets
      .filter(bracket => 
        bracket.tax_year === year && 
        bracket.filing_status === filingStatus
      )
      .sort((a, b) => a.bracket_order - b.bracket_order);
  };

  const getStandardDeduction = (year: number, filingStatus: FilingStatus): number => {
    const deduction = deductions.find(d => 
      d.tax_year === year && 
      d.filing_status === filingStatus && 
      d.deduction_type === 'standard'
    );
    return deduction?.amount || 0;
  };

  const getTaxRule = (ruleType: string, year: number): TaxRule | null => {
    const applicableRules = rules.filter(rule => 
      rule.rule_type === ruleType &&
      rule.effective_year <= year &&
      (rule.expires_year === null || rule.expires_year >= year)
    );
    
    // Return the most recent applicable rule
    return applicableRules.sort((a, b) => b.effective_year - a.effective_year)[0] || null;
  };

  const calculateTax = (income: number, year: number, filingStatus: FilingStatus): number => {
    const applicableBrackets = getTaxBrackets(year, filingStatus);
    const standardDeduction = getStandardDeduction(year, filingStatus);
    
    const taxableIncome = Math.max(0, income - standardDeduction);
    let tax = 0;
    let remainingIncome = taxableIncome;

    for (const bracket of applicableBrackets) {
      if (remainingIncome <= 0) break;
      
      const bracketRange = bracket.max_income 
        ? bracket.max_income - bracket.min_income + 1
        : remainingIncome; // For highest bracket with no max
      
      const taxableInThisBracket = Math.min(remainingIncome, bracketRange);
      tax += (taxableInThisBracket * bracket.rate) / 100;
      remainingIncome -= taxableInThisBracket;
    }

    return tax;
  };

  // Enhanced orchestration methods
  const getEstateExemption = async (year: number, jurisdiction = 'US'): Promise<number> => {
    try {
      const bundle = await taxRulesOrchestrator.resolveCurrentRules('estate', jurisdiction, year);
      if (bundle?.content.estate_rules) {
        return bundle.content.estate_rules.federal_exemption;
      }
      
      // Fallback to default values for 2025
      if (year === 2025) return 14060000; // $14.06M for 2025
      if (year === 2024) return 13610000; // $13.61M for 2024
      return 12920000; // 2023 baseline
    } catch (error) {
      console.error('Error getting estate exemption:', error);
      return year === 2025 ? 14060000 : 13610000;
    }
  };

  const getRetirementRules = async (year: number) => {
    try {
      const bundle = await taxRulesOrchestrator.resolveCurrentRules('retirement', 'US', year);
      return bundle?.content.retirement_rules || {
        secure_act: {
          ten_year_rule_start: '2020-01-01',
          eligible_designated_beneficiaries: ['spouse', 'minor_child', 'disabled', 'chronically_ill', 'not_more_than_10_years_younger'],
          rmd_age: 73
        }
      };
    } catch (error) {
      console.error('Error getting retirement rules:', error);
      return null;
    }
  };

  const refreshFromOrchestrator = async (year: number, jurisdiction = 'US'): Promise<void> => {
    try {
      // Try to get orchestrated rules for tax calculations
      const taxBundle = await taxRulesOrchestrator.resolveCurrentRules('federal', jurisdiction, year);
      if (taxBundle) {
        setOrchestratorRules(taxBundle);
        
        // Convert orchestrator brackets to database format if available
        if (taxBundle.content.brackets) {
          const orchestratedBrackets: TaxBracket[] = [];
          taxBundle.content.brackets.forEach(bracket => {
            bracket.brackets.forEach(b => {
              orchestratedBrackets.push({
                id: crypto.randomUUID(),
                tax_year: year,
                filing_status: bracket.filing_status,
                min_income: b.min_income,
                max_income: b.max_income,
                rate: b.rate,
                bracket_order: b.bracket_order,
                is_active: true,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
              });
            });
          });
          
          // Merge with existing brackets, giving orchestrator priority
          setBrackets(prevBrackets => {
            const filteredPrev = prevBrackets.filter(b => b.tax_year !== year);
            return [...orchestratedBrackets, ...filteredPrev];
          });
        }
      }
    } catch (error) {
      console.warn('Orchestrator not available, using database fallback:', error);
    }
  };

  return {
    brackets,
    deductions,
    rules,
    loading,
    error,
    refetch: fetchTaxData,
    getTaxBrackets,
    getStandardDeduction,
    getTaxRule,
    calculateTax,
    getEstateExemption,
    getRetirementRules,
    refreshFromOrchestrator
  };
};