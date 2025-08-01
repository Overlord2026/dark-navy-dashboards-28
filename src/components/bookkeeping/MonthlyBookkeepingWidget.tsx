import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { AlertTriangle, Calendar, TrendingUp, Edit3 } from 'lucide-react';
import { useAIBookkeeping } from '@/hooks/useAIBookkeeping';
import { supabase } from '@/integrations/supabase/client';

interface CategoryTotal {
  category: string;
  amount: number;
  percentage: number;
}

interface BookkeepingReport {
  id: string;
  report_period_start: string;
  report_period_end: string;
  category_breakdown: any;
  anomalies_found: number;
  total_transactions: number;
  auto_classified_count: number;
  manual_review_count: number;
  report_data: any;
}

export function MonthlyBookkeepingWidget() {
  const [currentReport, setCurrentReport] = useState<BookkeepingReport | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const { getMonthlyReport } = useAIBookkeeping();

  const loadReport = async () => {
    setIsLoading(true);
    try {
      // First check if report already exists
      const { data: existingReports } = await supabase
        .from('bookkeeping_reports')
        .select('*')
        .eq('report_period_start', new Date(selectedYear, selectedMonth - 1, 1).toISOString().split('T')[0])
        .eq('report_type', 'monthly')
        .order('created_at', { ascending: false })
        .limit(1);

      if (existingReports && existingReports.length > 0) {
        setCurrentReport(existingReports[0]);
      } else {
        // Generate new report
        const report = await getMonthlyReport(selectedYear, selectedMonth);
        setCurrentReport(report);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadReport();
  }, [selectedMonth, selectedYear]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(Math.abs(amount));
  };

  const getCategoryTotals = (): CategoryTotal[] => {
    if (!currentReport?.category_breakdown) return [];

    const breakdown = currentReport.category_breakdown as Record<string, number>;
    const total = Object.values(breakdown).reduce((sum, amount) => sum + Math.abs(Number(amount) || 0), 0);

    return Object.entries(breakdown)
      .map(([category, amount]) => ({
        category,
        amount: Number(amount) || 0,
        percentage: total > 0 ? (Math.abs(Number(amount) || 0) / total) * 100 : 0
      }))
      .sort((a, b) => Math.abs(b.amount) - Math.abs(a.amount));
  };

  const categoryTotals = getCategoryTotals();
  const totalAmount = categoryTotals.reduce((sum, cat) => sum + Math.abs(cat.amount), 0);
  const automationRate = currentReport ? 
    Math.round((currentReport.auto_classified_count / Math.max(currentReport.total_transactions, 1)) * 100) : 0;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Monthly Bookkeeping Report
          </CardTitle>
          <CardDescription>
            AI-powered transaction categorization and analysis
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Month/Year Selector */}
          <div className="flex gap-2">
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
              className="px-3 py-1 border rounded"
            >
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i + 1} value={i + 1}>
                  {new Date(0, i).toLocaleString('default', { month: 'long' })}
                </option>
              ))}
            </select>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(parseInt(e.target.value))}
              className="px-3 py-1 border rounded"
            >
              {Array.from({ length: 5 }, (_, i) => (
                <option key={selectedYear - 2 + i} value={selectedYear - 2 + i}>
                  {selectedYear - 2 + i}
                </option>
              ))}
            </select>
            <Button onClick={loadReport} size="sm" disabled={isLoading}>
              {isLoading ? 'Loading...' : 'Refresh'}
            </Button>
          </div>

          {currentReport && (
            <>
              {/* Summary Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-background border rounded-lg p-3">
                  <div className="text-2xl font-bold">{currentReport.total_transactions}</div>
                  <div className="text-sm text-muted-foreground">Total Transactions</div>
                </div>
                <div className="bg-background border rounded-lg p-3">
                  <div className="text-2xl font-bold text-green-600">{automationRate}%</div>
                  <div className="text-sm text-muted-foreground">Auto-Classified</div>
                </div>
                <div className="bg-background border rounded-lg p-3">
                  <div className="text-2xl font-bold text-orange-600">{currentReport.anomalies_found}</div>
                  <div className="text-sm text-muted-foreground">Anomalies Found</div>
                </div>
                <div className="bg-background border rounded-lg p-3">
                  <div className="text-2xl font-bold">{formatCurrency(totalAmount)}</div>
                  <div className="text-sm text-muted-foreground">Total Volume</div>
                </div>
              </div>

              {/* Category Breakdown */}
              <div className="space-y-3">
                <h4 className="font-medium flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  Category Breakdown
                </h4>
                
                {categoryTotals.slice(0, 8).map((category) => (
                  <div key={category.category} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">{category.category}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm">{formatCurrency(category.amount)}</span>
                        <Badge variant="secondary" className="text-xs">
                          {category.percentage.toFixed(1)}%
                        </Badge>
                      </div>
                    </div>
                    <Progress value={category.percentage} className="h-2" />
                  </div>
                ))}
              </div>

              {/* Anomalies Alert */}
              {currentReport.anomalies_found > 0 && (
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-orange-800">
                    <AlertTriangle className="w-4 h-4" />
                    <span className="font-medium">
                      {currentReport.anomalies_found} transaction{currentReport.anomalies_found > 1 ? 's' : ''} 
                      {' '}require{currentReport.anomalies_found === 1 ? 's' : ''} review
                    </span>
                  </div>
                  <p className="text-sm text-orange-700 mt-1">
                    Unusual amounts, potential duplicates, or unknown vendors detected
                  </p>
                  <Button size="sm" variant="outline" className="mt-2">
                    <Edit3 className="w-4 h-4 mr-2" />
                    Review Anomalies
                  </Button>
                </div>
              )}

              {/* Manual Review Needed */}
              {currentReport.manual_review_count > 0 && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-blue-800">
                    <Edit3 className="w-4 h-4" />
                    <span className="font-medium">
                      {currentReport.manual_review_count} transaction{currentReport.manual_review_count > 1 ? 's' : ''} 
                      {' '}need{currentReport.manual_review_count === 1 ? 's' : ''} manual categorization
                    </span>
                  </div>
                  <Button size="sm" variant="outline" className="mt-2">
                    Review & Categorize
                  </Button>
                </div>
              )}
            </>
          )}

          {!currentReport && !isLoading && (
            <div className="text-center py-8 text-muted-foreground">
              <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No bookkeeping data found for this period</p>
              <p className="text-sm">Connect your bank accounts to start automatic categorization</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}