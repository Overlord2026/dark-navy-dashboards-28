
import { useState, useEffect } from "react";
import { 
  taxBracketData, 
  taxStrategies, 
  taxDeadlines, 
  deductionCategories,
  getIconComponent,
  TaxStrategy
} from "@/data/tax-planning/mockTaxData";
import { logger } from "@/services/logging/loggingService";

/**
 * Interface for tax bracket data
 */
export interface TaxBracketData {
  currentBracket: string;
  estimatedLiability: number;
  potentialSavings: number;
  yearOverYearChange: number;
}

/**
 * Interface for tax deadline data
 */
export interface TaxDeadline {
  id: string;
  date: string;
  title: string;
  description: string;
  daysLeft: number;
}

/**
 * Interface for deduction category data
 */
export interface DeductionCategory {
  id: string;
  category: string;
  amount: number;
  percentage: number;
  color: string;
}

/**
 * Hook for fetching tax planning data
 */
export const useTaxPlanning = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [taxBrackets, setTaxBrackets] = useState<TaxBracketData>(taxBracketData);
  const [strategies, setStrategies] = useState<TaxStrategy[]>(taxStrategies);
  const [deadlines, setDeadlines] = useState<TaxDeadline[]>(taxDeadlines);
  const [deductions, setDeductions] = useState<DeductionCategory[]>(deductionCategories);

  // Function to fetch tax bracket data
  const fetchTaxBracketData = async () => {
    try {
      setIsLoading(true);
      
      // In the future, replace with actual API call
      // const response = await fetch('/api/tax-planning/brackets');
      // const data = await response.json();
      // setTaxBrackets(data);
      
      // Currently using mock data
      setTaxBrackets(taxBracketData);
      
      setIsLoading(false);
    } catch (err) {
      logger.error('Error fetching tax bracket data:', err);
      setError('Failed to fetch tax bracket data');
      setIsLoading(false);
    }
  };

  // Function to fetch tax strategies
  const fetchTaxStrategies = async () => {
    try {
      setIsLoading(true);
      
      // In the future, replace with actual API call
      // const response = await fetch('/api/tax-planning/strategies');
      // const data = await response.json();
      // setStrategies(data);
      
      // Currently using mock data
      setStrategies(taxStrategies);
      
      setIsLoading(false);
    } catch (err) {
      logger.error('Error fetching tax strategies:', err);
      setError('Failed to fetch tax strategies');
      setIsLoading(false);
    }
  };

  // Function to fetch tax deadlines
  const fetchTaxDeadlines = async () => {
    try {
      setIsLoading(true);
      
      // In the future, replace with actual API call
      // const response = await fetch('/api/tax-planning/deadlines');
      // const data = await response.json();
      // setDeadlines(data);
      
      // Currently using mock data
      setDeadlines(taxDeadlines);
      
      setIsLoading(false);
    } catch (err) {
      logger.error('Error fetching tax deadlines:', err);
      setError('Failed to fetch tax deadlines');
      setIsLoading(false);
    }
  };

  // Function to fetch deduction categories
  const fetchDeductionCategories = async () => {
    try {
      setIsLoading(true);
      
      // In the future, replace with actual API call
      // const response = await fetch('/api/tax-planning/deductions');
      // const data = await response.json();
      // setDeductions(data);
      
      // Currently using mock data
      setDeductions(deductionCategories);
      
      setIsLoading(false);
    } catch (err) {
      logger.error('Error fetching deduction categories:', err);
      setError('Failed to fetch deduction categories');
      setIsLoading(false);
    }
  };

  // Refresh all tax data
  const refreshAllTaxData = async () => {
    setError(null);
    await Promise.all([
      fetchTaxBracketData(),
      fetchTaxStrategies(),
      fetchTaxDeadlines(),
      fetchDeductionCategories()
    ]);
  };

  // Fetch data on component mount
  useEffect(() => {
    refreshAllTaxData();
  }, []);

  // Helper function to get icon component from string name
  const getStrategyIcon = (iconName: string) => {
    return getIconComponent(iconName);
  };

  // Calculate total deductions amount
  const getTotalDeductions = (): number => {
    return deductions.reduce((sum, item) => sum + item.amount, 0);
  };

  return {
    isLoading,
    error,
    taxBrackets,
    strategies,
    deadlines,
    deductions,
    refreshAllTaxData,
    fetchTaxBracketData,
    fetchTaxStrategies,
    fetchTaxDeadlines,
    fetchDeductionCategories,
    getStrategyIcon,
    getTotalDeductions
  };
};
