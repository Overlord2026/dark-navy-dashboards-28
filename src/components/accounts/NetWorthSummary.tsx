import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RefreshCw, TrendingUp, TrendingDown, DollarSign, Building, CreditCard, PiggyBank } from 'lucide-react';
import { useNetWorth } from '@/context/NetWorthContext';
import { useBankAccounts } from '@/context/BankAccountsContext';
import { useCreditCards } from '@/context/CreditCardsContext';
import { useInvestmentAccounts } from '@/hooks/useInvestmentAccounts';
import { useRealEstate } from '@/hooks/useRealEstate';

export const NetWorthSummary = () => {
  const { totalAssetValue, totalLiabilityValue, getTotalNetWorth, loading: assetsLoading } = useNetWorth();
  const { getFormattedTotalBalance: getBankBalance, loading: bankLoading } = useBankAccounts();
  const { getFormattedTotalBalance: getCreditBalance, loading: creditLoading } = useCreditCards();
  const { getFormattedTotalBalance: getInvestmentBalance, loading: investmentLoading } = useInvestmentAccounts();
  const { getFormattedTotalValue: getRealEstateValue, loading: realEstateLoading } = useRealEstate();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const parseAmount = (formattedAmount: string): number => {
    return Number(formattedAmount.replace(/[$,]/g, '')) || 0;
  };

  const totalCash = parseAmount(getBankBalance());
  const totalDebt = parseAmount(getCreditBalance());
  const totalInvestments = parseAmount(getInvestmentBalance());
  const totalRealEstate = parseAmount(getRealEstateValue());
  const netWorth = getTotalNetWorth();

  const isLoading = assetsLoading || bankLoading || creditLoading || investmentLoading || realEstateLoading;

  const handleSyncAll = async () => {
    // Placeholder for sync functionality
    console.log('Syncing all accounts...');
  };

  const getLastSyncStatus = () => {
    // Mock last sync data - in real app, this would come from account data
    const now = new Date();
    const lastSync = new Date(now.getTime() - 2 * 60 * 60 * 1000); // 2 hours ago
    return {
      lastSyncTime: lastSync,
      allSynced: true,
      failedAccounts: 0,
    };
  };

  const syncStatus = getLastSyncStatus();
  const timeSinceSync = Math.floor((Date.now() - syncStatus.lastSyncTime.getTime()) / (1000 * 60 * 60));

  return (
    <Card className="mb-6">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Net Worth Summary
            </CardTitle>
            <CardDescription>
              Your complete financial overview across all accounts
            </CardDescription>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-sm text-muted-foreground">
                Last sync: {timeSinceSync}h ago
              </div>
              <Badge variant={syncStatus.allSynced ? "default" : "destructive"} className="text-xs">
                {syncStatus.allSynced ? 'All Synced' : `${syncStatus.failedAccounts} Failed`}
              </Badge>
            </div>
            <Button variant="outline" size="sm" onClick={handleSyncAll} disabled={isLoading}>
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Sync All
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Net Worth */}
          <div className="col-span-2 lg:col-span-1">
            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">Net Worth</span>
                </div>
                <div className="text-2xl font-bold text-primary">
                  {isLoading ? "Loading..." : formatCurrency(netWorth)}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Assets - Liabilities
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Total Cash */}
          <div>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="h-4 w-4 text-success" />
                  <span className="text-sm font-medium">Total Cash</span>
                </div>
                <div className="text-xl font-bold">
                  {isLoading ? "..." : formatCurrency(totalCash)}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Bank accounts
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Total Investments */}
          <div>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <PiggyBank className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium">Investments</span>
                </div>
                <div className="text-xl font-bold">
                  {isLoading ? "..." : formatCurrency(totalInvestments)}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Investment accounts
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Real Estate */}
          <div>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Building className="h-4 w-4 text-amber-600" />
                  <span className="text-sm font-medium">Real Estate</span>
                </div>
                <div className="text-xl font-bold">
                  {isLoading ? "..." : formatCurrency(totalRealEstate)}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Property values
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Total Debt */}
          <div>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <CreditCard className="h-4 w-4 text-destructive" />
                  <span className="text-sm font-medium">Total Debt</span>
                </div>
                <div className="text-xl font-bold text-destructive">
                  {isLoading ? "..." : formatCurrency(totalDebt + totalLiabilityValue)}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Credit cards & loans
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Asset Allocation Bar */}
        <div className="mt-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Asset Allocation</span>
            <span className="text-sm text-muted-foreground">
              Total: {formatCurrency(totalCash + totalInvestments + totalRealEstate + totalAssetValue)}
            </span>
          </div>
          
          {!isLoading && (
            <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
              {(() => {
                const total = totalCash + totalInvestments + totalRealEstate + totalAssetValue;
                if (total === 0) return <div className="w-full h-full bg-muted" />;
                
                const cashPercent = (totalCash / total) * 100;
                const investmentPercent = (totalInvestments / total) * 100;
                const realEstatePercent = (totalRealEstate / total) * 100;
                const otherAssetsPercent = (totalAssetValue / total) * 100;
                
                return (
                  <div className="flex w-full h-full">
                    <div 
                      className="h-full bg-success" 
                      style={{ width: `${cashPercent}%` }}
                      title={`Cash: ${cashPercent.toFixed(1)}%`}
                    />
                    <div 
                      className="h-full bg-blue-600" 
                      style={{ width: `${investmentPercent}%` }}
                      title={`Investments: ${investmentPercent.toFixed(1)}%`}
                    />
                    <div 
                      className="h-full bg-amber-600" 
                      style={{ width: `${realEstatePercent}%` }}
                      title={`Real Estate: ${realEstatePercent.toFixed(1)}%`}
                    />
                    <div 
                      className="h-full bg-purple-600" 
                      style={{ width: `${otherAssetsPercent}%` }}
                      title={`Other Assets: ${otherAssetsPercent.toFixed(1)}%`}
                    />
                  </div>
                );
              })()}
            </div>
          )}
          
          {!isLoading && (
            <div className="flex justify-between mt-2 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <div className="w-2 h-2 bg-success rounded-full" />
                Cash ({((totalCash / (totalCash + totalInvestments + totalRealEstate + totalAssetValue)) * 100).toFixed(1)}%)
              </span>
              <span className="flex items-center gap-1">
                <div className="w-2 h-2 bg-blue-600 rounded-full" />
                Investments ({((totalInvestments / (totalCash + totalInvestments + totalRealEstate + totalAssetValue)) * 100).toFixed(1)}%)
              </span>
              <span className="flex items-center gap-1">
                <div className="w-2 h-2 bg-amber-600 rounded-full" />
                Real Estate ({((totalRealEstate / (totalCash + totalInvestments + totalRealEstate + totalAssetValue)) * 100).toFixed(1)}%)
              </span>
              <span className="flex items-center gap-1">
                <div className="w-2 h-2 bg-purple-600 rounded-full" />
                Other ({((totalAssetValue / (totalCash + totalInvestments + totalRealEstate + totalAssetValue)) * 100).toFixed(1)}%)
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};