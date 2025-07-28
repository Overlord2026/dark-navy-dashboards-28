import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/lib/formatters';
import { BucketPlan } from '@/hooks/useLongevityScorecard';
import { Shield, TrendingUp, Banknote, Heart } from 'lucide-react';

interface BucketVisualizationProps {
  bucketPlan: BucketPlan;
  totalAssets: number;
}

export const BucketVisualization: React.FC<BucketVisualizationProps> = ({ 
  bucketPlan, 
  totalAssets 
}) => {
  const buckets = [
    {
      key: 'incomeNow',
      data: bucketPlan.incomeNow,
      icon: Shield,
      color: 'bg-blue-500',
      lightColor: 'bg-blue-100',
      textColor: 'text-blue-700',
      description: 'Conservative bonds and CDs for immediate needs'
    },
    {
      key: 'incomeLater',
      data: bucketPlan.incomeLater,
      icon: Banknote,
      color: 'bg-green-500',
      lightColor: 'bg-green-100',
      textColor: 'text-green-700',
      description: 'Balanced investments for medium-term income'
    },
    {
      key: 'growth',
      data: bucketPlan.growth,
      icon: TrendingUp,
      color: 'bg-purple-500',
      lightColor: 'bg-purple-100',
      textColor: 'text-purple-700',
      description: 'Stocks and growth investments for long-term wealth'
    },
    {
      key: 'legacy',
      data: bucketPlan.legacy,
      icon: Heart,
      color: 'bg-orange-500',
      lightColor: 'bg-orange-100',
      textColor: 'text-orange-700',
      description: 'Estate planning and family legacy preservation'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h3 className="text-2xl font-bold">Your Asset Bucket Strategy</h3>
        <p className="text-muted-foreground">
          Strategic allocation across different time horizons
        </p>
      </div>

      {/* Bucket Waterfall Visual */}
      <Card>
        <CardHeader>
          <CardTitle>Bucket Allocation Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            {/* Total Assets Bar */}
            <div className="w-full h-16 bg-gradient-to-r from-blue-500 via-green-500 via-purple-500 to-orange-500 rounded-lg mb-6 relative overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-white font-bold text-lg">
                  Total Assets: {formatCurrency(totalAssets)}
                </span>
              </div>
            </div>

            {/* Individual Buckets */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {buckets.map(({ key, data, icon: Icon, color, lightColor, textColor, description }) => (
                <Card key={key} className={`${lightColor} border-2`}>
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className={`p-2 ${color} rounded-lg`}>
                        <Icon className="h-5 w-5 text-white" />
                      </div>
                      <Badge variant="secondary">{data.allocation}%</Badge>
                    </div>
                    
                    <div>
                      <h4 className={`font-semibold ${textColor} mb-1`}>
                        {data.years}
                      </h4>
                      <p className="text-2xl font-bold text-foreground">
                        {formatCurrency(data.value)}
                      </p>
                    </div>
                    
                    <p className="text-xs text-muted-foreground">
                      {description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bucket Strategy Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Bucket Strategy Benefits</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <div>
                  <h5 className="font-medium">Sequence Risk Protection</h5>
                  <p className="text-sm text-muted-foreground">
                    Early retirement years protected from market volatility
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                <div>
                  <h5 className="font-medium">Inflation Hedge</h5>
                  <p className="text-sm text-muted-foreground">
                    Growth assets help maintain purchasing power long-term
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                <div>
                  <h5 className="font-medium">Time Arbitrage</h5>
                  <p className="text-sm text-muted-foreground">
                    Different risk levels for different time horizons
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                <div>
                  <h5 className="font-medium">Legacy Planning</h5>
                  <p className="text-sm text-muted-foreground">
                    Dedicated assets for estate and family goals
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recommended Adjustments</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              {bucketPlan.incomeNow.allocation < 15 && (
                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm text-yellow-800">
                    <strong>Consider increasing Income Now bucket</strong> to provide more stability in early retirement years.
                  </p>
                </div>
              )}
              
              {bucketPlan.growth.allocation < 30 && (
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>Growth allocation may be too low</strong> to combat inflation over your long retirement.
                  </p>
                </div>
              )}
              
              {bucketPlan.growth.allocation > 60 && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-800">
                    <strong>High growth allocation</strong> may expose you to excessive sequence risk.
                  </p>
                </div>
              )}
              
              {bucketPlan.legacy.allocation === 0 && (
                <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                  <p className="text-sm text-orange-800">
                    <strong>Consider legacy planning</strong> to preserve wealth for your family or causes you care about.
                  </p>
                </div>
              )}
              
              {/* Default positive message */}
              {bucketPlan.incomeNow.allocation >= 15 && 
               bucketPlan.growth.allocation >= 30 && 
               bucketPlan.growth.allocation <= 60 && (
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm text-green-800">
                    <strong>Well-balanced allocation!</strong> Your bucket strategy provides good risk management across different time horizons.
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};