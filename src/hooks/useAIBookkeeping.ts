import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Transaction {
  id: string;
  description: string;
  amount: number;
  date: string;
  account_id: string;
  merchant_name?: string;
}

interface ClassificationResult {
  category: string;
  confidence: number;
  isRecurring: boolean;
  reasoning: string;
  suggestions: string[];
  isAnomaly?: boolean;
  anomalyReasons?: string[];
}

export const useAIBookkeeping = () => {
  const [isClassifying, setIsClassifying] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const classifyTransaction = useCallback(async (transaction: Transaction): Promise<ClassificationResult | null> => {
    try {
      setIsClassifying(true);
      setError(null);

      const { data: user } = await supabase.auth.getUser();
      if (!user.user) {
        throw new Error('User not authenticated');
      }

      const { data, error } = await supabase.functions.invoke('ai-bookkeeping', {
        body: {
          transaction,
          user_id: user.user.id
        }
      });

      if (error) throw error;

      return {
        category: data.classification.suggested_category,
        confidence: data.classification.confidence_score,
        isRecurring: data.classification.is_recurring,
        reasoning: data.classification.learning_data?.reasoning || '',
        suggestions: data.suggestions || [],
        isAnomaly: data.anomaly?.is_anomaly || false,
        anomalyReasons: data.anomaly?.anomaly_reasons || []
      };

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Classification failed';
      setError(new Error(errorMessage));
      toast.error(errorMessage);
      return null;
    } finally {
      setIsClassifying(false);
    }
  }, []);

  const updateClassification = useCallback(async (classificationId: string, newCategory: string) => {
    try {
      const { error } = await supabase
        .from('transaction_classifications')
        .update({
          final_category: newCategory,
          manual_override: true
        })
        .eq('id', classificationId);

      if (error) throw error;

      toast.success('Classification updated');
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Update failed';
      toast.error(errorMessage);
      return false;
    }
  }, []);

  const getMonthlyReport = useCallback(async (year: number, month: number) => {
    try {
      const startDate = new Date(year, month - 1, 1).toISOString().split('T')[0];
      const endDate = new Date(year, month, 0).toISOString().split('T')[0];

      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('User not authenticated');

      // Get classifications for the period
      const { data: classifications, error } = await supabase
        .from('transaction_classifications')
        .select('*')
        .eq('user_id', user.user.id)
        .gte('created_at', startDate)
        .lte('created_at', endDate + 'T23:59:59');

      if (error) throw error;

      // Process data for report
      const categoryTotals: Record<string, number> = {};
      let totalTransactions = classifications?.length || 0;
      let autoClassified = 0;
      let anomaliesFound = 0;

      classifications?.forEach(classification => {
        const category = classification.final_category;
        const amount = typeof classification.learning_data === 'object' && 
          classification.learning_data && 
          'amount' in classification.learning_data 
            ? (classification.learning_data as any).amount || 0 
            : 0;
        
        categoryTotals[category] = (categoryTotals[category] || 0) + amount;
        
        if (!classification.manual_override) autoClassified++;
        if (classification.is_anomaly) anomaliesFound++;
      });

      // Save report to database
      const reportData = {
        user_id: user.user.id,
        report_period_start: startDate,
        report_period_end: endDate,
        report_type: 'monthly',
        category_breakdown: categoryTotals,
        anomalies_found: anomaliesFound,
        total_transactions: totalTransactions,
        auto_classified_count: autoClassified,
        manual_review_count: totalTransactions - autoClassified,
        report_data: {
          classifications: classifications?.map(c => ({
            id: c.id,
            description: c.cleaned_description,
            category: c.final_category,
            amount: typeof c.learning_data === 'object' && 
              c.learning_data && 
              'amount' in c.learning_data 
                ? (c.learning_data as any).amount 
                : 0,
            confidence: c.confidence_score,
            isAnomaly: c.is_anomaly
          }))
        }
      };

      const { data: savedReport, error: reportError } = await supabase
        .from('bookkeeping_reports')
        .insert(reportData)
        .select()
        .single();

      if (reportError) throw reportError;

      return savedReport;

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Report generation failed';
      setError(new Error(errorMessage));
      toast.error(errorMessage);
      return null;
    }
  }, []);

  return {
    classifyTransaction,
    updateClassification,
    getMonthlyReport,
    isClassifying,
    error
  };
};