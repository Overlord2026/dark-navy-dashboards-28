import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { 
  Target, 
  TrendingUp, 
  Shield, 
  DollarSign,
  BarChart3,
  ArrowRight,
  Check,
  AlertCircle
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

interface ModelComparisonProps {
  portfolio: any;
  selectedModels: string[];
  onModelsChange: (models: string[]) => void;
  onNext: () => void;
  onBack: () => void;
}

interface InvestmentModel {
  id: string;
  name: string;
  description: string;
  risk_level: number;
  target_allocation: Record<string, number>;
  model_securities: Array<{
    ticker: string;
    weight: number;
    asset_class: string;
  }>;
  fee_structure: {
    management_fee: number;
    performance_fee?: number;
  };
  expected_return: number;
  volatility: number;
  sharpe_ratio: number;
}

interface ComparisonMetrics {
  risk_change: number;
  return_potential: number;
  fee_impact: number;
  diversification_improvement: number;
  income_impact: number;
}

const modelCategories = [
  {
    id: 'income',
    name: 'Income Models',
    description: 'Focus on dividend yield and income generation',
    icon: <DollarSign className="h-5 w-5" />
  },
  {
    id: 'growth',
    name: 'Growth Models',
    description: 'Capital appreciation focused strategies',
    icon: <TrendingUp className="h-5 w-5" />
  },
  {
    id: 'balanced',
    name: 'Balanced Models',
    description: 'Mix of growth and income objectives',
    icon: <BarChart3 className="h-5 w-5" />
  },
  {
    id: 'alternative',
    name: 'Alternative Models',
    description: 'Private markets and alternative investments',
    icon: <Target className="h-5 w-5" />
  }
];

export const ModelComparison: React.FC<ModelComparisonProps> = ({
  portfolio,
  selectedModels,
  onModelsChange,
  onNext,
  onBack
}) => {
  const [availableModels, setAvailableModels] = useState<InvestmentModel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [comparisonData, setComparisonData] = useState<Record<string, ComparisonMetrics>>({});
  const [primaryModel, setPrimaryModel] = useState<string>('');

  useEffect(() => {
    fetchInvestmentModels();
  }, []);

  useEffect(() => {
    if (selectedModels.length > 0) {
      generateComparison();
    }
  }, [selectedModels, portfolio]);

  const fetchInvestmentModels = async () => {
    try {
      const { data, error } = await supabase
        .from('investment_models')
        .select('*')
        .eq('is_active', true)
        .order('name');

      if (error) throw error;

      const modelsWithMetrics = (data || []).map(model => ({
        ...model,
        expected_return: calculateExpectedReturn(model),
        volatility: calculateVolatility(model),
        sharpe_ratio: calculateSharpeRatio(model)
      }));

      setAvailableModels(modelsWithMetrics);
    } catch (error) {
      console.error('Error fetching models:', error);
      toast.error('Failed to load investment models');
    } finally {
      setIsLoading(false);
    }
  };

  const calculateExpectedReturn = (model: InvestmentModel): number => {
    // Simplified calculation - would use historical data and market projections
    const assetReturns: Record<string, number> = {
      'equity': 0.10,
      'bond': 0.04,
      'international_equity': 0.09,
      'emerging_markets': 0.12,
      'real_estate': 0.08,
      'commodities': 0.06,
      'cash': 0.02
    };

    return Object.entries(model.target_allocation).reduce((total, [assetClass, weight]) => {
      return total + ((weight / 100) * (assetReturns[assetClass] || 0.07));
    }, 0);
  };

  const calculateVolatility = (model: InvestmentModel): number => {
    // Simplified volatility calculation
    const assetVolatilities: Record<string, number> = {
      'equity': 0.16,
      'bond': 0.05,
      'international_equity': 0.18,
      'emerging_markets': 0.22,
      'real_estate': 0.15,
      'commodities': 0.20,
      'cash': 0.01
    };

    return Math.sqrt(
      Object.entries(model.target_allocation).reduce((total, [assetClass, weight]) => {
        const vol = assetVolatilities[assetClass] || 0.15;
        return total + Math.pow((weight / 100) * vol, 2);
      }, 0)
    );
  };

  const calculateSharpeRatio = (model: InvestmentModel): number => {
    const riskFreeRate = 0.03; // 3% risk-free rate
    return (model.expected_return - riskFreeRate) / model.volatility;
  };

  const generateComparison = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('model-comparison', {
        body: {
          current_portfolio: portfolio,
          model_ids: selectedModels
        }
      });

      if (error) throw error;
      setComparisonData(data.comparisons || {});
    } catch (error) {
      console.error('Error generating comparison:', error);
      toast.error('Failed to generate model comparison');
    }
  };

  const handleModelToggle = (modelId: string) => {
    const newSelection = selectedModels.includes(modelId)
      ? selectedModels.filter(id => id !== modelId)
      : [...selectedModels, modelId];
    
    onModelsChange(newSelection);

    if (!primaryModel && newSelection.length === 1) {
      setPrimaryModel(newSelection[0]);
    } else if (primaryModel === modelId && !newSelection.includes(modelId)) {
      setPrimaryModel(newSelection[0] || '');
    }
  };

  const getModelsByCategory = (categoryId: string) => {
    return availableModels.filter(model => {
      switch (categoryId) {
        case 'income':
          return model.name.toLowerCase().includes('income') || 
                 model.name.toLowerCase().includes('dividend') ||
                 model.target_allocation.bond > 40;
        case 'growth':
          return model.name.toLowerCase().includes('growth') || 
                 model.target_allocation.equity > 70;
        case 'balanced':
          return model.name.toLowerCase().includes('balanced') || 
                 model.name.toLowerCase().includes('moderate') ||
                 (model.target_allocation.equity >= 40 && model.target_allocation.equity <= 70);
        case 'alternative':
          return model.name.toLowerCase().includes('alternative') ||
                 model.name.toLowerCase().includes('private') ||
                 Object.keys(model.target_allocation).some(key => 
                   ['real_estate', 'commodities', 'private_equity'].includes(key)
                 );
        default:
          return false;
      }
    });
  };

  const getCurrentVsModelData = () => {
    if (selectedModels.length === 0) return [];

    const primaryModelData = availableModels.find(m => m.id === primaryModel);
    if (!primaryModelData) return [];

    return Object.entries(primaryModelData.target_allocation).map(([assetClass, targetWeight]) => ({
      asset_class: assetClass.replace('_', ' ').toUpperCase(),
      current: portfolio.analysis.asset_allocation[assetClass] || 0,
      recommended: targetWeight,
      difference: targetWeight - (portfolio.analysis.asset_allocation[assetClass] || 0)
    }));
  };

  const getComparisonMetrics = () => {
    if (!primaryModel || !comparisonData[primaryModel]) return null;
    return comparisonData[primaryModel];
  };

  const getRiskLevel = (riskScore: number) => {
    if (riskScore <= 3) return { label: 'Conservative', color: 'bg-green-100 text-green-800' };
    if (riskScore <= 7) return { label: 'Moderate', color: 'bg-yellow-100 text-yellow-800' };
    return { label: 'Aggressive', color: 'bg-red-100 text-red-800' };
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Model Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Select Investment Models to Compare</CardTitle>
          <CardDescription>
            Choose 1-3 models to compare against the current portfolio
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {modelCategories.map((category) => {
              const categoryModels = getModelsByCategory(category.id);
              if (categoryModels.length === 0) return null;

              return (
                <div key={category.id}>
                  <div className="flex items-center gap-2 mb-3">
                    {category.icon}
                    <h3 className="font-medium">{category.name}</h3>
                    <span className="text-sm text-gray-500">({categoryModels.length})</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{category.description}</p>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                    {categoryModels.map((model) => {
                      const isSelected = selectedModels.includes(model.id);
                      const riskLevel = getRiskLevel(model.risk_level);

                      return (
                        <div
                          key={model.id}
                          className={`p-4 border rounded-lg cursor-pointer transition-all ${
                            isSelected ? 'border-primary bg-primary/5' : 'border-gray-200 hover:border-gray-300'
                          }`}
                          onClick={() => handleModelToggle(model.id)}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <Checkbox checked={isSelected} />
                              <h4 className="font-medium">{model.name}</h4>
                            </div>
                            <Badge className={riskLevel.color}>{riskLevel.label}</Badge>
                          </div>
                          
                          <p className="text-sm text-gray-600 mb-3">{model.description}</p>
                          
                          <div className="grid grid-cols-3 gap-3 text-sm">
                            <div>
                              <span className="text-gray-500">Expected Return</span>
                              <p className="font-medium">{(model.expected_return * 100).toFixed(1)}%</p>
                            </div>
                            <div>
                              <span className="text-gray-500">Volatility</span>
                              <p className="font-medium">{(model.volatility * 100).toFixed(1)}%</p>
                            </div>
                            <div>
                              <span className="text-gray-500">Management Fee</span>
                              <p className="font-medium">{model.fee_structure.management_fee}%</p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Primary Model Selection */}
      {selectedModels.length > 1 && (
        <Card>
          <CardHeader>
            <CardTitle>Select Primary Recommendation</CardTitle>
            <CardDescription>
              Choose the main model for detailed comparison and proposal generation
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RadioGroup value={primaryModel} onValueChange={setPrimaryModel}>
              <div className="space-y-3">
                {selectedModels.map((modelId) => {
                  const model = availableModels.find(m => m.id === modelId);
                  if (!model) return null;

                  return (
                    <div key={modelId} className="flex items-center space-x-2">
                      <RadioGroupItem value={modelId} id={modelId} />
                      <Label htmlFor={modelId} className="flex-1 cursor-pointer">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">{model.name}</span>
                          <span className="text-sm text-gray-500">
                            {(model.expected_return * 100).toFixed(1)}% return
                          </span>
                        </div>
                      </Label>
                    </div>
                  );
                })}
              </div>
            </RadioGroup>
          </CardContent>
        </Card>
      )}

      {/* Comparison Analysis */}
      {primaryModel && (
        <>
          {/* Current vs Recommended Allocation */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ArrowRight className="h-5 w-5" />
                Current vs Recommended Allocation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={getCurrentVsModelData()}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="asset_class" 
                      angle={-45}
                      textAnchor="end"
                      height={80}
                      fontSize={12}
                    />
                    <YAxis />
                    <Tooltip formatter={(value, name) => [`${Number(value).toFixed(1)}%`, name === 'current' ? 'Current' : 'Recommended']} />
                    <Bar dataKey="current" fill="hsl(var(--muted))" name="current" />
                    <Bar dataKey="recommended" fill="hsl(var(--primary))" name="recommended" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Impact Analysis */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Expected Impact Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              {(() => {
                const metrics = getComparisonMetrics();
                if (!metrics) return <p className="text-gray-500">Generating comparison...</p>;

                return (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-4">
                      <h4 className="font-medium">Risk & Return</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-sm">Risk Change</span>
                          <span className={`font-medium ${metrics.risk_change > 0 ? 'text-red-600' : 'text-green-600'}`}>
                            {metrics.risk_change > 0 ? '+' : ''}{metrics.risk_change.toFixed(1)}%
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Return Potential</span>
                          <span className="font-medium text-green-600">
                            +{metrics.return_potential.toFixed(1)}%
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-medium">Portfolio Quality</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-sm">Diversification</span>
                          <span className="font-medium text-blue-600">
                            +{metrics.diversification_improvement.toFixed(1)}%
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Income Impact</span>
                          <span className={`font-medium ${metrics.income_impact > 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {metrics.income_impact > 0 ? '+' : ''}{metrics.income_impact.toFixed(1)}%
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-medium">Costs</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-sm">Fee Impact</span>
                          <span className={`font-medium ${metrics.fee_impact > 0 ? 'text-red-600' : 'text-green-600'}`}>
                            {metrics.fee_impact > 0 ? '+' : ''}{metrics.fee_impact.toFixed(2)}%
                          </span>
                        </div>
                        <div className="text-sm text-gray-500">
                          Annual cost change: ${(portfolio.analysis.total_value * metrics.fee_impact / 100).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </CardContent>
          </Card>

          {/* Key Changes Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Check className="h-5 w-5" />
                Key Portfolio Changes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {getCurrentVsModelData()
                  .filter(item => Math.abs(item.difference) > 5)
                  .map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="font-medium">{item.asset_class}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm">{item.current.toFixed(1)}%</span>
                        <ArrowRight className="h-4 w-4 text-gray-400" />
                        <span className="text-sm font-medium">{item.recommended.toFixed(1)}%</span>
                        <span className={`text-sm px-2 py-1 rounded ${
                          item.difference > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {item.difference > 0 ? '+' : ''}{item.difference.toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {/* Navigation */}
      <div className="flex gap-3">
        <Button variant="outline" onClick={onBack}>
          Back to Analysis
        </Button>
        <Button 
          onClick={onNext} 
          disabled={selectedModels.length === 0}
          className="flex-1"
        >
          Generate Proposal
        </Button>
      </div>
    </div>
  );
};