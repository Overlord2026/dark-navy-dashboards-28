import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, FileText, Brain, AlertTriangle, TrendingUp, Shield, DollarSign, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AnalysisResult {
  score: number;
  fees: {
    total: string;
    breakdown: { name: string; amount: string }[];
    comparison: string;
  };
  features: {
    pros: string[];
    cons: string[];
    missing: string[];
  };
  recommendations: string[];
  fiduciaryAssessment: {
    score: number;
    issues: string[];
    improvements: string[];
  };
}

export const ContractAnalyzer = () => {
  const { toast } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [manualEntry, setManualEntry] = useState({
    productName: "",
    carrier: "",
    annualFee: "",
    surrenderPeriod: "",
    currentValue: "",
    features: ""
  });
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [activeTab, setActiveTab] = useState("upload");

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      toast({
        title: "File uploaded",
        description: `${selectedFile.name} ready for analysis`,
      });
    }
  };

  const analyzeContract = async () => {
    setAnalyzing(true);
    
    // Simulate AI analysis
    setTimeout(() => {
      const mockResult: AnalysisResult = {
        score: 65,
        fees: {
          total: "2.15%",
          breakdown: [
            { name: "Management Fee", amount: "1.25%" },
            { name: "Mortality & Expense", amount: "0.65%" },
            { name: "Administrative Fee", amount: "0.25%" }
          ],
          comparison: "Higher than 78% of similar products"
        },
        features: {
          pros: [
            "Guaranteed minimum income benefit",
            "Death benefit protection",
            "Tax-deferred growth"
          ],
          cons: [
            "High annual fees",
            "Long surrender period (8 years)",
            "Limited investment options"
          ],
          missing: [
            "Inflation protection rider",
            "Long-term care benefits",
            "Flexible withdrawal options"
          ]
        },
        recommendations: [
          "Consider negotiating fees with your advisor",
          "Evaluate if the guaranteed income benefit justifies the high costs",
          "Compare with commission-free alternatives",
          "Review surrender schedule before making changes"
        ],
        fiduciaryAssessment: {
          score: 58,
          issues: [
            "High commission structure may create advisor conflicts",
            "Fees above industry average for similar guarantees",
            "Limited transparency in fee disclosure"
          ],
          improvements: [
            "Seek fee-only advisor review",
            "Request detailed fee breakdown",
            "Compare with fiduciary-friendly alternatives"
          ]
        }
      };
      
      setResult(mockResult);
      setAnalyzing(false);
      toast({
        title: "Analysis complete",
        description: "Your annuity contract has been analyzed",
      });
    }, 3000);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreBadge = (score: number) => {
    if (score >= 80) return { label: "Excellent", color: "bg-green-500" };
    if (score >= 60) return { label: "Good", color: "bg-yellow-500" };
    return { label: "Needs Review", color: "bg-red-500" };
  };

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">AI Contract Analyzer</h1>
        <p className="text-muted-foreground">
          Upload your annuity contract or enter details manually for AI-powered analysis and recommendations
        </p>
      </div>

      {!result ? (
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="upload">Upload Contract</TabsTrigger>
            <TabsTrigger value="manual">Manual Entry</TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Upload className="h-6 w-6 text-primary" />
                  <div>
                    <CardTitle>Upload Your Contract</CardTitle>
                    <CardDescription>
                      Upload your annuity contract (PDF, DOCX, or image) for AI analysis
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center hover:border-primary/50 transition-colors">
                  <input
                    type="file"
                    accept=".pdf,.docx,.jpg,.jpeg,.png"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="contract-upload"
                  />
                  <label htmlFor="contract-upload" className="cursor-pointer">
                    <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">
                      {file ? file.name : "Drop your contract here or click to browse"}
                    </h3>
                    <p className="text-muted-foreground">
                      Supports PDF, DOCX, JPG, PNG (max 10MB)
                    </p>
                  </label>
                </div>

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Shield className="h-4 w-4" />
                  Your documents are processed securely and never stored
                </div>

                {file && (
                  <Button onClick={analyzeContract} disabled={analyzing} className="w-full">
                    {analyzing ? (
                      <>
                        <Brain className="h-4 w-4 mr-2 animate-pulse" />
                        Analyzing Contract...
                      </>
                    ) : (
                      <>
                        <Brain className="h-4 w-4 mr-2" />
                        Analyze Contract
                      </>
                    )}
                  </Button>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="manual" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <FileText className="h-6 w-6 text-primary" />
                  <div>
                    <CardTitle>Manual Entry</CardTitle>
                    <CardDescription>
                      Enter your annuity details manually for analysis
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="productName">Product Name</Label>
                    <Input
                      id="productName"
                      value={manualEntry.productName}
                      onChange={(e) => setManualEntry(prev => ({ ...prev, productName: e.target.value }))}
                      placeholder="e.g., MetLife Guaranteed Income"
                    />
                  </div>
                  <div>
                    <Label htmlFor="carrier">Insurance Carrier</Label>
                    <Input
                      id="carrier"
                      value={manualEntry.carrier}
                      onChange={(e) => setManualEntry(prev => ({ ...prev, carrier: e.target.value }))}
                      placeholder="e.g., MetLife"
                    />
                  </div>
                  <div>
                    <Label htmlFor="annualFee">Annual Fee (%)</Label>
                    <Input
                      id="annualFee"
                      value={manualEntry.annualFee}
                      onChange={(e) => setManualEntry(prev => ({ ...prev, annualFee: e.target.value }))}
                      placeholder="e.g., 2.15"
                    />
                  </div>
                  <div>
                    <Label htmlFor="surrenderPeriod">Surrender Period (years)</Label>
                    <Input
                      id="surrenderPeriod"
                      value={manualEntry.surrenderPeriod}
                      onChange={(e) => setManualEntry(prev => ({ ...prev, surrenderPeriod: e.target.value }))}
                      placeholder="e.g., 8"
                    />
                  </div>
                  <div>
                    <Label htmlFor="currentValue">Current Value ($)</Label>
                    <Input
                      id="currentValue"
                      value={manualEntry.currentValue}
                      onChange={(e) => setManualEntry(prev => ({ ...prev, currentValue: e.target.value }))}
                      placeholder="e.g., 250000"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="features">Additional Features/Riders</Label>
                  <Textarea
                    id="features"
                    value={manualEntry.features}
                    onChange={(e) => setManualEntry(prev => ({ ...prev, features: e.target.value }))}
                    placeholder="List any riders, guarantees, or special features..."
                    rows={3}
                  />
                </div>

                <Button 
                  onClick={analyzeContract} 
                  disabled={analyzing || !manualEntry.productName || !manualEntry.carrier} 
                  className="w-full"
                >
                  {analyzing ? (
                    <>
                      <Brain className="h-4 w-4 mr-2 animate-pulse" />
                      Analyzing Details...
                    </>
                  ) : (
                    <>
                      <Brain className="h-4 w-4 mr-2" />
                      Analyze Annuity
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      ) : (
        <div className="space-y-6">
          {/* Analysis Results */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Brain className="h-6 w-6 text-primary" />
                  <div>
                    <CardTitle>Analysis Complete</CardTitle>
                    <CardDescription>AI-powered analysis of your annuity</CardDescription>
                  </div>
                </div>
                <Button variant="outline" onClick={() => setResult(null)}>
                  Analyze Another
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className={`text-4xl font-bold mb-2 ${getScoreColor(result.score)}`}>
                    {result.score}/100
                  </div>
                  <Badge className={`${getScoreBadge(result.score).color} text-white mb-2`}>
                    {getScoreBadge(result.score).label}
                  </Badge>
                  <div className="text-sm text-muted-foreground">Overall Score</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold mb-2 text-red-600">
                    {result.fees.total}
                  </div>
                  <div className="text-sm text-muted-foreground">Annual Fees</div>
                  <div className="text-xs text-red-600">{result.fees.comparison}</div>
                </div>
                <div className="text-center">
                  <div className={`text-4xl font-bold mb-2 ${getScoreColor(result.fiduciaryAssessment.score)}`}>
                    {result.fiduciaryAssessment.score}/100
                  </div>
                  <div className="text-sm text-muted-foreground">Fiduciary Score</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Detailed Analysis */}
          <Tabs defaultValue="fees" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="fees">Fee Analysis</TabsTrigger>
              <TabsTrigger value="features">Features</TabsTrigger>
              <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
              <TabsTrigger value="fiduciary">Fiduciary Review</TabsTrigger>
            </TabsList>

            <TabsContent value="fees" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5" />
                    Fee Breakdown
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {result.fees.breakdown.map((fee, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <span>{fee.name}</span>
                        <span className="font-medium">{fee.amount}</span>
                      </div>
                    ))}
                    <div className="border-t pt-3 flex justify-between items-center font-bold">
                      <span>Total Annual Cost</span>
                      <span className="text-red-600">{result.fees.total}</span>
                    </div>
                  </div>
                  <div className="mt-4 p-3 bg-red-50 rounded-lg">
                    <div className="flex items-center gap-2 text-red-600">
                      <AlertTriangle className="h-4 w-4" />
                      <span className="font-medium">Fee Alert</span>
                    </div>
                    <p className="text-sm text-red-700 mt-1">{result.fees.comparison}</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="features" className="space-y-4">
              <div className="grid md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-green-600 flex items-center gap-2">
                      <CheckCircle className="h-5 w-5" />
                      Strengths
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {result.features.pros.map((pro, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm">
                          <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2" />
                          {pro}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-red-600 flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5" />
                      Concerns
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {result.features.cons.map((con, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm">
                          <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2" />
                          {con}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-blue-600 flex items-center gap-2">
                      <TrendingUp className="h-5 w-5" />
                      Missing Features
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {result.features.missing.map((missing, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm">
                          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2" />
                          {missing}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="recommendations" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="h-5 w-5" />
                    AI Recommendations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {result.recommendations.map((rec, index) => (
                      <div key={index} className="flex gap-3 p-3 bg-muted/30 rounded-lg">
                        <div className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                          {index + 1}
                        </div>
                        <p className="text-sm">{rec}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="fiduciary" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Fiduciary Assessment
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <div className={`text-3xl font-bold mb-2 ${getScoreColor(result.fiduciaryAssessment.score)}`}>
                      {result.fiduciaryAssessment.score}/100
                    </div>
                    <Progress value={result.fiduciaryAssessment.score} className="w-full max-w-xs mx-auto" />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium text-red-600 mb-2">Issues Identified</h4>
                      <ul className="space-y-2">
                        {result.fiduciaryAssessment.issues.map((issue, index) => (
                          <li key={index} className="flex items-start gap-2 text-sm">
                            <AlertTriangle className="h-4 w-4 text-red-500 flex-shrink-0 mt-0.5" />
                            {issue}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium text-blue-600 mb-2">Suggested Improvements</h4>
                      <ul className="space-y-2">
                        {result.fiduciaryAssessment.improvements.map((improvement, index) => (
                          <li key={index} className="flex items-start gap-2 text-sm">
                            <TrendingUp className="h-4 w-4 text-blue-500 flex-shrink-0 mt-0.5" />
                            {improvement}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <Card>
            <CardContent className="pt-6">
              <div className="flex gap-3">
                <Button className="flex-1">
                  Schedule Fiduciary Review
                </Button>
                <Button variant="outline" className="flex-1">
                  Compare Alternatives
                </Button>
                <Button variant="outline">
                  Download Report
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {analyzing && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <Brain className="h-12 w-12 text-primary mx-auto animate-pulse" />
              <div>
                <h3 className="text-lg font-medium">Analyzing Your Annuity</h3>
                <p className="text-muted-foreground">
                  Our AI is reviewing fees, features, and fiduciary standards...
                </p>
              </div>
              <Progress value={33} className="w-full max-w-md mx-auto" />
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};