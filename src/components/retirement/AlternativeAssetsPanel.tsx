/**
 * Alternative Assets Analysis Panel
 */

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  TrendingUp, 
  Shield, 
  Clock, 
  DollarSign, 
  AlertTriangle,
  Info,
  CheckCircle
} from 'lucide-react';
import { MultiPhaseInput, AlternativeAssetConfig } from '@/engines/multiPhase/multiPhaseEngine';

interface AlternativeAssetsPanelProps {
  alternativeMetrics: {
    privateCredit: { etay: number; liquidityVaR: number };
    infrastructure: { etay: number; liquidityVaR: number };
    cryptoStaking: { seay: number; liquidityVaR: number };
  };
  hasAccess: {
    privateCredit: boolean;
    infrastructure: boolean;
    cryptoStaking: boolean;
  };
  input: MultiPhaseInput;
  onInputChange: (updates: Partial<AlternativeAssetConfig>) => void;
}

export function AlternativeAssetsPanel({ 
  alternativeMetrics, 
  hasAccess, 
  input,
  onInputChange 
}: AlternativeAssetsPanelProps) {
  const formatPercentage = (value: number) => `${(value * 100).toFixed(2)}%`;
  const formatCurrency = (value: number) => new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);

  const getAccessibilityStatus = (assetType: keyof typeof hasAccess) => {
    const minimums = {
      privateCredit: 250000,
      infrastructure: 500000,
      cryptoStaking: 10000
    };

    return {
      accessible: hasAccess[assetType],
      minimum: minimums[assetType],
      shortfall: Math.max(0, minimums[assetType] - input.portfolioValue)
    };
  };

  const getRiskLevel = (liquidityVaR: number) => {
    if (liquidityVaR < 0.05) return { level: 'Low', color: 'text-green-600', bg: 'bg-green-100' };
    if (liquidityVaR < 0.15) return { level: 'Medium', color: 'text-yellow-600', bg: 'bg-yellow-100' };
    return { level: 'High', color: 'text-red-600', bg: 'bg-red-100' };
  };

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Private Credit ETAY</p>
                <p className="text-lg font-semibold text-green-600">
                  {formatPercentage(alternativeMetrics.privateCredit.etay)}
                </p>
              </div>
              <TrendingUp className="h-5 w-5 text-green-500" />
            </div>
            <div className="mt-2">
              {hasAccess.privateCredit ? (
                <Badge variant="default" className="text-xs">Accessible</Badge>
              ) : (
                <Badge variant="secondary" className="text-xs">Min: $250K</Badge>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Infrastructure ETAY</p>
                <p className="text-lg font-semibold text-blue-600">
                  {formatPercentage(alternativeMetrics.infrastructure.etay)}
                </p>
              </div>
              <Shield className="h-5 w-5 text-blue-500" />
            </div>
            <div className="mt-2">
              {hasAccess.infrastructure ? (
                <Badge variant="default" className="text-xs">Accessible</Badge>
              ) : (
                <Badge variant="secondary" className="text-xs">Min: $500K</Badge>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Crypto Staking SEAY</p>
                <p className="text-lg font-semibold text-purple-600">
                  {formatPercentage(alternativeMetrics.cryptoStaking.seay)}
                </p>
              </div>
              <DollarSign className="h-5 w-5 text-purple-500" />
            </div>
            <div className="mt-2">
              {hasAccess.cryptoStaking ? (
                <Badge variant="default" className="text-xs">Accessible</Badge>
              ) : (
                <Badge variant="secondary" className="text-xs">Min: $10K</Badge>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="private-credit" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="private-credit">Private Credit</TabsTrigger>
          <TabsTrigger value="infrastructure">Infrastructure</TabsTrigger>
          <TabsTrigger value="crypto-staking">Crypto Staking</TabsTrigger>
        </TabsList>

        <TabsContent value="private-credit">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-500" />
                Private Credit Analysis
              </CardTitle>
              <CardDescription>
                Direct lending to middle-market companies with enhanced yield and lower volatility
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {!hasAccess.privateCredit && (
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    Private credit requires a minimum investment of $250,000. 
                    Current portfolio shortfall: {formatCurrency(getAccessibilityStatus('privateCredit').shortfall)}
                  </AlertDescription>
                </Alert>
              )}

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium">Performance Metrics</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm">Expected Tax-Adjusted Yield (ETAY):</span>
                      <span className="font-medium text-green-600">
                        {formatPercentage(alternativeMetrics.privateCredit.etay)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Gross Expected Return:</span>
                      <span className="font-medium">
                        {formatPercentage(input.alternativeAssets.privateCredit.expectedReturn)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Maximum Drawdown:</span>
                      <span className="font-medium">
                        {formatPercentage(input.alternativeAssets.privateCredit.maxDrawdown)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Risk Assessment</h4>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm">Liquidity Value-at-Risk:</span>
                        <Badge 
                          variant="outline" 
                          className={getRiskLevel(alternativeMetrics.privateCredit.liquidityVaR).bg}
                        >
                          {getRiskLevel(alternativeMetrics.privateCredit.liquidityVaR).level}
                        </Badge>
                      </div>
                      <Progress 
                        value={alternativeMetrics.privateCredit.liquidityVaR * 100} 
                        className="h-2" 
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        {formatPercentage(alternativeMetrics.privateCredit.liquidityVaR)} potential liquidity cost
                      </p>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Liquidity Timeline:</span>
                      <span className="font-medium">
                        {input.alternativeAssets.privateCredit.liquidityDays} days
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-medium mb-3">Key Benefits</h4>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>Enhanced yield over traditional fixed income</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>Lower correlation to public markets</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>Floating rate structure (inflation protection)</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>Senior secured positioning</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>Reduced volatility vs. equity markets</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>Quarterly liquidity options</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="infrastructure">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-blue-500" />
                Infrastructure Analysis
              </CardTitle>
              <CardDescription>
                Essential infrastructure assets with inflation protection and stable cash flows
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {!hasAccess.infrastructure && (
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    Infrastructure investments require a minimum of $500,000. 
                    Current portfolio shortfall: {formatCurrency(getAccessibilityStatus('infrastructure').shortfall)}
                  </AlertDescription>
                </Alert>
              )}

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium">Performance Metrics</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm">Expected Tax-Adjusted Yield (ETAY):</span>
                      <span className="font-medium text-blue-600">
                        {formatPercentage(alternativeMetrics.infrastructure.etay)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Gross Expected Return:</span>
                      <span className="font-medium">
                        {formatPercentage(input.alternativeAssets.infrastructure.expectedReturn)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Maximum Drawdown:</span>
                      <span className="font-medium">
                        {formatPercentage(input.alternativeAssets.infrastructure.maxDrawdown)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Risk Assessment</h4>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm">Liquidity Value-at-Risk:</span>
                        <Badge 
                          variant="outline" 
                          className={getRiskLevel(alternativeMetrics.infrastructure.liquidityVaR).bg}
                        >
                          {getRiskLevel(alternativeMetrics.infrastructure.liquidityVaR).level}
                        </Badge>
                      </div>
                      <Progress 
                        value={alternativeMetrics.infrastructure.liquidityVaR * 100} 
                        className="h-2" 
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        {formatPercentage(alternativeMetrics.infrastructure.liquidityVaR)} potential liquidity cost
                      </p>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Liquidity Timeline:</span>
                      <span className="font-medium">
                        {input.alternativeAssets.infrastructure.liquidityDays} days
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-medium mb-3">Key Benefits</h4>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>Inflation-linked cash flows</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>Essential service monopolies</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>Long-term contracted revenues</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>Portfolio diversification benefits</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>ESG-aligned investments</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>Recession-resistant cash flows</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="crypto-staking">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-purple-500" />
                Crypto Staking Analysis
              </CardTitle>
              <CardDescription>
                Institutional-grade staking with enhanced yields and risk management
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {!hasAccess.cryptoStaking && (
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    Crypto staking requires a minimum of $10,000. 
                    Current portfolio shortfall: {formatCurrency(getAccessibilityStatus('cryptoStaking').shortfall)}
                  </AlertDescription>
                </Alert>
              )}

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium">Performance Metrics</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm">Staking Expected After-tax Yield (SEAY):</span>
                      <span className="font-medium text-purple-600">
                        {formatPercentage(alternativeMetrics.cryptoStaking.seay)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Gross Staking APR:</span>
                      <span className="font-medium">
                        {formatPercentage(input.alternativeAssets.cryptoStaking.stakingAPR)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Slashing Risk:</span>
                      <span className="font-medium">
                        {formatPercentage(input.alternativeAssets.cryptoStaking.slashingProb)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Risk Assessment</h4>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm">Liquidity Value-at-Risk:</span>
                        <Badge 
                          variant="outline" 
                          className={getRiskLevel(alternativeMetrics.cryptoStaking.liquidityVaR).bg}
                        >
                          {getRiskLevel(alternativeMetrics.cryptoStaking.liquidityVaR).level}
                        </Badge>
                      </div>
                      <Progress 
                        value={alternativeMetrics.cryptoStaking.liquidityVaR * 100} 
                        className="h-2" 
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        {formatPercentage(alternativeMetrics.cryptoStaking.liquidityVaR)} potential liquidity cost
                      </p>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Unbonding Period:</span>
                      <span className="font-medium">
                        {input.alternativeAssets.cryptoStaking.unbondDays} days
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  <strong>High Risk Asset:</strong> Crypto staking involves significant volatility and regulatory risks. 
                  Recommended allocation should not exceed 5% of total portfolio.
                </AlertDescription>
              </Alert>

              <div className="border-t pt-4">
                <h4 className="font-medium mb-3">Key Considerations</h4>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>High yield potential</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>Institutional-grade custody</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>Diversification benefits</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <AlertTriangle className="h-4 w-4 text-amber-500" />
                      <span>High volatility risk</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <AlertTriangle className="h-4 w-4 text-amber-500" />
                      <span>Regulatory uncertainty</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <AlertTriangle className="h-4 w-4 text-amber-500" />
                      <span>Technology risks</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}