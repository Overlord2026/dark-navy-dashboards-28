import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Shield, 
  TrendingUp, 
  AlertTriangle, 
  Target,
  BarChart3,
  PieChart
} from 'lucide-react';

interface Portfolio {
  holdings: any[];
  analysis: any;
  riskMetrics: any;
  incomeAnalysis: any;
  feeAnalysis: any;
}

interface RiskProfile {
  age?: number;
  timeHorizon?: number;
  riskTolerance?: 'conservative' | 'moderate' | 'growth' | 'aggressive';
  investmentGoals?: string[];
}

interface RiskScoreResult {
  score: number;
  level: string;
  color: string;
  description: string;
  factors: RiskFactor[];
  recommendations: string[];
}

interface RiskFactor {
  name: string;
  impact: number;
  description: string;
  weight: number;
}

interface RiskScoreCalculatorProps {
  portfolio: Portfolio;
  riskProfile?: RiskProfile;
  className?: string;
}

export const RiskScoreCalculator: React.FC<RiskScoreCalculatorProps> = ({
  portfolio,
  riskProfile,
  className = ''
}) => {
  const calculateRiskScore = (): RiskScoreResult => {
    const factors: RiskFactor[] = [];
    let totalScore = 0;
    let totalWeight = 0;

    // 1. Asset Allocation Score (40% weight)
    const assetAllocationScore = calculateAssetAllocationScore(portfolio.analysis.asset_allocation);
    factors.push({
      name: 'Asset Allocation',
      impact: assetAllocationScore,
      description: getAssetAllocationDescription(portfolio.analysis.asset_allocation),
      weight: 0.4
    });
    totalScore += assetAllocationScore * 0.4;
    totalWeight += 0.4;

    // 2. Concentration Risk Score (25% weight)
    const concentrationScore = calculateConcentrationScore(portfolio);
    factors.push({
      name: 'Concentration Risk',
      impact: concentrationScore,
      description: getConcentrationDescription(portfolio),
      weight: 0.25
    });
    totalScore += concentrationScore * 0.25;
    totalWeight += 0.25;

    // 3. Volatility Score (20% weight)
    const volatilityScore = calculateVolatilityScore(portfolio);
    factors.push({
      name: 'Portfolio Volatility',
      impact: volatilityScore,
      description: getVolatilityDescription(portfolio),
      weight: 0.2
    });
    totalScore += volatilityScore * 0.2;
    totalWeight += 0.2;

    // 4. Sector Diversification Score (15% weight)
    const sectorScore = calculateSectorDiversificationScore(portfolio);
    factors.push({
      name: 'Sector Diversification',
      impact: sectorScore,
      description: getSectorDescription(portfolio),
      weight: 0.15
    });
    totalScore += sectorScore * 0.15;
    totalWeight += 0.15;

    // Apply age/time horizon adjustment if available
    if (riskProfile?.age || riskProfile?.timeHorizon) {
      const ageAdjustment = calculateAgeAdjustment(riskProfile);
      totalScore = Math.max(1, Math.min(100, totalScore + ageAdjustment));
    }

    const finalScore = Math.round(totalScore / totalWeight);
    const riskLevel = getRiskLevel(finalScore);

    return {
      score: finalScore,
      level: riskLevel.level,
      color: riskLevel.color,
      description: riskLevel.description,
      factors,
      recommendations: generateRecommendations(finalScore, factors, riskProfile)
    };
  };

  const calculateAssetAllocationScore = (allocation: Record<string, number>): number => {
    // Risk weights for different asset classes
    const riskWeights: Record<string, number> = {
      'cash': 1,
      'bond': 15,
      'international_bond': 20,
      'equity': 70,
      'international_equity': 75,
      'emerging_markets': 90,
      'real_estate': 60,
      'commodities': 80,
      'private_equity': 95,
      'hedge_funds': 85,
      'cryptocurrency': 100
    };

    let weightedRisk = 0;
    let totalAllocation = 0;

    Object.entries(allocation).forEach(([assetClass, percentage]) => {
      const weight = riskWeights[assetClass] || 50; // Default moderate risk
      weightedRisk += (percentage / 100) * weight;
      totalAllocation += percentage;
    });

    return Math.round(weightedRisk);
  };

  const calculateConcentrationScore = (portfolio: Portfolio): number => {
    const holdings = portfolio.holdings;
    const totalValue = portfolio.analysis.total_value;
    
    // Calculate largest position weight
    const largestPosition = Math.max(...holdings.map((h: any) => h.market_value));
    const largestWeight = (largestPosition / totalValue) * 100;
    
    // Calculate number of holdings effect
    const holdingsCount = holdings.length;
    
    let concentrationScore = 0;
    
    // Largest position penalty
    if (largestWeight > 25) concentrationScore += 40;
    else if (largestWeight > 15) concentrationScore += 25;
    else if (largestWeight > 10) concentrationScore += 15;
    else if (largestWeight > 5) concentrationScore += 5;
    
    // Holdings count penalty
    if (holdingsCount < 5) concentrationScore += 30;
    else if (holdingsCount < 10) concentrationScore += 15;
    else if (holdingsCount < 20) concentrationScore += 5;
    
    return Math.min(100, concentrationScore);
  };

  const calculateVolatilityScore = (portfolio: Portfolio): number => {
    // Use portfolio beta and estimated volatility
    const beta = portfolio.riskMetrics.beta || 1.0;
    const volatility = portfolio.riskMetrics.volatility || 0.15;
    
    // Convert to risk score (higher volatility = higher risk score)
    const volatilityScore = Math.min(100, (volatility * 400)); // 25% vol = 100 score
    const betaScore = Math.min(100, (beta * 50)); // Beta of 2 = 100 score
    
    return Math.round((volatilityScore + betaScore) / 2);
  };

  const calculateSectorDiversificationScore = (portfolio: Portfolio): number => {
    const sectorAllocation = portfolio.analysis.sector_allocation || {};
    const sectors = Object.keys(sectorAllocation);
    
    if (sectors.length === 0) return 50; // Default if no sector data
    
    // Calculate Herfindahl-Hirschman Index for sector concentration
    const hhi = Object.values(sectorAllocation).reduce((sum: number, weight: any) => {
      return sum + Math.pow(weight, 2);
    }, 0);
    
    // Convert HHI to risk score (higher concentration = higher risk)
    // HHI ranges from 0 (perfectly diversified) to 10000 (single sector)
    const concentrationScore = Math.min(100, hhi / 100);
    
    return Math.round(concentrationScore);
  };

  const calculateAgeAdjustment = (profile: RiskProfile): number => {
    let adjustment = 0;
    
    if (profile.age) {
      // Rule of thumb: 100 - age = equity percentage
      // Adjust risk score based on age appropriateness
      if (profile.age < 30) adjustment -= 5; // Young investors can take more risk
      else if (profile.age > 65) adjustment += 10; // Older investors should be more conservative
      else if (profile.age > 55) adjustment += 5;
    }
    
    if (profile.timeHorizon) {
      if (profile.timeHorizon < 5) adjustment += 15; // Short term = lower risk
      else if (profile.timeHorizon > 20) adjustment -= 10; // Long term = can take more risk
    }
    
    return adjustment;
  };

  const getRiskLevel = (score: number) => {
    if (score <= 25) {
      return {
        level: 'Conservative',
        color: 'bg-green-100 text-green-800 border-green-200',
        description: 'Low risk, capital preservation focused'
      };
    } else if (score <= 45) {
      return {
        level: 'Moderate-Conservative',
        color: 'bg-blue-100 text-blue-800 border-blue-200',
        description: 'Below average risk, income focused'
      };
    } else if (score <= 65) {
      return {
        level: 'Moderate',
        color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        description: 'Balanced risk and return'
      };
    } else if (score <= 85) {
      return {
        level: 'Growth',
        color: 'bg-orange-100 text-orange-800 border-orange-200',
        description: 'Above average risk, growth focused'
      };
    } else {
      return {
        level: 'Aggressive',
        color: 'bg-red-100 text-red-800 border-red-200',
        description: 'High risk, maximum growth potential'
      };
    }
  };

  const getAssetAllocationDescription = (allocation: Record<string, number>): string => {
    const equityPercent = (allocation.equity || 0) + (allocation.international_equity || 0) + (allocation.emerging_markets || 0);
    const bondPercent = allocation.bond || 0;
    const cashPercent = allocation.cash || 0;
    
    if (equityPercent > 80) return 'High equity allocation increases growth potential and risk';
    if (equityPercent < 30) return 'Conservative allocation prioritizes capital preservation';
    if (bondPercent > 50) return 'Bond-heavy allocation provides stability and income';
    return 'Balanced allocation between growth and stability';
  };

  const getConcentrationDescription = (portfolio: Portfolio): string => {
    const largestWeight = portfolio.analysis.largest_position_weight;
    const holdingsCount = portfolio.analysis.holdings_count;
    
    if (largestWeight > 20) return 'High single-position concentration increases risk';
    if (holdingsCount < 10) return 'Limited holdings reduce diversification benefits';
    return 'Reasonable diversification across holdings';
  };

  const getVolatilityDescription = (portfolio: Portfolio): string => {
    const volatility = portfolio.riskMetrics.volatility || 0.15;
    
    if (volatility > 0.25) return 'High volatility indicates significant price swings';
    if (volatility < 0.10) return 'Low volatility provides stable returns';
    return 'Moderate volatility balances growth and stability';
  };

  const getSectorDescription = (portfolio: Portfolio): string => {
    const sectors = Object.keys(portfolio.analysis.sector_allocation || {});
    const maxSector = Math.max(...Object.values(portfolio.analysis.sector_allocation || {}));
    
    if (maxSector > 40) return 'High sector concentration increases specific risk';
    if (sectors.length < 5) return 'Limited sector diversification';
    return 'Good sector diversification reduces specific risks';
  };

  const generateRecommendations = (score: number, factors: RiskFactor[], profile?: RiskProfile): string[] => {
    const recommendations: string[] = [];
    
    // High risk recommendations
    if (score > 80) {
      recommendations.push('Consider reducing equity allocation for better balance');
      recommendations.push('Add bonds or defensive assets to lower overall risk');
    }
    
    // Concentration recommendations
    const concentrationFactor = factors.find(f => f.name === 'Concentration Risk');
    if (concentrationFactor && concentrationFactor.impact > 60) {
      recommendations.push('Reduce largest positions to improve diversification');
      recommendations.push('Consider adding more holdings to spread risk');
    }
    
    // Age-based recommendations
    if (profile?.age) {
      if (profile.age > 60 && score > 70) {
        recommendations.push('Consider more conservative allocation as you approach retirement');
      }
      if (profile.age < 35 && score < 40) {
        recommendations.push('Young investors can typically afford higher growth allocation');
      }
    }
    
    // Sector diversification
    const sectorFactor = factors.find(f => f.name === 'Sector Diversification');
    if (sectorFactor && sectorFactor.impact > 70) {
      recommendations.push('Improve sector diversification to reduce concentration risk');
    }
    
    return recommendations;
  };

  const riskResult = calculateRiskScore();

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Portfolio Risk Score
        </CardTitle>
        <CardDescription>
          Comprehensive risk assessment based on allocation, concentration, and volatility
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Main Risk Score */}
          <div className="text-center">
            <div className="relative inline-flex items-center justify-center w-32 h-32 mb-4">
              <div className="absolute inset-0">
                <svg className="transform -rotate-90 w-32 h-32">
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="hsl(var(--muted))"
                    strokeWidth="8"
                    fill="none"
                  />
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="hsl(var(--primary))"
                    strokeWidth="8"
                    fill="none"
                    strokeDasharray={`${2 * Math.PI * 56}`}
                    strokeDashoffset={`${2 * Math.PI * 56 * (1 - riskResult.score / 100)}`}
                    className="transition-all duration-1000"
                  />
                </svg>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{riskResult.score}</div>
                <div className="text-xs text-gray-500">Risk Score</div>
              </div>
            </div>
            
            <Badge className={`${riskResult.color} border px-4 py-2 text-sm font-medium`}>
              {riskResult.level}
            </Badge>
            <p className="text-sm text-gray-600 mt-2">{riskResult.description}</p>
          </div>

          {/* Risk Factors Breakdown */}
          <div>
            <h4 className="font-medium mb-3">Risk Factor Analysis</h4>
            <div className="space-y-3">
              {riskResult.factors.map((factor, index) => (
                <div key={index}>
                  <div className="flex justify-between text-sm mb-1">
                    <span>{factor.name}</span>
                    <span className="font-medium">{factor.impact}/100</span>
                  </div>
                  <Progress value={factor.impact} className="h-2" />
                  <p className="text-xs text-gray-500 mt-1">{factor.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Recommendations */}
          {riskResult.recommendations.length > 0 && (
            <div>
              <h4 className="font-medium mb-3 flex items-center gap-2">
                <Target className="h-4 w-4" />
                Recommendations
              </h4>
              <ul className="space-y-2">
                {riskResult.recommendations.map((rec, index) => (
                  <li key={index} className="text-sm flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    {rec}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Risk Profile Integration */}
          {riskProfile && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium mb-2">Risk Profile Alignment</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                {riskProfile.age && (
                  <div>
                    <span className="text-gray-500">Age:</span>
                    <span className="ml-2 font-medium">{riskProfile.age}</span>
                  </div>
                )}
                {riskProfile.timeHorizon && (
                  <div>
                    <span className="text-gray-500">Time Horizon:</span>
                    <span className="ml-2 font-medium">{riskProfile.timeHorizon} years</span>
                  </div>
                )}
                {riskProfile.riskTolerance && (
                  <div>
                    <span className="text-gray-500">Risk Tolerance:</span>
                    <span className="ml-2 font-medium capitalize">{riskProfile.riskTolerance}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};