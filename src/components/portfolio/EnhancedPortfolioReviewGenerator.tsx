import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { formatCurrency, formatPercentage } from '@/lib/formatters';
import { MarketDataService, MarketDataDisplay } from './MarketDataService';
import { BenchmarkComparison } from './BenchmarkComparison';
import { ClientRiskProfileQuiz } from './ClientRiskProfileQuiz';
import { useMarketData } from '@/hooks/useMarketData';
import { TrendingUp, TrendingDown, Download, Shield, DollarSign, Gauge, FileText, Loader2 } from 'lucide-react';

interface Portfolio {
  name: string;
  holdings: Array<{
    symbol: string;
    name: string;
    allocation: number;
    value: number;
    assetClass: 'stock' | 'bond' | 'reit' | 'commodity' | 'cash';
    marketData?: {
      beta?: number;
      alpha?: number;
      volatility?: number;
      yield?: number;
      ytdReturn?: number;
      oneYearReturn?: number;
      threeYearReturn?: number;
      fiveYearReturn?: number;
      sector?: string;
    };
  }>;
  riskScore: number;
  annualIncome: number;
  totalValue: number;
}

// Portfolio Beta Gauge Component
function PortfolioBetaGauge({ beta, benchmark = "S&P 500" }: { beta: number; benchmark?: string }) {
  const getRiskLevel = (beta: number) => {
    if (beta < 0.7) return { level: "Conservative", color: "text-green-600", bgColor: "bg-green-100" };
    if (beta < 1.0) return { level: "Moderate", color: "text-blue-600", bgColor: "bg-blue-100" };
    if (beta < 1.3) return { level: "Growth", color: "text-orange-600", bgColor: "bg-orange-100" };
    return { level: "Aggressive", color: "text-red-600", bgColor: "bg-red-100" };
  };

  const riskLevel = getRiskLevel(beta);

  return (
    <Card className="p-4">
      <div className="flex items-center gap-3">
        <div className={`p-3 rounded-full ${riskLevel.bgColor}`}>
          <Gauge className={`w-6 h-6 ${riskLevel.color}`} />
        </div>
        <div>
          <div className="text-2xl font-bold">{beta.toFixed(2)}</div>
          <div className="text-sm text-muted-foreground">Portfolio Beta vs {benchmark}</div>
          <Badge className={`${riskLevel.bgColor} ${riskLevel.color} border-0`}>
            {riskLevel.level}
          </Badge>
        </div>
      </div>
    </Card>
  );
}

// Holdings Table Component
function HoldingsTable({ holdings, marketData }: { holdings: Portfolio['holdings']; marketData: Record<string, any> }) {
  return (
    <div className="space-y-2">
      <div className="grid grid-cols-8 gap-2 text-xs font-medium text-muted-foreground p-2 bg-muted rounded-t">
        <div>Ticker</div>
        <div>Name</div>
        <div>Beta</div>
        <div>Std Dev</div>
        <div>Yield</div>
        <div>1yr Return</div>
        <div>3yr Return</div>
        <div>Sector</div>
      </div>
      {holdings.map((holding, index) => {
        const data = marketData[holding.symbol];
        return (
          <div key={index} className="grid grid-cols-8 gap-2 text-sm p-2 border rounded hover:bg-muted/50">
            <div className="font-medium">{holding.symbol}</div>
            <div className="truncate" title={holding.name}>{holding.name}</div>
            <div>{data?.beta ? data.beta.toFixed(2) : 'N/A'}</div>
            <div>{data?.volatility ? formatPercentage(data.volatility) : 'N/A'}</div>
            <div>{data?.yield ? formatPercentage(data.yield) : 'N/A'}</div>
            <div className={`flex items-center gap-1 ${(data?.oneYearReturn || 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {(data?.oneYearReturn || 0) >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              {data?.oneYearReturn ? formatPercentage(data.oneYearReturn) : 'N/A'}
            </div>
            <div>{data?.threeYearReturn ? formatPercentage(data.threeYearReturn) : 'N/A'}</div>
            <div className="truncate">{data?.sector || 'Technology'}</div>
          </div>
        );
      })}
    </div>
  );
}

// Risk Narrative Component
function RiskNarrative({ portfolioBeta, portfolioVolatility }: { portfolioBeta: number; portfolioVolatility: number }) {
  const getRiskAssessment = (beta: number, volatility: number) => {
    if (beta < 0.7 && volatility < 12) return "Conservative";
    if (beta < 1.0 && volatility < 16) return "Moderate";
    if (beta < 1.3 && volatility < 20) return "Growth";
    return "Aggressive";
  };

  const riskLevel = getRiskAssessment(portfolioBeta, portfolioVolatility);
  const benchmarkComparison = portfolioBeta > 1.0 ? "higher" : portfolioBeta < 1.0 ? "lower" : "similar";

  return (
    <Card className="p-4 bg-gradient-to-r from-slate-50 to-blue-50">
      <div className="flex items-center gap-2 mb-3">
        <Shield className="w-5 h-5 text-blue-600" />
        <h4 className="font-semibold">Risk Assessment</h4>
      </div>
      <p className="text-sm leading-relaxed">
        Based on beta ({portfolioBeta.toFixed(2)}) and volatility ({formatPercentage(portfolioVolatility)}), 
        your portfolio risk is <strong>{riskLevel}</strong> compared to the S&P 500. 
        This portfolio has <strong>{benchmarkComparison}</strong> systematic risk than the market, 
        {portfolioBeta > 1.2 && " indicating potential for higher returns but with increased volatility."}
        {portfolioBeta < 0.8 && " suggesting more stable returns with lower market correlation."}
        {portfolioBeta >= 0.8 && portfolioBeta <= 1.2 && " showing balanced market exposure."}
      </p>
    </Card>
  );
}

export function EnhancedPortfolioReviewGenerator() {
  const [clientName, setClientName] = useState('');
  const [currentPortfolio, setCurrentPortfolio] = useState<Portfolio | null>(null);
  const [proposedPortfolio, setProposedPortfolio] = useState<Portfolio | null>(null);
  const [marketData, setMarketData] = useState<Record<string, any>>({});
  const [showRiskQuiz, setShowRiskQuiz] = useState(false);
  const [activeTab, setActiveTab] = useState('current');
  const [isLoadingMarketData, setIsLoadingMarketData] = useState(false);
  
  const { fetchStockStats } = useMarketData();

  // Sample portfolios with enhanced data
  const sampleCurrentPortfolio: Portfolio = {
    name: "Current Portfolio",
    holdings: [
      { symbol: "AAPL", name: "Apple Inc.", allocation: 23, value: 115000, assetClass: 'stock' },
      { symbol: "NVDA", name: "NVIDIA Corp.", allocation: 11, value: 55000, assetClass: 'stock' },
      { symbol: "MSFT", name: "Microsoft Corp.", allocation: 9, value: 45000, assetClass: 'stock' },
      { symbol: "GOOGL", name: "Alphabet Inc.", allocation: 8, value: 40000, assetClass: 'stock' },
      { symbol: "TSLA", name: "Tesla Inc.", allocation: 7, value: 35000, assetClass: 'stock' },
      { symbol: "SPY", name: "SPDR S&P 500 ETF", allocation: 42, value: 210000, assetClass: 'stock' }
    ],
    riskScore: 72,
    annualIncome: 12300,
    totalValue: 500000
  };

  const sampleProposedPortfolio: Portfolio = {
    name: "AWM Income Model",
    holdings: [
      { symbol: "VTI", name: "Vanguard Total Stock Market", allocation: 40, value: 200000, assetClass: 'stock' },
      { symbol: "AGG", name: "iShares Core US Aggregate Bond", allocation: 30, value: 150000, assetClass: 'bond' },
      { symbol: "VEA", name: "Vanguard FTSE Developed Markets", allocation: 15, value: 75000, assetClass: 'stock' },
      { symbol: "VNQ", name: "Vanguard Real Estate ETF", allocation: 10, value: 50000, assetClass: 'reit' },
      { symbol: "CASH", name: "Cash & Equivalents", allocation: 5, value: 25000, assetClass: 'cash' }
    ],
    riskScore: 38,
    annualIncome: 22500,
    totalValue: 500000
  };

  // Calculate portfolio metrics
  const portfolioMetrics = useMemo(() => {
    if (!currentPortfolio) return { beta: 1.0, volatility: 16.0, yield: 0 };
    
    let weightedBeta = 0;
    let weightedVolatility = 0;
    let weightedYield = 0;

    currentPortfolio.holdings.forEach(holding => {
      const weight = holding.allocation / 100;
      const data = marketData[holding.symbol];
      const beta = data?.beta || (holding.assetClass === 'bond' ? 0.1 : 1.0);
      const volatility = data?.volatility || (holding.assetClass === 'bond' ? 4 : 16);
      const yieldVal = data?.yield || (holding.assetClass === 'bond' ? 3.5 : 1.8);
      
      weightedBeta += beta * weight;
      weightedVolatility += volatility * weight;
      weightedYield += yieldVal * weight;
    });

    return {
      beta: weightedBeta,
      volatility: weightedVolatility,
      yield: weightedYield
    };
  }, [currentPortfolio, marketData]);

  const proposedMetrics = useMemo(() => {
    if (!proposedPortfolio) return { beta: 1.0, volatility: 16.0, yield: 0 };
    
    let weightedBeta = 0;
    let weightedVolatility = 0;
    let weightedYield = 0;

    proposedPortfolio.holdings.forEach(holding => {
      const weight = holding.allocation / 100;
      const beta = holding.assetClass === 'bond' ? 0.1 : holding.assetClass === 'reit' ? 0.8 : 1.0;
      const volatility = holding.assetClass === 'bond' ? 4 : holding.assetClass === 'reit' ? 12 : 16;
      const yieldVal = holding.assetClass === 'bond' ? 4.5 : holding.assetClass === 'reit' ? 3.8 : 1.8;
      
      weightedBeta += beta * weight;
      weightedVolatility += volatility * weight;
      weightedYield += yieldVal * weight;
    });

    return {
      beta: weightedBeta,
      volatility: weightedVolatility,
      yield: weightedYield
    };
  }, [proposedPortfolio]);

  const loadSampleData = async () => {
    setCurrentPortfolio(sampleCurrentPortfolio);
    setProposedPortfolio(sampleProposedPortfolio);
    
    // Auto-fetch market data for current portfolio
    const tickers = sampleCurrentPortfolio.holdings.map(h => h.symbol).filter(s => s !== 'CASH');
    const holdings = sampleCurrentPortfolio.holdings.map(h => ({ ticker: h.symbol, marketValue: h.value }));
    
    if (tickers.length > 0) {
      setIsLoadingMarketData(true);
      try {
        const { data } = await fetchStockStats(tickers, holdings);
        const marketDataMap: Record<string, any> = {};
        
        data.forEach(stock => {
          marketDataMap[stock.ticker] = {
            beta: stock.beta,
            volatility: stock.volatility,
            yield: stock.yield,
            oneYearReturn: stock.oneYearReturn,
            threeYearReturn: stock.threeYearReturn,
            fiveYearReturn: stock.fiveYearReturn,
            sector: stock.sector,
            name: stock.name,
            price: stock.price
          };
        });
        
        setMarketData(marketDataMap);
      } catch (error) {
        console.error('Error fetching market data:', error);
      } finally {
        setIsLoadingMarketData(false);
      }
    }
  };

  const handleMarketDataLoaded = (data: Record<string, any>) => {
    setMarketData(data);
  };

  const allSymbols = currentPortfolio ? currentPortfolio.holdings.map(h => h.symbol) : [];

  const exportToPDF = () => {
    console.log('Exporting comprehensive portfolio analysis to PDF...');
    // This would generate a PDF with all risk metrics, tables, and visuals
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Market Data Service */}
      {allSymbols.length > 0 && (
        <MarketDataService symbols={allSymbols} onDataLoaded={handleMarketDataLoaded} />
      )}

      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-foreground">Portfolio Review Generator</h1>
        <p className="text-muted-foreground mt-2">Comprehensive portfolio analysis with real-time market data</p>
      </div>

      {/* Client Information */}
      <Card>
        <CardHeader>
          <CardTitle>1. Client Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <label className="text-sm font-medium">Client Name</label>
              <Input
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder="Enter client name or search..."
                className="mt-1"
              />
            </div>
            <Button variant="outline">Lookup/Import</Button>
          </div>
        </CardContent>
      </Card>

      {/* Portfolio Import */}
      <Card>
        <CardHeader>
          <CardTitle>2. Portfolio Import/Upload</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Button variant="outline">Upload Statements</Button>
            <Button variant="outline">Connect Account</Button>
            <Button variant="outline">Manual Entry</Button>
            <Button onClick={loadSampleData} disabled={isLoadingMarketData} className="flex items-center gap-2">
              {isLoadingMarketData && <Loader2 className="w-4 h-4 animate-spin" />}
              {isLoadingMarketData ? 'Fetching Market Data...' : 'Load Sample Data'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Portfolio Beta Header/Sidebar */}
      {currentPortfolio && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <PortfolioBetaGauge beta={portfolioMetrics.beta} />
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-full bg-blue-100">
                <DollarSign className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{formatPercentage(portfolioMetrics.yield)}</div>
                <div className="text-sm text-muted-foreground">Portfolio Yield</div>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-full bg-orange-100">
                <TrendingUp className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{formatPercentage(portfolioMetrics.volatility)}</div>
                <div className="text-sm text-muted-foreground">Portfolio Volatility</div>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Risk Narrative */}
      {currentPortfolio && (
        <RiskNarrative 
          portfolioBeta={portfolioMetrics.beta} 
          portfolioVolatility={portfolioMetrics.volatility} 
        />
      )}

      {/* Portfolio Analysis Tabs */}
      {currentPortfolio && proposedPortfolio && (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="current">Current Portfolio</TabsTrigger>
            <TabsTrigger value="proposed">Proposed Portfolio</TabsTrigger>
            <TabsTrigger value="comparison">Side-by-Side</TabsTrigger>
          </TabsList>
          
          <TabsContent value="current" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Current Portfolio Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <HoldingsTable holdings={currentPortfolio.holdings} marketData={marketData} />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="proposed" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Proposed Portfolio - AWM Income Model</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                  <PortfolioBetaGauge beta={proposedMetrics.beta} />
                  <Card className="p-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">{formatPercentage(proposedMetrics.yield)}</div>
                      <div className="text-sm text-muted-foreground">Enhanced Yield</div>
                    </div>
                  </Card>
                  <Card className="p-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{proposedPortfolio.riskScore}</div>
                      <div className="text-sm text-muted-foreground">Risk Score</div>
                    </div>
                  </Card>
                </div>
                <HoldingsTable holdings={proposedPortfolio.holdings} marketData={marketData} />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="comparison" className="space-y-4">
            <BenchmarkComparison portfolio={currentPortfolio} onExportPDF={exportToPDF} />
          </TabsContent>
        </Tabs>
      )}

      {/* Export and Actions */}
      {currentPortfolio && proposedPortfolio && (
        <Card>
          <CardHeader>
            <CardTitle>Export & Next Steps</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <Button onClick={exportToPDF} className="flex items-center gap-2">
                <Download className="w-4 h-4" />
                Export PDF Report
              </Button>
              <Button variant="outline">Email to Client</Button>
              <Button variant="outline" onClick={() => setShowRiskQuiz(true)}>
                Take Risk Quiz
              </Button>
              <Button className="bg-primary">Schedule Review</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Risk Quiz Modal */}
      {showRiskQuiz && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-background p-6 rounded-lg max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <ClientRiskProfileQuiz 
              onClose={() => setShowRiskQuiz(false)}
              onComplete={(profile) => {
                console.log('Risk profile completed:', profile);
                setShowRiskQuiz(false);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}