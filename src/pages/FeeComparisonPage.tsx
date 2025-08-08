import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FeeScenarioBuilder } from '@/components/fees/FeeScenarioBuilder';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export default function FeeComparisonPage() {
  const [feeModels, setFeeModels] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchFeeModels();
  }, []);

  const fetchFeeModels = async () => {
    const { data } = await supabase.from('fee_models').select('*');
    setFeeModels(data || []);
  };

  const handleCalculate = async (calculationData: any) => {
    try {
      setIsLoading(true);
      const { data } = await supabase.functions.invoke('fees-calc', {
        body: calculationData
      });
      setResults(data);
    } catch (error) {
      toast({
        title: "Calculation Error",
        description: "Failed to calculate fees",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Fee Comparison Tool</CardTitle>
        </CardHeader>
        <CardContent>
          <FeeScenarioBuilder
            feeModels={feeModels}
            onCalculate={handleCalculate}
            isLoading={isLoading}
          />
        </CardContent>
      </Card>

      {results && (
        <Card>
          <CardHeader>
            <CardTitle>Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold">Annual Savings</h3>
                <p className="text-2xl font-bold text-emerald">
                  ${results.summary.annual_savings.toLocaleString()}
                </p>
              </div>
              <div>
                <h3 className="font-semibold">10-Year Savings</h3>
                <p className="text-2xl font-bold text-emerald">
                  ${results.summary.ten_year_savings.toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}