import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Upload, FileText, Loader2, CheckCircle, AlertTriangle, Crown } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useSubscriptionAccess } from '@/hooks/useSubscriptionAccess';
import { UpgradePaywall } from '@/components/subscription/UpgradePaywall';
import { supabase } from '@/integrations/supabase/client';

interface TaxAnalysisResult {
  summary: string;
  optimization_opportunities: string[];
  missed_deductions: string[];
  estimated_liability: string;
  next_year_planning: string[];
  risk_factors: string[];
  compliance_notes: string[];
  confidence_score: number;
  upgrade_message?: string;
}

interface AnalysisResponse {
  success: boolean;
  analysis: TaxAnalysisResult;
  usage_info: {
    current_usage: number;
    limit: number;
    remaining: number;
  };
  subscription_info: {
    tier: string;
    has_ai_access: boolean;
    analysis_type_used: string;
  };
}

export function EnhancedTaxReturnAnalyzer() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResponse | null>(null);
  const [extractedText, setExtractedText] = useState<string>('');
  const [uploadProgress, setUploadProgress] = useState(0);
  
  const { toast } = useToast();
  const { subscriptionPlan, checkFeatureAccess, checkUsageLimit, incrementUsage } = useSubscriptionAccess();

  // Check access permissions
  const hasTaxAccess = checkFeatureAccess('premium');
  const usageStatus = { hasAccess: true, remaining: 999, isAtLimit: false };
  const hasBasicAccess = subscriptionPlan?.tier && ['basic', 'premium', 'elite'].includes(subscriptionPlan.tier);
  const hasAIAccess = subscriptionPlan?.tier && ['premium', 'elite'].includes(subscriptionPlan.tier);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type and size
      const validTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
      const maxSize = 10 * 1024 * 1024; // 10MB

      if (!validTypes.includes(file.type)) {
        toast({
          title: "Invalid File Type",
          description: "Please upload a PDF or image file (JPG, PNG)",
          variant: "destructive",
        });
        return;
      }

      if (file.size > maxSize) {
        toast({
          title: "File Too Large",
          description: "Please upload a file smaller than 10MB",
          variant: "destructive",
        });
        return;
      }

      setSelectedFile(file);
      setAnalysisResult(null);
      setExtractedText('');
    }
  };

  const simulateFileUpload = async (file: File): Promise<string> => {
    // Simulate file processing and OCR extraction
    setUploadProgress(0);
    
    return new Promise((resolve) => {
      const interval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            // Simulate extracted text based on file type
            const mockExtractedText = `Form 1040 - U.S. Individual Income Tax Return
Tax Year: 2023
Taxpayer: John Doe
Filing Status: Married Filing Jointly
AGI: $125,000
Total Tax: $18,450
Federal Income Tax Withheld: $19,200
Refund Due: $750

Schedule A - Itemized Deductions:
Medical Expenses: $3,200
State and Local Taxes: $10,000
Mortgage Interest: $12,500
Charitable Contributions: $4,800

Schedule B - Interest and Dividends:
Interest Income: $2,400
Dividend Income: $3,800

Schedule D - Capital Gains:
Short-term Gains: $1,200
Long-term Gains: $5,500`;
            
            resolve(mockExtractedText);
            return 100;
          }
          return prev + 10;
        });
      }, 200);
    });
  };

  const performAnalysis = async () => {
    if (!selectedFile || !hasBasicAccess) return;

    try {
      setIsAnalyzing(true);
      
      // Extract text from document
      const documentText = await simulateFileUpload(selectedFile);
      setExtractedText(documentText);

      // Determine analysis type based on subscription
      const analysisType = hasAIAccess ? 'ai_powered' : 'basic';

      // Call the AI analysis edge function
      const { data, error } = await supabase.functions.invoke('ai-tax-analysis', {
        body: {
          document_text: documentText,
          analysis_type: analysisType,
          tax_year: 2023
        }
      });

      if (error) throw error;

      if (data.upgrade_required) {
        toast({
          title: "Upgrade Required",
          description: data.error,
          variant: "destructive",
        });
        return;
      }

      if (data.usage_limit_reached) {
        toast({
          title: "Usage Limit Reached",
          description: `You've used ${data.current_usage}/${data.limit} analyses this month`,
          variant: "destructive",
        });
        return;
      }

      setAnalysisResult(data);
      
      // Increment local usage counter
      await incrementUsage('tax_analyses');

      toast({
        title: "Analysis Complete",
        description: `${analysisType === 'ai_powered' ? 'AI-powered' : 'Basic'} analysis completed successfully`,
      });

    } catch (error) {
      console.error('Analysis error:', error);
      toast({
        title: "Analysis Failed",
        description: "There was an error analyzing your tax document",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
      setUploadProgress(0);
    }
  };

  // Show upgrade paywall if no access
  if (!hasBasicAccess) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Tax Return Analyzer
            <Badge variant="secondary">Premium</Badge>
          </CardTitle>
          <CardDescription>
            Upload and analyze your tax returns with AI-powered insights
          </CardDescription>
        </CardHeader>
        <CardContent>
          <UpgradePaywall
            promptData={{
              feature_name: "Tax Return Analysis",
              required_tier: "basic",
              add_on_required: "tax_access"
            }}
          />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Tax Return Analyzer
          {hasAIAccess && <Crown className="h-4 w-4 text-yellow-500" />}
          <Badge variant={hasAIAccess ? "default" : "secondary"}>
            {hasAIAccess ? "AI-Powered" : "Basic"}
          </Badge>
        </CardTitle>
        <CardDescription>
          Upload your tax documents for {hasAIAccess ? 'AI-powered' : 'basic'} analysis and optimization insights
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Usage Status */}
        <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
          <div className="text-sm">
            <span className="font-medium">Usage this month:</span>
            <span className="ml-2">
              {usageStatus.remaining === -1 
                ? 'Unlimited' 
                : `${subscriptionPlan?.usage_counters.tax_analyses || 0}/${subscriptionPlan?.usage_limits.tax_analyses_limit || 0}`
              }
            </span>
          </div>
          {!hasAIAccess && (
            <Button variant="outline" size="sm">
              Upgrade for AI Analysis
            </Button>
          )}
        </div>

        {/* File Upload */}
        <div className="space-y-4">
          <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
            <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Upload Tax Document</h3>
              <p className="text-sm text-muted-foreground">
                PDF, JPG, PNG files up to 10MB
              </p>
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleFileSelect}
                className="hidden"
                id="tax-document-upload"
              />
              <label htmlFor="tax-document-upload">
                <Button variant="outline" asChild>
                  <span>Choose File</span>
                </Button>
              </label>
            </div>
          </div>

          {selectedFile && (
            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
              <FileText className="h-5 w-5 text-primary" />
              <div className="flex-1">
                <p className="font-medium">{selectedFile.name}</p>
                <p className="text-sm text-muted-foreground">
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
              <Button
                onClick={performAnalysis}
                disabled={isAnalyzing || usageStatus.isAtLimit}
                className="min-w-[120px]"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  'Analyze Document'
                )}
              </Button>
            </div>
          )}

          {/* Upload Progress */}
          {uploadProgress > 0 && uploadProgress < 100 && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Processing document...</span>
                <span>{uploadProgress}%</span>
              </div>
              <Progress value={uploadProgress} />
            </div>
          )}
        </div>

        {/* Extracted Text Preview */}
        {extractedText && (
          <div className="space-y-2">
            <h4 className="font-medium">Extracted Information</h4>
            <div className="bg-muted p-4 rounded-lg text-sm font-mono max-h-40 overflow-y-auto">
              {extractedText.split('\n').slice(0, 10).join('\n')}
              {extractedText.split('\n').length > 10 && '\n...'}
            </div>
          </div>
        )}

        {/* Analysis Results */}
        {analysisResult && (
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <h3 className="text-lg font-semibold">Analysis Complete</h3>
              <Badge variant="outline">
                Confidence: {Math.round((analysisResult.analysis.confidence_score || 0.5) * 100)}%
              </Badge>
            </div>

            {/* Summary */}
            <div className="space-y-2">
              <h4 className="font-medium">Summary</h4>
              <p className="text-muted-foreground">{analysisResult.analysis.summary}</p>
            </div>

            {/* Optimization Opportunities */}
            {analysisResult.analysis.optimization_opportunities.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-medium">Tax Optimization Opportunities</h4>
                <ul className="space-y-1">
                  {analysisResult.analysis.optimization_opportunities.map((opportunity, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <span className="text-green-500 mt-1">•</span>
                      {opportunity}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Missed Deductions */}
            {analysisResult.analysis.missed_deductions.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-medium">Potential Missed Deductions</h4>
                <ul className="space-y-1">
                  {analysisResult.analysis.missed_deductions.map((deduction, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <span className="text-blue-500 mt-1">•</span>
                      {deduction}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Risk Factors */}
            {analysisResult.analysis.risk_factors.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-medium flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-orange-500" />
                  Risk Factors
                </h4>
                <ul className="space-y-1">
                  {analysisResult.analysis.risk_factors.map((risk, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <span className="text-orange-500 mt-1">•</span>
                      {risk}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Upgrade Message for Basic Users */}
            {analysisResult.analysis.upgrade_message && (
              <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">{analysisResult.analysis.upgrade_message}</p>
                <Button variant="outline" size="sm" className="mt-2">
                  Upgrade to Premium
                </Button>
              </div>
            )}

            {/* Usage Information */}
            <div className="text-xs text-muted-foreground">
              Analysis completed using {analysisResult.subscription_info.analysis_type_used} method. 
              Remaining analyses: {
                analysisResult.usage_info.remaining === -1 
                  ? 'Unlimited' 
                  : analysisResult.usage_info.remaining
              }
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}