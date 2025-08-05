import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Download, CheckCircle, AlertTriangle, XCircle, FileText, TrendingUp, Users, DollarSign } from 'lucide-react';
import { toast } from 'sonner';

interface PatentComparison {
  patentNumber: string;
  title: string;
  assignee: string;
  filedDate: string;
  similarityScore: number;
  differentiatingFactors: string[];
  riskLevel: 'low' | 'medium' | 'high';
  status: 'active' | 'expired' | 'pending';
}

interface NoveltyFactor {
  factor: string;
  noveltyScore: number;
  description: string;
  priorArt: string[];
  technicalAdvantage: string;
}

const patentComparisons: PatentComparison[] = [
  {
    patentNumber: "US10,789,123",
    title: "Lead Scoring System for Financial Services",
    assignee: "Salesforce",
    filedDate: "2019-03-15",
    similarityScore: 35,
    differentiatingFactors: [
      "No HNW-specific data integration",
      "Limited alternative investment analysis",
      "No BFO™ persona mapping"
    ],
    riskLevel: 'low',
    status: 'active'
  },
  {
    patentNumber: "US11,234,567",
    title: "Wealth Management Lead Classification",
    assignee: "Fidelity Investments",
    filedDate: "2020-08-22",
    similarityScore: 58,
    differentiatingFactors: [
      "Static scoring vs. dynamic SWAG™",
      "No multi-generational family analysis",
      "Limited Plaid integration depth"
    ],
    riskLevel: 'medium',
    status: 'active'
  },
  {
    patentNumber: "US10,456,789",
    title: "AI-Driven Customer Scoring for Investment Platforms",
    assignee: "Catchlight Advisory",
    filedDate: "2021-01-10",
    similarityScore: 42,
    differentiatingFactors: [
      "No BFO™ methodology",
      "Limited family office focus",
      "No Strategic Wealth Alpha GPS™"
    ],
    riskLevel: 'low',
    status: 'active'
  },
  {
    patentNumber: "US11,567,890",
    title: "High Net Worth Client Identification System",
    assignee: "Morgan Stanley",
    filedDate: "2018-11-05",
    similarityScore: 48,
    differentiatingFactors: [
      "Traditional scoring methods",
      "No open banking integration",
      "Limited persona-based triggers"
    ],
    riskLevel: 'medium',
    status: 'active'
  }
];

const noveltyFactors: NoveltyFactor[] = [
  {
    factor: "BFO™ Strategic Wealth Alpha GPS™",
    noveltyScore: 95,
    description: "Proprietary methodology combining family office operations with strategic wealth positioning",
    priorArt: ["Traditional wealth scoring", "Basic family office tools"],
    technicalAdvantage: "Multi-generational wealth pattern recognition with strategic positioning algorithms"
  },
  {
    factor: "HNW-Specific Plaid Integration",
    noveltyScore: 88,
    description: "Deep integration with alternative investment accounts and family trust structures",
    priorArt: ["Basic bank account analysis", "Standard Plaid implementations"],
    technicalAdvantage: "Identifies complex family wealth structures and alternative investment eligibility"
  },
  {
    factor: "Dynamic SWAG™ Persona Triggers",
    noveltyScore: 92,
    description: "Real-time persona classification with adaptive scoring based on behavioral patterns",
    priorArt: ["Static lead scoring", "Basic demographic analysis"],
    technicalAdvantage: "Behavioral pattern recognition for HNW personas with dynamic threshold adjustment"
  },
  {
    factor: "Multi-Generational Family Analysis",
    noveltyScore: 90,
    description: "Cross-generational wealth transfer pattern analysis and family office structure mapping",
    priorArt: ["Individual client analysis", "Basic family linking"],
    technicalAdvantage: "Predictive modeling for generational wealth transitions and family office formation"
  }
];

export function PatentabilityTestDashboard() {
  const [selectedTab, setSelectedTab] = useState("overview");
  
  const overallPatentabilityScore = noveltyFactors.reduce((acc, factor) => acc + factor.noveltyScore, 0) / noveltyFactors.length;
  const highRiskPatents = patentComparisons.filter(p => p.riskLevel === 'high').length;
  const mediumRiskPatents = patentComparisons.filter(p => p.riskLevel === 'medium').length;
  const lowRiskPatents = patentComparisons.filter(p => p.riskLevel === 'low').length;

  const getRiskIcon = (level: string) => {
    switch (level) {
      case 'high': return <XCircle className="h-4 w-4 text-red-500" />;
      case 'medium': return <AlertTriangle className="h-4 w-4 text-amber-500" />;
      case 'low': return <CheckCircle className="h-4 w-4 text-emerald-500" />;
      default: return null;
    }
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'high': return 'bg-red-500/10 text-red-700 border-red-200';
      case 'medium': return 'bg-amber-500/10 text-amber-700 border-amber-200';
      case 'low': return 'bg-emerald-500/10 text-emerald-700 border-emerald-200';
      default: return '';
    }
  };

  const exportPatentabilityReport = () => {
    const reportData = {
      testDate: new Date().toISOString(),
      overallScore: overallPatentabilityScore,
      patentComparisons,
      noveltyFactors,
      recommendation: overallPatentabilityScore > 85 ? "HIGHLY PATENTABLE" : overallPatentabilityScore > 70 ? "PATENTABLE WITH MODIFICATIONS" : "REQUIRES FURTHER DIFFERENTIATION"
    };
    
    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SWAG-Patentability-Analysis-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success("Patentability report exported for attorney review");
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gold font-playfair">SWAG Lead Score™ Patentability Analysis</h2>
          <p className="text-muted-foreground">Comprehensive prior art analysis and novelty assessment</p>
        </div>
        <Button onClick={exportPatentabilityReport} className="bg-gold hover:bg-gold/90 text-deep-blue">
          <Download className="h-4 w-4 mr-2" />
          Export Attorney Report
        </Button>
      </div>

      {/* Overall Score Card */}
      <Card className="bg-gradient-to-br from-background to-gold/5 border-gold/20">
        <CardHeader>
          <CardTitle className="text-xl text-gold font-playfair flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Overall Patentability Score
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div className="text-4xl font-bold text-gold">{overallPatentabilityScore.toFixed(1)}%</div>
            <Badge className={overallPatentabilityScore > 85 ? "bg-emerald-500/10 text-emerald-700" : overallPatentabilityScore > 70 ? "bg-amber-500/10 text-amber-700" : "bg-red-500/10 text-red-700"}>
              {overallPatentabilityScore > 85 ? "HIGHLY PATENTABLE" : overallPatentabilityScore > 70 ? "PATENTABLE" : "NEEDS WORK"}
            </Badge>
          </div>
          <Progress value={overallPatentabilityScore} className="mb-4" />
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-red-500">{highRiskPatents}</div>
              <div className="text-sm text-muted-foreground">High Risk</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-amber-500">{mediumRiskPatents}</div>
              <div className="text-sm text-muted-foreground">Medium Risk</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-emerald-500">{lowRiskPatents}</div>
              <div className="text-sm text-muted-foreground">Low Risk</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Patent Comparison</TabsTrigger>
          <TabsTrigger value="novelty">Novelty Factors</TabsTrigger>
          <TabsTrigger value="claims">Claim Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4">
            {patentComparisons.map((patent, index) => (
              <Card key={index} className="border-l-4 border-l-gold/50">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg font-semibold">{patent.patentNumber}</CardTitle>
                      <p className="text-sm text-muted-foreground">{patent.title}</p>
                      <p className="text-xs text-muted-foreground">{patent.assignee} • Filed: {patent.filedDate}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getRiskColor(patent.riskLevel)}>
                        {getRiskIcon(patent.riskLevel)}
                        {patent.riskLevel.toUpperCase()}
                      </Badge>
                      <Badge variant="outline">{patent.status.toUpperCase()}</Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-medium">Similarity Score:</span>
                    <div className="flex items-center gap-2">
                      <Progress value={patent.similarityScore} className="w-32" />
                      <span className="text-sm font-bold">{patent.similarityScore}%</span>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold mb-2">Key Differentiating Factors:</h4>
                    <ul className="space-y-1">
                      {patent.differentiatingFactors.map((factor, idx) => (
                        <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                          <CheckCircle className="h-3 w-3 text-emerald-500 mt-0.5 flex-shrink-0" />
                          {factor}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="novelty" className="space-y-4">
          <div className="grid gap-4">
            {noveltyFactors.map((factor, index) => (
              <Card key={index} className="bg-gradient-to-br from-background to-emerald-500/5 border-emerald-500/20">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg font-semibold text-emerald-700">{factor.factor}</CardTitle>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold text-emerald-600">{factor.noveltyScore}%</span>
                      <CheckCircle className="h-5 w-5 text-emerald-500" />
                    </div>
                  </div>
                  <Progress value={factor.noveltyScore} className="mt-2" />
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="text-sm font-semibold mb-2">Technical Innovation:</h4>
                    <p className="text-sm text-muted-foreground">{factor.description}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold mb-2">Technical Advantage:</h4>
                    <p className="text-sm text-emerald-700 bg-emerald-50 p-2 rounded">{factor.technicalAdvantage}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold mb-2">Prior Art Comparison:</h4>
                    <div className="flex flex-wrap gap-2">
                      {factor.priorArt.map((art, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">{art}</Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="claims" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl text-gold font-playfair">Recommended Patent Claims Structure</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="border-l-4 border-l-gold pl-4">
                  <h3 className="font-semibold text-lg">Claim 1 (Independent Method Claim)</h3>
                  <p className="text-sm text-muted-foreground mt-2">
                    A computer-implemented method for scoring leads in a wealth management system, comprising:
                    ingesting financial data from multiple sources including open banking APIs; analyzing high-net-worth 
                    indicators including alternative investment eligibility; applying BFO™ Strategic Wealth Alpha GPS™ 
                    methodology to generate dynamic SWAG™ scores; and triggering persona-specific engagement workflows 
                    based on multi-generational family wealth patterns.
                  </p>
                </div>

                <div className="border-l-4 border-l-emerald-500 pl-4">
                  <h3 className="font-semibold text-lg">Claim 2 (System Claim)</h3>
                  <p className="text-sm text-muted-foreground mt-2">
                    A wealth management lead scoring system comprising: a data ingestion module configured to receive 
                    financial data from Plaid APIs; an AI analysis engine implementing BFO™ methodology; a dynamic 
                    scoring module generating SWAG™ scores; and a persona trigger system for automated client engagement.
                  </p>
                </div>

                <div className="border-l-4 border-l-amber-500 pl-4">
                  <h3 className="font-semibold text-lg">Claim 3 (Device/Apparatus Claim)</h3>
                  <p className="text-sm text-muted-foreground mt-2">
                    A non-transitory computer-readable storage medium storing instructions that, when executed by a 
                    processor, cause the processor to perform the SWAG™ lead scoring methodology including HNW pattern 
                    recognition and family office structure analysis.
                  </p>
                </div>
              </div>

              <div className="bg-gold/10 p-4 rounded-lg">
                <h4 className="font-semibold text-gold mb-2 flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Attorney Notes
                </h4>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• Strong novelty in BFO™ methodology and multi-generational analysis</li>
                  <li>• Clear technical differentiation from existing Salesforce and Fidelity patents</li>
                  <li>• Recommend filing continuation applications for specific technical aspects</li>
                  <li>• Consider international filing strategy for key markets (EU, Canada, Australia)</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}