import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { TaxBracket, TaxDeduction, TaxRule, FilingStatus } from '@/types/tax-rules';

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
}

export const useTaxRules = (): UseTaxRulesReturn => {
  const [brackets, setBrackets] = useState<TaxBracket[]>([]);
  const [deductions, setDeductions] = useState<TaxDeduction[]>([]);
  const [rules, setRules] = useState<TaxRule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTaxData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch tax brackets
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
    calculateTax
  };
};