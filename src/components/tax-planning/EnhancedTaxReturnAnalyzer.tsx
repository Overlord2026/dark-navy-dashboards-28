import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, FileText, Loader2, CheckCircle, AlertTriangle, Crown, Edit2, Info } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useSubscriptionAccess } from '@/hooks/useSubscriptionAccess';
import { UpgradePaywall } from '@/components/subscription/UpgradePaywall';
import { InAppNotificationBanner } from '@/components/ui/InAppNotificationBanner';
import { supabase } from '@/integrations/supabase/client';

interface ExtractedTaxData {
  agi: number;
  filingStatus: string;
  totalTax: number;
  federalWithheld: number;
  age1: number;
  age2?: number;
  standardDeduction?: number;
  itemizedDeductions?: number;
  stateAndLocalTax?: number;
  mortgageInterest?: number;
  charitableContributions?: number;
  medicalExpenses?: number;
  confidenceScore: number;
}

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
  const [extractedData, setExtractedData] = useState<ExtractedTaxData | null>(null);
  const [showReviewScreen, setShowReviewScreen] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  
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

  const extractDataFromOCR = (text: string): ExtractedTaxData => {
    // Parse OCR text and extract tax data with confidence scoring
    const agi = parseFloat(text.match(/AGI[:\s]*\$?([\d,]+)/i)?.[1]?.replace(/,/g, '') || '0');
    const filingStatus = text.match(/Filing Status[:\s]*(.*?)(?:\n|$)/i)?.[1]?.trim() || 'Single';
    const totalTax = parseFloat(text.match(/Total Tax[:\s]*\$?([\d,]+)/i)?.[1]?.replace(/,/g, '') || '0');
    const federalWithheld = parseFloat(text.match(/Federal Income Tax Withheld[:\s]*\$?([\d,]+)/i)?.[1]?.replace(/,/g, '') || '0');
    
    // Extract ages (assume primary taxpayer and spouse)
    const ageMatch = text.match(/Age[:\s]*(\d+)/i);
    const age1 = ageMatch ? parseInt(ageMatch[1]) : 45;
    const age2 = filingStatus.toLowerCase().includes('married') ? 42 : undefined;
    
    // Extract deductions
    const medicalExpenses = parseFloat(text.match(/Medical Expenses[:\s]*\$?([\d,]+)/i)?.[1]?.replace(/,/g, '') || '0');
    const stateAndLocalTax = parseFloat(text.match(/State and Local Taxes[:\s]*\$?([\d,]+)/i)?.[1]?.replace(/,/g, '') || '0');
    const mortgageInterest = parseFloat(text.match(/Mortgage Interest[:\s]*\$?([\d,]+)/i)?.[1]?.replace(/,/g, '') || '0');
    const charitableContributions = parseFloat(text.match(/Charitable Contributions[:\s]*\$?([\d,]+)/i)?.[1]?.replace(/,/g, '') || '0');
    
    const itemizedDeductions = medicalExpenses + stateAndLocalTax + mortgageInterest + charitableContributions;
    
    // Calculate confidence based on data found
    const fieldsFound = [agi, totalTax, federalWithheld].filter(x => x > 0).length;
    const confidenceScore = Math.min(0.95, 0.6 + (fieldsFound * 0.1));
    
    return {
      agi,
      filingStatus,
      totalTax,
      federalWithheld,
      age1,
      age2,
      itemizedDeductions: itemizedDeductions > 0 ? itemizedDeductions : undefined,
      medicalExpenses: medicalExpenses > 0 ? medicalExpenses : undefined,
      stateAndLocalTax: stateAndLocalTax > 0 ? stateAndLocalTax : undefined,
      mortgageInterest: mortgageInterest > 0 ? mortgageInterest : undefined,
      charitableContributions: charitableContributions > 0 ? charitableContributions : undefined,
      confidenceScore
    };
  };

  const simulateFileUpload = async (file: File): Promise<{ text: string; data: ExtractedTaxData }> => {
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
Age: 45
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
            
            const extractedData = extractDataFromOCR(mockExtractedText);
            resolve({ text: mockExtractedText, data: extractedData });
            return 100;
          }
          return prev + 10;
        });
      }, 200);
    });
  };

  const processUploadedFile = async () => {
    if (!selectedFile || !hasBasicAccess) return;

    try {
      setIsAnalyzing(true);
      
      // Extract text and data from document
      const { text, data } = await simulateFileUpload(selectedFile);
      setExtractedText(text);
      setExtractedData(data);
      
      // Show notification and review screen
      setShowNotification(true);
      setShowReviewScreen(true);

      toast({
        title: "Document Processed",
        description: "Tax information extracted successfully. Please review the fields below.",
      });

    } catch (error) {
      console.error('Processing error:', error);
      toast({
        title: "Processing Failed",
        description: "There was an error processing your tax document",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
      setUploadProgress(0);
    }
  };

  const performAnalysis = async () => {
    if (!extractedData || !hasBasicAccess) return;

    try {
      setIsAnalyzing(true);
      
      // Determine analysis type based on subscription
      const analysisType = hasAIAccess ? 'ai_powered' : 'basic';

      // Call the AI analysis edge function with extracted data
      const { data, error } = await supabase.functions.invoke('ai-tax-analysis', {
        body: {
          document_text: extractedText,
          extracted_data: extractedData,
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
      setShowReviewScreen(false);
      
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
        {/* Notification Banner */}
        {showNotification && extractedData && (
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4 mb-6 relative animate-fade-in">
            <div className="flex items-start gap-3">
              <Info className="h-5 w-5 text-blue-600 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-semibold text-blue-900 text-sm mb-1">
                  We've pre-filled your info—review or adjust before analyzing!
                </h3>
                <p className="text-blue-700 text-sm">
                  Extracted {Object.keys(extractedData).filter(key => extractedData[key as keyof ExtractedTaxData] !== undefined).length} fields with {Math.round(extractedData.confidenceScore * 100)}% confidence.
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowNotification(false)}
                className="h-6 w-6 p-0 hover:bg-blue-100"
              >
                ×
              </Button>
            </div>
          </div>
        )}

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
                onClick={processUploadedFile}
                disabled={isAnalyzing || usageStatus.isAtLimit}
                className="min-w-[120px]"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  'Process Document'
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

        {/* Review & Confirm Fields Screen */}
        {showReviewScreen && extractedData && (
          <div className="space-y-6 border border-primary/20 rounded-lg p-6 bg-gradient-to-br from-background to-muted/30 animate-scale-in">
            <div className="flex items-center gap-2">
              <Edit2 className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold">Review & Confirm Fields</h3>
              <Badge variant="outline">
                Confidence: {Math.round(extractedData.confidenceScore * 100)}%
              </Badge>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Basic Information */}
              <div className="space-y-4">
                <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">Basic Information</h4>
                
                <div className="space-y-2">
                  <Label htmlFor="agi">Adjusted Gross Income (AGI)</Label>
                  <Input
                    id="agi"
                    type="number"
                    value={extractedData.agi}
                    onChange={(e) => setExtractedData({...extractedData, agi: parseFloat(e.target.value) || 0})}
                    className="bg-yellow-50 border-yellow-200"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="filing-status">Filing Status</Label>
                  <Input
                    id="filing-status"
                    value={extractedData.filingStatus}
                    onChange={(e) => setExtractedData({...extractedData, filingStatus: e.target.value})}
                    className="bg-yellow-50 border-yellow-200"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-2">
                    <Label htmlFor="age1">Primary Age</Label>
                    <Input
                      id="age1"
                      type="number"
                      value={extractedData.age1}
                      onChange={(e) => setExtractedData({...extractedData, age1: parseInt(e.target.value) || 0})}
                      className="bg-yellow-50 border-yellow-200"
                    />
                  </div>
                  {extractedData.age2 && (
                    <div className="space-y-2">
                      <Label htmlFor="age2">Spouse Age</Label>
                      <Input
                        id="age2"
                        type="number"
                        value={extractedData.age2}
                        onChange={(e) => setExtractedData({...extractedData, age2: parseInt(e.target.value) || undefined})}
                        className="bg-yellow-50 border-yellow-200"
                      />
                    </div>
                  )}
                </div>
              </div>
              
              {/* Tax Details */}
              <div className="space-y-4">
                <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">Tax Details</h4>
                
                <div className="space-y-2">
                  <Label htmlFor="total-tax">Total Tax</Label>
                  <Input
                    id="total-tax"
                    type="number"
                    value={extractedData.totalTax}
                    onChange={(e) => setExtractedData({...extractedData, totalTax: parseFloat(e.target.value) || 0})}
                    className="bg-yellow-50 border-yellow-200"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="federal-withheld">Federal Tax Withheld</Label>
                  <Input
                    id="federal-withheld"
                    type="number"
                    value={extractedData.federalWithheld}
                    onChange={(e) => setExtractedData({...extractedData, federalWithheld: parseFloat(e.target.value) || 0})}
                    className="bg-yellow-50 border-yellow-200"
                  />
                </div>
                
                {extractedData.itemizedDeductions && (
                  <div className="space-y-2">
                    <Label htmlFor="itemized-deductions">Itemized Deductions</Label>
                    <Input
                      id="itemized-deductions"
                      type="number"
                      value={extractedData.itemizedDeductions}
                      onChange={(e) => setExtractedData({...extractedData, itemizedDeductions: parseFloat(e.target.value) || undefined})}
                      className="bg-yellow-50 border-yellow-200"
                    />
                  </div>
                )}
              </div>
            </div>
            
            {/* Deduction Details */}
            {(extractedData.medicalExpenses || extractedData.stateAndLocalTax || extractedData.mortgageInterest || extractedData.charitableContributions) && (
              <div className="space-y-4">
                <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">Deduction Breakdown</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {extractedData.medicalExpenses && (
                    <div className="space-y-2">
                      <Label htmlFor="medical">Medical Expenses</Label>
                      <Input
                        id="medical"
                        type="number"
                        value={extractedData.medicalExpenses}
                        onChange={(e) => setExtractedData({...extractedData, medicalExpenses: parseFloat(e.target.value) || undefined})}
                        className="bg-yellow-50 border-yellow-200"
                      />
                    </div>
                  )}
                  {extractedData.stateAndLocalTax && (
                    <div className="space-y-2">
                      <Label htmlFor="salt">State & Local Tax</Label>
                      <Input
                        id="salt"
                        type="number"
                        value={extractedData.stateAndLocalTax}
                        onChange={(e) => setExtractedData({...extractedData, stateAndLocalTax: parseFloat(e.target.value) || undefined})}
                        className="bg-yellow-50 border-yellow-200"
                      />
                    </div>
                  )}
                  {extractedData.mortgageInterest && (
                    <div className="space-y-2">
                      <Label htmlFor="mortgage">Mortgage Interest</Label>
                      <Input
                        id="mortgage"
                        type="number"
                        value={extractedData.mortgageInterest}
                        onChange={(e) => setExtractedData({...extractedData, mortgageInterest: parseFloat(e.target.value) || undefined})}
                        className="bg-yellow-50 border-yellow-200"
                      />
                    </div>
                  )}
                  {extractedData.charitableContributions && (
                    <div className="space-y-2">
                      <Label htmlFor="charity">Charitable Contributions</Label>
                      <Input
                        id="charity"
                        type="number"
                        value={extractedData.charitableContributions}
                        onChange={(e) => setExtractedData({...extractedData, charitableContributions: parseFloat(e.target.value) || undefined})}
                        className="bg-yellow-50 border-yellow-200"
                      />
                    </div>
                  )}
                </div>
              </div>
            )}
            
            <div className="flex gap-3 pt-4">
              <Button
                onClick={performAnalysis}
                disabled={isAnalyzing}
                className="flex-1"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  'Run Analysis'
                )}
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowReviewScreen(false)}
                disabled={isAnalyzing}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}

        {/* Extracted Text Preview */}
        {extractedText && !showReviewScreen && (
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