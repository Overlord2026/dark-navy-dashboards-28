import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useMarketData } from '@/hooks/useMarketData';

interface PortfolioPerformanceData {
  id: string;
  userId: string;
  totalValue: number;
  totalReturn: number;
  returnPercentage: number;
  dayChange: number;
  dayChangePercentage: number;
  assetAllocation: {
    stocks: number;
    bonds: number;
    alternatives: number;
    cash: number;
  };
  topHoldings: Array<{
    symbol: string;
    name: string;
    value: number;
    percentage: number;
    dayChange: number;
  }>;
  riskMetrics: {
    beta: number;
    volatility: number;
    sharpeRatio: number;
    maxDrawdown: number;
  };
  monthlyReturns: Array<{
    month: string;
    value: number;
    percentage: number;
  }>;
  createdAt: string;
  updatedAt: string;
}

interface InvestmentAccount {
  id: string;
  accountName: string;
  accountType: string;
  balance: number;
  dayChange: number;
  dayChangePercentage: number;
  holdings: Array<{
    symbol: string;
    shares: number;
    marketValue: number;
  }>;
}

export const usePortfolioAnalytics = () => {
  const [portfolioData, setPortfolioData] = useState<PortfolioPerformanceData | null>(null);
  const [accounts, setAccounts] = useState<InvestmentAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { marketData, fetchStockStats } = useMarketData();

  const fetchPortfolioData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Fetch portfolio performance data
      const { data: portfolioPerformance, error: portfolioError } = await supabase
        .from('portfolio_performance')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1);

      if (portfolioError) throw portfolioError;

      // Fetch investment accounts
      const { data: investmentAccounts, error: accountsError } = await supabase
        .from('investment_accounts')
        .select('*')
        .eq('user_id', user.id);

      if (accountsError) throw accountsError;

      // Fetch public stocks data for real market prices
      const { data: publicStocks, error: stocksError } = await supabase
        .from('public_stocks')
        .select('*')
        .eq('user_id', user.id);

      if (stocksError) throw stocksError;

      // Get real-time market data for stocks
      let enrichedAccounts: InvestmentAccount[] = [];
      
      if (publicStocks && publicStocks.length > 0) {
        const tickers = publicStocks.map(stock => stock.ticker_symbol).filter(Boolean);
        
        if (tickers.length > 0) {
          try {
            const { data: marketStats } = await fetchStockStats(tickers);
            
            // Process investment accounts with real market data
            enrichedAccounts = investmentAccounts?.map(account => {
              const holdings = publicStocks
                .filter(stock => stock.user_id === account.user_id)
                .map(stock => {
                  const marketStat = marketStats?.find(stat => stat.ticker === stock.ticker_symbol);
                  const currentPrice = marketStat?.price || stock.price_per_share;
                  const marketValue = currentPrice * stock.number_of_shares;
                  
                  return {
                    symbol: stock.ticker_symbol,
                    shares: stock.number_of_shares,
                    marketValue,
                    dayChange: marketStat ? (currentPrice - stock.price_per_share) * stock.number_of_shares : 0,
                    dayChangePercentage: marketStat ? ((currentPrice - stock.price_per_share) / stock.price_per_share) * 100 : 0
                  };
                });

              const totalValue = holdings.reduce((sum, holding) => sum + holding.marketValue, 0);
              const totalDayChange = holdings.reduce((sum, holding) => sum + holding.dayChange, 0);
              const dayChangePercentage = account.balance > 0 ? (totalDayChange / account.balance) * 100 : 0;

              return {
                id: account.id,
                accountName: account.name,
                accountType: account.account_type,
                balance: totalValue || account.balance,
                dayChange: totalDayChange,
                dayChangePercentage,
                holdings
              };
            }) || [];
          } catch (marketError) {
            console.warn('Failed to fetch market data, using stored values:', marketError);
        enrichedAccounts = investmentAccounts?.map(account => ({
          id: account.id,
          accountName: account.name,
          accountType: account.account_type,
          balance: account.balance,
          dayChange: 0,
          dayChangePercentage: 0,
          holdings: []
        })) || [];
          }
        }
      } else {
        enrichedAccounts = investmentAccounts?.map(account => ({
          id: account.id,
          accountName: account.name,
          accountType: account.account_type,
          balance: account.balance,
          dayChange: 0,
          dayChangePercentage: 0,
          holdings: []
        })) || [];
      }

      // Calculate portfolio-level metrics
      const totalPortfolioValue = enrichedAccounts.reduce((sum, account) => sum + account.balance, 0);
      const totalDayChange = enrichedAccounts.reduce((sum, account) => sum + account.dayChange, 0);
      const portfolioDayChangePercentage = totalPortfolioValue > 0 ? (totalDayChange / totalPortfolioValue) * 100 : 0;

      // Calculate asset allocation
      const stocksValue = enrichedAccounts
        .filter(acc => acc.accountType === 'taxable' || acc.accountType === 'ira')
        .reduce((sum, acc) => sum + acc.balance, 0);
      
      const assetAllocation = {
        stocks: totalPortfolioValue > 0 ? (stocksValue / totalPortfolioValue) * 100 : 0,
        bonds: 20, // Placeholder - would calculate from real data
        alternatives: 15, // Placeholder - would calculate from real data
        cash: 10 // Placeholder - would calculate from real data
      };

      // Get top holdings across all accounts
      const allHoldings = enrichedAccounts.flatMap(account => 
        account.holdings.map(holding => ({
          symbol: holding.symbol,
          name: holding.symbol, // Would fetch company name from market data
          value: holding.marketValue,
          percentage: totalPortfolioValue > 0 ? (holding.marketValue / totalPortfolioValue) * 100 : 0,
          dayChange: (holding as any).dayChange || 0
        }))
      );

      const topHoldings = allHoldings
        .sort((a, b) => b.value - a.value)
        .slice(0, 5);

      // Calculate risk metrics (simplified - would use more sophisticated calculations)
      const avgVolatility = 15; // Would calculate from market data
      const portfolioBeta = 1.1; // Would calculate from market data correlations
      
      const portfolioAnalyticsData: PortfolioPerformanceData = {
        id: portfolioPerformance?.[0]?.id || 'default',
        userId: user.id,
        totalValue: totalPortfolioValue,
        totalReturn: totalDayChange,
        returnPercentage: portfolioDayChangePercentage,
        dayChange: totalDayChange,
        dayChangePercentage: portfolioDayChangePercentage,
        assetAllocation,
        topHoldings,
        riskMetrics: {
          beta: portfolioBeta,
          volatility: avgVolatility,
          sharpeRatio: 1.2,
          maxDrawdown: -8.5
        },
        monthlyReturns: [
          { month: 'Jan', value: totalPortfolioValue * 0.02, percentage: 2.0 },
          { month: 'Feb', value: totalPortfolioValue * 0.01, percentage: 1.0 },
          { month: 'Mar', value: totalPortfolioValue * 0.03, percentage: 3.0 },
          { month: 'Apr', value: totalPortfolioValue * -0.01, percentage: -1.0 },
          { month: 'May', value: totalPortfolioValue * 0.025, percentage: 2.5 },
          { month: 'Jun', value: totalPortfolioValue * 0.015, percentage: 1.5 }
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      setPortfolioData(portfolioAnalyticsData);
      setAccounts(enrichedAccounts);

    } catch (err) {
      console.error('Error fetching portfolio analytics:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch portfolio data');
    } finally {
      setLoading(false);
    }
  }, [fetchStockStats]);

  // Set up real-time subscriptions
  useEffect(() => {
    fetchPortfolioData();

    const portfolioSubscription = supabase
      .channel('portfolio-performance-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'portfolio_performance'
        },
        () => {
          fetchPortfolioData();
        }
      )
      .subscribe();

    const investmentSubscription = supabase
      .channel('investment-accounts-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'investment_accounts'
        },
        () => {
          fetchPortfolioData();
        }
      )
      .subscribe();

    const stocksSubscription = supabase
      .channel('public-stocks-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'public_stocks'
        },
        () => {
          fetchPortfolioData();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(portfolioSubscription);
      supabase.removeChannel(investmentSubscription);
      supabase.removeChannel(stocksSubscription);
    };
  }, [fetchPortfolioData]);

  return {
    portfolioData,
    accounts,
    loading,
    error,
    refreshData: fetchPortfolioData,
    marketData
  };
};