import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface MarketData {
  symbol: string;
  beta?: number;
  alpha?: number;
  volatility?: number;
  yield?: number;
  ytdReturn?: number;
  oneYearReturn?: number;
  lastUpdated?: string;
  error?: string;
}

interface MarketDataServiceProps {
  symbols: string[];
  onDataLoaded: (data: Record<string, MarketData>) => void;
}

export function MarketDataService({ symbols, onDataLoaded }: MarketDataServiceProps) {
  const [loading, setLoading] = useState(false);
  const [lastFetch, setLastFetch] = useState<Date | null>(null);

  const fetchMarketData = async (symbolList: string[]) => {
    if (!symbolList.length) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('market-data', {
        body: { symbols: symbolList }
      });

      if (error) throw error;
      
      if (data?.success) {
        const marketDataMap: Record<string, MarketData> = {};
        data.data.forEach((item: MarketData) => {
          marketDataMap[item.symbol] = item;
        });
        
        onDataLoaded(marketDataMap);
        setLastFetch(new Date());
      }
    } catch (error) {
      console.error('Error fetching market data:', error);
      // Create fallback data for symbols that failed
      const fallbackData: Record<string, MarketData> = {};
      symbolList.forEach(symbol => {
        fallbackData[symbol] = {
          symbol,
          error: 'Data unavailable'
        };
      });
      onDataLoaded(fallbackData);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (symbols.length > 0) {
      fetchMarketData(symbols);
    }
  }, [symbols.join(',')]);

  return null; // This is a service component, no UI
}

interface MarketDataDisplayProps {
  symbol: string;
  marketData?: MarketData;
  compact?: boolean;
}

export function MarketDataDisplay({ symbol, marketData, compact = false }: MarketDataDisplayProps) {
  if (!marketData) {
    return (
      <div className="text-xs text-muted-foreground">
        <Loader2 className="w-3 h-3 animate-spin inline mr-1" />
        Loading...
      </div>
    );
  }

  if (marketData.error) {
    return (
      <div className="text-xs text-muted-foreground">
        Data Unavailable
      </div>
    );
  }

  const formatPercentage = (value?: number) => {
    if (value === undefined || value === null) return 'N/A';
    return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
  };

  const formatNumber = (value?: number, decimals = 2) => {
    if (value === undefined || value === null) return 'N/A';
    return value.toFixed(decimals);
  };

  const getReturnIcon = (value?: number) => {
    if (value === undefined || value === null) return <Minus className="w-3 h-3" />;
    if (value > 0) return <TrendingUp className="w-3 h-3 text-green-500" />;
    if (value < 0) return <TrendingDown className="w-3 h-3 text-red-500" />;
    return <Minus className="w-3 h-3" />;
  };

  if (compact) {
    return (
      <div className="space-y-1 text-xs">
        {marketData.beta && (
          <div className="flex justify-between">
            <span>Beta:</span>
            <span className="font-medium">{formatNumber(marketData.beta)}</span>
          </div>
        )}
        {marketData.ytdReturn !== undefined && (
          <div className="flex justify-between items-center">
            <span>YTD:</span>
            <div className="flex items-center gap-1">
              {getReturnIcon(marketData.ytdReturn)}
              <span className="font-medium">{formatPercentage(marketData.ytdReturn)}</span>
            </div>
          </div>
        )}
        {marketData.yield && (
          <div className="flex justify-between">
            <span>Yield:</span>
            <span className="font-medium">{formatPercentage(marketData.yield)}</span>
          </div>
        )}
      </div>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">
          {symbol} Market Data
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-muted-foreground">Beta (vs S&P 500)</span>
            <div className="font-medium">
              {formatNumber(marketData.beta)}
              {marketData.beta && (
                <Badge variant={marketData.beta > 1 ? "destructive" : "secondary"} className="ml-2 text-xs">
                  {marketData.beta > 1 ? "High Risk" : "Lower Risk"}
                </Badge>
              )}
            </div>
          </div>
          
          <div>
            <span className="text-muted-foreground">Volatility</span>
            <div className="font-medium">{formatPercentage(marketData.volatility)}</div>
          </div>
          
          <div>
            <span className="text-muted-foreground">YTD Return</span>
            <div className="flex items-center gap-1">
              {getReturnIcon(marketData.ytdReturn)}
              <span className="font-medium">{formatPercentage(marketData.ytdReturn)}</span>
            </div>
          </div>
          
          <div>
            <span className="text-muted-foreground">1-Year Return</span>
            <div className="flex items-center gap-1">
              {getReturnIcon(marketData.oneYearReturn)}
              <span className="font-medium">{formatPercentage(marketData.oneYearReturn)}</span>
            </div>
          </div>
          
          {marketData.yield && (
            <div className="col-span-2">
              <span className="text-muted-foreground">Dividend Yield</span>
              <div className="font-medium">{formatPercentage(marketData.yield)}</div>
            </div>
          )}
          
          {marketData.alpha && (
            <div className="col-span-2">
              <span className="text-muted-foreground">Alpha</span>
              <div className="font-medium">{formatPercentage(marketData.alpha)}</div>
            </div>
          )}
        </div>
        
        {marketData.lastUpdated && (
          <div className="text-xs text-muted-foreground border-t pt-2">
            Last updated: {new Date(marketData.lastUpdated).toLocaleString()}
          </div>
        )}
      </CardContent>
    </Card>
  );
}