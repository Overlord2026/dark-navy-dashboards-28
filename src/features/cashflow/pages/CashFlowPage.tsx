import { useState } from 'react';
import { useCashFlowData, useCashFlowSummary } from '../api/cashFlowApi';
import { CashFlowChart } from '../components/CashFlowChart';
import { DrilldownPanel } from '../components/DrilldownPanel';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TrendingUp, TrendingDown, DollarSign, Calendar, BarChart3 } from 'lucide-react';
import PersonaOnboarding from "@/components/pros/PersonaOnboarding";

export function CashFlowPage() {
  const [selectedPeriod, setSelectedPeriod] = useState('MTD');
  const [showDrilldown, setShowDrilldown] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>();
  const [selectedMerchant, setSelectedMerchant] = useState<string>();

  const { data: cashFlowData = [], isLoading: isLoadingData } = useCashFlowData(selectedPeriod);
  const { data: summary, isLoading: isLoadingSummary } = useCashFlowSummary(selectedPeriod);

  const periodOptions = [
    { label: 'Month to Date', value: 'MTD' },
    { label: 'Last 3 Months', value: '3M' },
    { label: 'Last 6 Months', value: '6M' },
    { label: 'Year to Date', value: 'YTD' },
    { label: 'Last 12 Months', value: '1Y' },
    { label: 'All Time', value: 'ALL' }
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const handleChartClick = (data: any, period: string) => {
    setShowDrilldown(true);
    setSelectedCategory(undefined);
    setSelectedMerchant(undefined);
  };

  const handleCloseDrilldown = () => {
    setShowDrilldown(false);
    setSelectedCategory(undefined);
    setSelectedMerchant(undefined);
  };

  if (isLoadingData || isLoadingSummary) {
    return <div>Loading cash flow data...</div>;
  }

  return (
    <div className="space-y-6">
      <PersonaOnboarding />
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <BarChart3 className="h-8 w-8" />
            Cash Flow
          </h1>
          <p className="text-muted-foreground">
            Track your income, expenses, and net cash flow over time
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {periodOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      {summary && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Income</CardTitle>
              <TrendingUp className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-success">
                {formatCurrency(summary.totalIncome)}
              </div>
              <p className="text-xs text-muted-foreground">
                Avg: {formatCurrency(summary.avgMonthlyIncome)}/month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
              <TrendingDown className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">
                {formatCurrency(summary.totalExpenses)}
              </div>
              <p className="text-xs text-muted-foreground">
                Avg: {formatCurrency(summary.avgMonthlyExpenses)}/month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Net Cash Flow</CardTitle>
              <DollarSign className={`h-4 w-4 ${summary.netCashFlow >= 0 ? 'text-success' : 'text-destructive'}`} />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${summary.netCashFlow >= 0 ? 'text-success' : 'text-destructive'}`}>
                {formatCurrency(summary.netCashFlow)}
              </div>
              <p className="text-xs text-muted-foreground">
                {summary.netCashFlow >= 0 ? 'Positive' : 'Negative'} cash flow
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Categories</CardTitle>
              <Badge variant="outline">{summary.categoryBreakdown.length}</Badge>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {summary.categoryBreakdown.length}
              </div>
              <p className="text-xs text-muted-foreground">
                Active categories
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Chart */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Cash Flow Chart</CardTitle>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setShowDrilldown(!showDrilldown)}
            >
              {showDrilldown ? 'Hide' : 'Show'} Breakdown
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <CashFlowChart 
            data={cashFlowData} 
            onBarClick={handleChartClick}
          />
        </CardContent>
      </Card>

      {/* Drilldown Panel */}
      {showDrilldown && summary && (
        <DrilldownPanel
          period={selectedPeriod}
          categoryBreakdown={summary.categoryBreakdown}
          merchantBreakdown={summary.merchantBreakdown}
          selectedCategory={selectedCategory}
          selectedMerchant={selectedMerchant}
          onClose={handleCloseDrilldown}
        />
      )}

      {/* Quick Stats */}
      {summary && cashFlowData.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Top Expense Categories</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {summary.categoryBreakdown
                  .filter(cat => cat.categoryName !== 'Salary') // Exclude income categories
                  .slice(0, 5)
                  .map((category, index) => (
                    <div key={category.categoryId} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs">
                          {index + 1}
                        </div>
                        <span className="text-sm">{category.categoryName}</span>
                      </div>
                      <span className="text-sm font-mono">
                        {formatCurrency(category.amount)}
                      </span>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Top Merchants</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {summary.merchantBreakdown.slice(0, 5).map((merchant, index) => (
                  <div key={merchant.merchantId} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs">
                        {index + 1}
                      </div>
                      <span className="text-sm">{merchant.merchantName}</span>
                    </div>
                    <span className="text-sm font-mono">
                      {formatCurrency(merchant.amount)}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {cashFlowData.length === 0 && (
        <Card>
          <CardContent className="py-8">
            <div className="text-center text-muted-foreground">
              <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No cash flow data available</p>
              <p className="text-sm">Try selecting a different time period</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}