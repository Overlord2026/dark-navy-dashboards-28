import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Upload, FileText, Brain, Eye, Download, Crown, Camera, Scan } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { useToast } from '@/hooks/use-toast';
import { analytics } from '@/lib/analytics';
import { supabase } from '@/integrations/supabase/client';

interface TaxDocument {
  id: string;
  filename: string;
  type: string;
  size: number;
  uploadedAt: Date;
  analysisStatus: 'pending' | 'processing' | 'completed' | 'error';
  extractedData?: any;
}

interface TaxAnalysisResult {
  totalIncome: number;
  totalDeductions: number;
  effectiveTaxRate: number;
  marginalTaxRate: number;
  refundAmount: number;
  recommendations: string[];
  planningOpportunities: string[];
}

const TaxReturnAnalyzer: React.FC<{ subscriptionTier: string }> = ({ subscriptionTier }) => {
  const [uploadedDocuments, setUploadedDocuments] = useState<TaxDocument[]>([]);
  const [analysisResults, setAnalysisResults] = useState<TaxAnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear() - 1);
  const { toast } = useToast();

  const isPremium = subscriptionTier === 'premium';
  const isBasic = subscriptionTier === 'basic' || isPremium;

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (!isBasic) {
      toast({
        title: "Premium Feature",
        description: "Tax return upload and analysis requires Basic subscription or higher.",
        variant: "destructive"
      });
      return;
    }

    for (const file of acceptedFiles) {
      const newDoc: TaxDocument = {
        id: crypto.randomUUID(),
        filename: file.name,
        type: file.type,
        size: file.size,
        uploadedAt: new Date(),
        analysisStatus: 'pending'
      };

      setUploadedDocuments(prev => [...prev, newDoc]);

      // Upload to Supabase Storage
      try {
        const fileExt = file.name.split('.').pop();
        const fileName = `${newDoc.id}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('tax-documents')
          .upload(fileName, file);

        if (uploadError) throw uploadError;

        // Trigger AI analysis for Premium users
        if (isPremium) {
          await analyzeDocument(newDoc.id, fileName);
        }

        analytics.track('tax_document_uploaded', {
          subscription_tier: subscriptionTier,
          file_type: file.type,
          file_size: file.size,
          year: selectedYear
        });

      } catch (error) {
        toast({
          title: "Upload failed",
          description: "Failed to upload tax document. Please try again.",
          variant: "destructive"
        });
        
        setUploadedDocuments(prev => prev.filter(doc => doc.id !== newDoc.id));
      }
    }
  }, [isBasic, isPremium, selectedYear]);

  const analyzeDocument = async (documentId: string, fileName: string) => {
    if (!isPremium) {
      toast({
        title: "Premium Feature",
        description: "AI-powered tax analysis requires Premium subscription.",
        variant: "destructive"
      });
      return;
    }

    setIsAnalyzing(true);
    
    try {
      // Update document status
      setUploadedDocuments(prev => 
        prev.map(doc => 
          doc.id === documentId 
            ? { ...doc, analysisStatus: 'processing' }
            : doc
        )
      );

      // Call AI analysis edge function
      const { data, error } = await supabase.functions.invoke('tax-document-analysis', {
        body: { documentId, fileName, year: selectedYear }
      });

      if (error) throw error;

      // Update document with analysis results
      setUploadedDocuments(prev => 
        prev.map(doc => 
          doc.id === documentId 
            ? { 
                ...doc, 
                analysisStatus: 'completed',
                extractedData: data.extractedData
              }
            : doc
        )
      );

      // Generate comprehensive analysis
      if (data.extractedData) {
        const analysisResult: TaxAnalysisResult = {
          totalIncome: data.extractedData.totalIncome || 0,
          totalDeductions: data.extractedData.totalDeductions || 0,
          effectiveTaxRate: data.extractedData.effectiveTaxRate || 0,
          marginalTaxRate: data.extractedData.marginalTaxRate || 0,
          refundAmount: data.extractedData.refundAmount || 0,
          recommendations: data.recommendations || [],
          planningOpportunities: data.planningOpportunities || []
        };
        
        setAnalysisResults(analysisResult);
      }

      analytics.track('tax_document_analyzed', {
        subscription_tier: subscriptionTier,
        document_id: documentId,
        analysis_success: true
      });

    } catch (error) {
      console.error('Analysis error:', error);
      
      setUploadedDocuments(prev => 
        prev.map(doc => 
          doc.id === documentId 
            ? { ...doc, analysisStatus: 'error' }
            : doc
        )
      );

      toast({
        title: "Analysis failed",
        description: "Failed to analyze tax document. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png']
    },
    multiple: true
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-primary" />
          Tax Return Analyzer
          {isPremium && <Crown className="h-4 w-4 text-yellow-500" />}
        </CardTitle>
        <CardDescription>
          Upload and analyze your tax returns with AI-powered insights
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="upload" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="upload">Upload</TabsTrigger>
            <TabsTrigger value="analysis" disabled={!analysisResults}>Analysis</TabsTrigger>
            <TabsTrigger value="multi-year" disabled={!isPremium}>
              Multi-Year {!isPremium && <Crown className="h-3 w-3 ml-1" />}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="space-y-4">
            <div className="flex items-center gap-4 mb-4">
              <Label htmlFor="year">Tax Year</Label>
              <select 
                id="year"
                value={selectedYear}
                onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                className="border rounded px-3 py-1"
              >
                {Array.from({ length: 5 }, (_, i) => {
                  const year = new Date().getFullYear() - i;
                  return (
                    <option key={year} value={year}>{year}</option>
                  );
                })}
              </select>
            </div>

            {!isBasic ? (
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border text-center">
                <Upload className="h-12 w-12 text-blue-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Upload Tax Documents</h3>
                <p className="text-muted-foreground mb-4">
                  Upload your tax returns for secure analysis and insights.
                </p>
                <Button>Upgrade to Basic</Button>
              </div>
            ) : (
              <>
                <div
                  {...getRootProps()}
                  className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                    isDragActive ? 'border-primary bg-primary/5' : 'border-gray-300 hover:border-primary'
                  }`}
                >
                  <input {...getInputProps()} />
                  <div className="flex flex-col items-center gap-4">
                    {isPremium ? (
                      <Brain className="h-12 w-12 text-primary" />
                    ) : (
                      <Upload className="h-12 w-12 text-primary" />
                    )}
                    <div>
                      <p className="text-lg font-medium">
                        {isDragActive ? 'Drop files here' : 'Drag & drop tax documents'}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        or click to browse • PDF, JPG, PNG supported
                      </p>
                      {isPremium && (
                        <p className="text-sm text-yellow-600 font-medium mt-2">
                          ✨ AI analysis included with Premium
                        </p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Camera className="h-4 w-4 mr-2" />
                        Take Photo
                      </Button>
                      <Button variant="outline" size="sm">
                        <Scan className="h-4 w-4 mr-2" />
                        Scan Document
                      </Button>
                    </div>
                  </div>
                </div>

                {uploadedDocuments.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="font-medium">Uploaded Documents</h4>
                    {uploadedDocuments.map((doc) => (
                      <div key={doc.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <FileText className="h-5 w-5 text-blue-500" />
                          <div>
                            <p className="font-medium">{doc.filename}</p>
                            <p className="text-sm text-muted-foreground">
                              {formatFileSize(doc.size)} • {doc.uploadedAt.toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={
                            doc.analysisStatus === 'completed' ? 'default' :
                            doc.analysisStatus === 'processing' ? 'secondary' :
                            doc.analysisStatus === 'error' ? 'destructive' : 'outline'
                          }>
                            {doc.analysisStatus}
                          </Badge>
                          {isPremium && doc.analysisStatus === 'pending' && (
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => analyzeDocument(doc.id, doc.filename)}
                            >
                              <Brain className="h-4 w-4 mr-1" />
                              Analyze
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </TabsContent>

          <TabsContent value="analysis" className="space-y-4">
            {analysisResults && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground">Total Income</p>
                        <p className="text-2xl font-bold text-green-600">
                          {formatCurrency(analysisResults.totalIncome)}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground">Total Deductions</p>
                        <p className="text-2xl font-bold text-blue-600">
                          {formatCurrency(analysisResults.totalDeductions)}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground">Effective Tax Rate</p>
                        <p className="text-2xl font-bold text-purple-600">
                          {analysisResults.effectiveTaxRate.toFixed(1)}%
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground">Refund Amount</p>
                        <p className="text-2xl font-bold text-orange-600">
                          {formatCurrency(analysisResults.refundAmount)}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Recommendations</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {analysisResults.recommendations.map((rec, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                            <span className="text-sm">{rec}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Planning Opportunities</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {analysisResults.planningOpportunities.map((opp, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                            <span className="text-sm">{opp}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </div>

                <div className="flex gap-3">
                  <Button className="flex items-center gap-2">
                    <Download className="h-4 w-4" />
                    Download Report
                  </Button>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Eye className="h-4 w-4" />
                    Schedule Review
                  </Button>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="multi-year" className="space-y-4">
            {!isPremium ? (
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-6 rounded-lg border text-center">
                <Crown className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Premium Feature</h3>
                <p className="text-muted-foreground mb-4">
                  Compare tax returns across multiple years and track trends with Premium access.
                </p>
                <Button>Upgrade to Premium</Button>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Analyze trends across multiple tax years and identify long-term planning opportunities.
                </p>
                {/* Multi-year analysis would go here */}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default TaxReturnAnalyzer;