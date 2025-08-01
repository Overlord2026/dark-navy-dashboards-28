import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useDropzone } from 'react-dropzone';
import { 
  Upload, 
  FileText, 
  Target, 
  Eye, 
  Send, 
  Download,
  BarChart3,
  PieChart,
  TrendingUp,
  AlertTriangle,
  DollarSign,
  Shield,
  Zap
} from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import { PortfolioAnalysis } from './PortfolioAnalysis';
import { ModelComparison } from './ModelComparison';
import { ProposalPreview } from './ProposalPreview';
import { ManualEntryForm } from './ManualEntryForm';

interface Portfolio {
  holdings: PortfolioHolding[];
  analysis: PortfolioAnalysisData;
  riskMetrics: RiskMetrics;
  incomeAnalysis: IncomeAnalysis;
  feeAnalysis: FeeAnalysis;
}

interface PortfolioHolding {
  ticker: string;
  name: string;
  quantity: number;
  market_value: number;
  cost_basis?: number;
  asset_class: string;
  sector?: string;
  expense_ratio?: number;
  dividend_yield?: number;
  beta?: number;
  weight_percent: number;
}

interface PortfolioAnalysisData {
  total_value: number;
  holdings_count: number;
  asset_allocation: Record<string, number>;
  sector_allocation: Record<string, number>;
  concentration_risk: number;
  largest_position_weight: number;
}

interface RiskMetrics {
  overall_risk_score: number;
  beta: number;
  volatility: number;
  sharpe_ratio: number;
  max_drawdown: number;
  var_95: number;
  concentration_warnings: string[];
}

interface IncomeAnalysis {
  total_annual_income: number;
  weighted_yield: number;
  dividend_income: number;
  interest_income: number;
  distribution_frequency: Record<string, number>;
  income_reliability_score: number;
}

interface FeeAnalysis {
  weighted_expense_ratio: number;
  total_annual_fees: number;
  advisory_fees?: number;
  high_fee_holdings: PortfolioHolding[];
  fee_optimization_savings: number;
}

interface ReviewStep {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  component: string;
}

const reviewSteps: ReviewStep[] = [
  {
    id: 1,
    title: 'Data Input',
    description: 'Upload statements or enter holdings manually',
    icon: <Upload className="h-5 w-5" />,
    component: 'input'
  },
  {
    id: 2,
    title: 'Portfolio Analysis',
    description: 'Comprehensive analysis of current holdings',
    icon: <BarChart3 className="h-5 w-5" />,
    component: 'analysis'
  },
  {
    id: 3,
    title: 'Model Comparison',
    description: 'Compare against recommended models',
    icon: <Target className="h-5 w-5" />,
    component: 'comparison'
  },
  {
    id: 4,
    title: 'Proposal Generation',
    description: 'Generate advisor-branded proposal',
    icon: <FileText className="h-5 w-5" />,
    component: 'proposal'
  },
  {
    id: 5,
    title: 'Export & Share',
    description: 'Export PDF and share with client',
    icon: <Send className="h-5 w-5" />,
    component: 'export'
  }
];

export const PortfolioReviewGenerator: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [inputMethod, setInputMethod] = useState<'upload' | 'manual'>('upload');
  
  // Core data
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [selectedModels, setSelectedModels] = useState<string[]>([]);
  const [proposalData, setProposalData] = useState<any>(null);
  const [aiInsights, setAiInsights] = useState<string>('');

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setUploadedFiles(prev => [...prev, ...acceptedFiles]);
    toast.success(`${acceptedFiles.length} file(s) uploaded successfully`);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'text/csv': ['.csv'],
      'application/vnd.ms-excel': ['.xls'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'image/*': ['.png', '.jpg', '.jpeg']
    },
    multiple: true
  });

  const processPortfolioData = async () => {
    if (!clientName) {
      toast.error('Please enter client name');
      return;
    }

    if (inputMethod === 'upload' && uploadedFiles.length === 0) {
      toast.error('Please upload at least one file');
      return;
    }

    setIsLoading(true);
    try {
      let portfolioData: Portfolio;

      if (inputMethod === 'upload') {
        // Process uploaded files
        portfolioData = await processUploadedFiles();
      } else {
        // Get manually entered data
        portfolioData = await processManualData();
      }

      setPortfolio(portfolioData);
      setCurrentStep(2);
      toast.success('Portfolio data processed successfully!');
    } catch (error) {
      console.error('Error processing portfolio:', error);
      toast.error('Failed to process portfolio data');
    } finally {
      setIsLoading(false);
    }
  };

  const processUploadedFiles = async (): Promise<Portfolio> => {
    // Upload files and parse using enhanced edge function
    const results = await Promise.all(
      uploadedFiles.map(async (file) => {
        const fileExt = file.name.split('.').pop();
        const fileName = `statements/${user?.id}/${Date.now()}_${file.name}`;
        
        // Upload file
        const { error: uploadError } = await supabase.storage
          .from('proposals')
          .upload(fileName, file);

        if (uploadError) throw uploadError;

        // Process with enhanced parsing
        const { data, error } = await supabase.functions.invoke('portfolio-analyzer', {
          body: {
            file_path: fileName,
            client_name: clientName,
            client_email: clientEmail,
            analysis_type: 'comprehensive'
          }
        });

        if (error) throw error;
        return data;
      })
    );

    // Merge results from multiple files
    return mergePortfolioData(results);
  };

  const processManualData = async (): Promise<Portfolio> => {
    // Get data from manual entry form component
    const manualData = await getManualEntryData();
    
    // Process through portfolio analyzer
    const { data, error } = await supabase.functions.invoke('portfolio-analyzer', {
      body: {
        holdings: manualData.holdings,
        client_name: clientName,
        client_email: clientEmail,
        analysis_type: 'comprehensive'
      }
    });

    if (error) throw error;
    return data;
  };

  const mergePortfolioData = (results: any[]): Portfolio => {
    // Merge multiple portfolio data sources
    const allHoldings = results.flatMap(r => r.holdings || []);
    const totalValue = allHoldings.reduce((sum, h) => sum + h.market_value, 0);
    
    return {
      holdings: allHoldings.map(h => ({
        ...h,
        weight_percent: (h.market_value / totalValue) * 100
      })),
      analysis: calculatePortfolioAnalysis(allHoldings),
      riskMetrics: calculateRiskMetrics(allHoldings),
      incomeAnalysis: calculateIncomeAnalysis(allHoldings),
      feeAnalysis: calculateFeeAnalysis(allHoldings)
    };
  };

  const calculatePortfolioAnalysis = (holdings: PortfolioHolding[]): PortfolioAnalysisData => {
    const totalValue = holdings.reduce((sum, h) => sum + h.market_value, 0);
    
    const assetAllocation = holdings.reduce((acc, h) => {
      acc[h.asset_class] = (acc[h.asset_class] || 0) + h.market_value;
      return acc;
    }, {} as Record<string, number>);

    const sectorAllocation = holdings.reduce((acc, h) => {
      const sector = h.sector || 'Unknown';
      acc[sector] = (acc[sector] || 0) + h.market_value;
      return acc;
    }, {} as Record<string, number>);

    // Convert to percentages
    Object.keys(assetAllocation).forEach(key => {
      assetAllocation[key] = (assetAllocation[key] / totalValue) * 100;
    });
    
    Object.keys(sectorAllocation).forEach(key => {
      sectorAllocation[key] = (sectorAllocation[key] / totalValue) * 100;
    });

    const largestPosition = Math.max(...holdings.map(h => h.market_value));
    const largestPositionWeight = (largestPosition / totalValue) * 100;

    return {
      total_value: totalValue,
      holdings_count: holdings.length,
      asset_allocation: assetAllocation,
      sector_allocation: sectorAllocation,
      concentration_risk: largestPositionWeight > 10 ? largestPositionWeight : 0,
      largest_position_weight: largestPositionWeight
    };
  };

  const calculateRiskMetrics = (holdings: PortfolioHolding[]): RiskMetrics => {
    const totalValue = holdings.reduce((sum, h) => sum + h.market_value, 0);
    const weightedBeta = holdings.reduce((sum, h) => {
      const weight = h.market_value / totalValue;
      return sum + (weight * (h.beta || 1.0));
    }, 0);

    const concentrationWarnings = [];
    const maxPosition = Math.max(...holdings.map(h => h.market_value / totalValue * 100));
    
    if (maxPosition > 20) {
      concentrationWarnings.push(`Largest position represents ${maxPosition.toFixed(1)}% of portfolio`);
    }
    
    const singleSectorExposure = Object.values(
      holdings.reduce((acc, h) => {
        const sector = h.sector || 'Unknown';
        acc[sector] = (acc[sector] || 0) + h.market_value;
        return acc;
      }, {} as Record<string, number>)
    ).some(value => (value / totalValue) > 0.25);
    
    if (singleSectorExposure) {
      concentrationWarnings.push('High concentration in single sector detected');
    }

    return {
      overall_risk_score: Math.min(Math.max(weightedBeta * 50, 1), 100),
      beta: weightedBeta,
      volatility: 0.15, // Mock data - would calculate from historical data
      sharpe_ratio: 0.8, // Mock data
      max_drawdown: 0.12, // Mock data
      var_95: 0.08, // Mock data
      concentration_warnings: concentrationWarnings
    };
  };

  const calculateIncomeAnalysis = (holdings: PortfolioHolding[]): IncomeAnalysis => {
    const totalValue = holdings.reduce((sum, h) => sum + h.market_value, 0);
    const totalAnnualIncome = holdings.reduce((sum, h) => {
      return sum + (h.market_value * (h.dividend_yield || 0) / 100);
    }, 0);

    const weightedYield = holdings.reduce((sum, h) => {
      const weight = h.market_value / totalValue;
      return sum + (weight * (h.dividend_yield || 0));
    }, 0);

    return {
      total_annual_income: totalAnnualIncome,
      weighted_yield: weightedYield,
      dividend_income: totalAnnualIncome * 0.8, // Mock split
      interest_income: totalAnnualIncome * 0.2, // Mock split
      distribution_frequency: {
        'Monthly': 0.2,
        'Quarterly': 0.6,
        'Annual': 0.2
      },
      income_reliability_score: 85 // Mock score
    };
  };

  const calculateFeeAnalysis = (holdings: PortfolioHolding[]): FeeAnalysis => {
    const totalValue = holdings.reduce((sum, h) => sum + h.market_value, 0);
    const weightedExpenseRatio = holdings.reduce((sum, h) => {
      const weight = h.market_value / totalValue;
      return sum + (weight * (h.expense_ratio || 0));
    }, 0);

    const totalAnnualFees = totalValue * (weightedExpenseRatio / 100);
    const highFeeHoldings = holdings.filter(h => (h.expense_ratio || 0) > 1.0);

    return {
      weighted_expense_ratio: weightedExpenseRatio,
      total_annual_fees: totalAnnualFees,
      advisory_fees: totalValue * 0.0125, // 1.25% advisory fee
      high_fee_holdings: highFeeHoldings,
      fee_optimization_savings: highFeeHoldings.reduce((sum, h) => {
        return sum + (h.market_value * 0.005); // Potential 0.5% savings
      }, 0)
    };
  };

  const getManualEntryData = async (): Promise<any> => {
    // This would get data from the ManualEntryForm component
    // For now, return mock data
    return {
      holdings: [
        {
          ticker: 'SPY',
          name: 'SPDR S&P 500 ETF',
          quantity: 100,
          market_value: 45000,
          asset_class: 'equity',
          sector: 'Technology',
          expense_ratio: 0.09,
          dividend_yield: 1.8,
          beta: 1.0
        }
      ]
    };
  };

  const generateAIInsights = async () => {
    if (!portfolio) return;

    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('ai-portfolio-insights', {
        body: {
          portfolio,
          client_name: clientName,
          analysis_depth: 'comprehensive'
        }
      });

      if (error) throw error;
      setAiInsights(data.insights);
    } catch (error) {
      console.error('Error generating AI insights:', error);
      toast.error('Failed to generate AI insights');
    } finally {
      setIsLoading(false);
    }
  };

  const exportProposal = async (format: 'pdf' | 'email') => {
    if (!portfolio || !proposalData) return;

    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('export-proposal', {
        body: {
          proposal_data: proposalData,
          portfolio,
          client_name: clientName,
          client_email: clientEmail,
          format,
          include_ai_insights: aiInsights.length > 0
        }
      });

      if (error) throw error;

      if (format === 'pdf') {
        // Download PDF
        const blob = new Blob([data.pdf_data], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Portfolio_Proposal_${clientName.replace(/\s+/g, '_')}.pdf`;
        a.click();
        URL.revokeObjectURL(url);
        toast.success('Proposal exported successfully');
      } else {
        toast.success('Proposal sent to client via email');
      }
    } catch (error) {
      console.error('Error exporting proposal:', error);
      toast.error('Failed to export proposal');
    } finally {
      setIsLoading(false);
    }
  };

  const progress = (currentStep / reviewSteps.length) * 100;

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="client-name">Client Name *</Label>
                <Input
                  id="client-name"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="Enter client name"
                />
              </div>
              <div>
                <Label htmlFor="client-email">Client Email</Label>
                <Input
                  id="client-email"
                  type="email"
                  value={clientEmail}
                  onChange={(e) => setClientEmail(e.target.value)}
                  placeholder="Enter client email"
                />
              </div>
            </div>

            <Tabs value={inputMethod} onValueChange={(v) => setInputMethod(v as 'upload' | 'manual')}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="upload">Upload Files</TabsTrigger>
                <TabsTrigger value="manual">Manual Entry</TabsTrigger>
              </TabsList>

              <TabsContent value="upload" className="space-y-4">
                <div
                  {...getRootProps()}
                  className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
                    ${isDragActive ? 'border-primary bg-primary/5' : 'border-gray-300 hover:border-gray-400'}`}
                >
                  <input {...getInputProps()} />
                  <Upload className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium">
                      {isDragActive ? 'Drop files here' : 'Drag & drop statements here'}
                    </p>
                    <p className="text-xs text-gray-500">
                      PDF, CSV, Excel, or images supported. Multiple files allowed.
                    </p>
                  </div>
                </div>

                {uploadedFiles.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-medium">Uploaded Files:</h4>
                    {uploadedFiles.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <FileText className="h-4 w-4 text-gray-400" />
                          <div>
                            <p className="text-sm font-medium">{file.name}</p>
                            <p className="text-xs text-gray-500">
                              {(file.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setUploadedFiles(prev => prev.filter((_, i) => i !== index))}
                        >
                          Remove
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="manual">
                <ManualEntryForm />
              </TabsContent>
            </Tabs>

            <Button
              onClick={processPortfolioData}
              disabled={!clientName || isLoading}
              className="w-full"
            >
              {isLoading ? 'Processing...' : 'Analyze Portfolio'}
            </Button>
          </div>
        );

      case 2:
        return portfolio ? (
          <PortfolioAnalysis
            portfolio={portfolio}
            onNext={() => setCurrentStep(3)}
            onBack={() => setCurrentStep(1)}
          />
        ) : null;

      case 3:
        return portfolio ? (
          <ModelComparison
            portfolio={portfolio}
            selectedModels={selectedModels}
            onModelsChange={setSelectedModels}
            onNext={() => setCurrentStep(4)}
            onBack={() => setCurrentStep(2)}
          />
        ) : null;

      case 4:
        return portfolio ? (
          <ProposalPreview
            portfolio={portfolio}
            selectedModels={selectedModels}
            clientName={clientName}
            onProposalGenerated={setProposalData}
            onNext={() => setCurrentStep(5)}
            onBack={() => setCurrentStep(3)}
            onGenerateAI={generateAIInsights}
            aiInsights={aiInsights}
          />
        ) : null;

      case 5:
        return (
          <div className="space-y-6">
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-medium text-green-900">Proposal Ready</h3>
              <p className="text-sm text-green-700">
                Your advisor-grade proposal is ready for export and sharing.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Button
                onClick={() => exportProposal('pdf')}
                disabled={isLoading}
                className="flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Export PDF
              </Button>
              <Button
                onClick={() => exportProposal('email')}
                disabled={isLoading || !clientEmail}
                variant="outline"
                className="flex items-center gap-2"
              >
                <Send className="h-4 w-4" />
                Send to Client
              </Button>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setCurrentStep(4)}>
                Back to Preview
              </Button>
              <Button onClick={() => navigate('/advisor/proposals')} className="flex-1">
                Complete & Return to Proposals
              </Button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Portfolio Review Generator</h1>
        <p className="text-gray-600 mt-2">
          Create comprehensive, advisor-grade portfolio proposals with advanced analytics
        </p>
      </div>

      {/* Progress Indicator */}
      <div className="mb-8">
        <Progress value={progress} className="h-2" />
        <div className="flex justify-between mt-4">
          {reviewSteps.map((step) => (
            <div
              key={step.id}
              className={`flex items-center space-x-2 ${
                step.id <= currentStep ? 'text-primary' : 'text-gray-400'
              }`}
            >
              <div
                className={`p-2 rounded-full ${
                  step.id <= currentStep ? 'bg-primary text-white' : 'bg-gray-200'
                }`}
              >
                {step.icon}
              </div>
              <div className="hidden lg:block">
                <p className="text-sm font-medium">{step.title}</p>
                <p className="text-xs">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Current Step Content */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            {reviewSteps[currentStep - 1].icon}
            Step {currentStep}: {reviewSteps[currentStep - 1].title}
          </CardTitle>
          <CardDescription>
            {reviewSteps[currentStep - 1].description}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {renderStepContent()}
        </CardContent>
      </Card>
    </div>
  );
};