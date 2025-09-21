import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useEstatePlanning } from '@/hooks/useEstatePlanning';
import { ProfessionalRequestModal } from '@/components/professional-collaboration/ProfessionalRequestModal';
import { 
  Scale, 
  FileText, 
  Shield, 
  Users, 
  Crown,
  CheckCircle,
  AlertTriangle,
  Calendar,
  TrendingUp,
  Heart,
  Home,
  Banknote,
  UserCheck
} from 'lucide-react';

interface EstateFormData {
  // Personal Information
  fullName: string;
  spouse: string;
  children: number;
  state: string;
  
  // Assets
  primaryResidence: number;
  investments: number;
  retirement: number;
  business: number;
  otherAssets: number;
  
  // Estate Planning Goals
  goals: string[];
  concerns: string[];
  
  // Advanced Options
  trustStructure: string;  
  taxOptimization: boolean;
  charityPlanning: boolean;
}

export default function EstateToolPage() {
  const { documents, createDocument, loading } = useEstatePlanning();
  const [activeTab, setActiveTab] = useState('planner');
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [formData, setFormData] = useState<EstateFormData>({
    fullName: '',
    spouse: '',
    children: 0,
    state: '',
    primaryResidence: 0,
    investments: 0,
    retirement: 0,
    business: 0,
    otherAssets: 0,
    goals: [],
    concerns: [],
    trustStructure: '',
    taxOptimization: false,
    charityPlanning: false
  });

  const [planResults, setPlanResults] = useState<any>(null);

  const calculateEstateAnalysis = () => {
    const totalAssets = formData.primaryResidence + formData.investments + 
                       formData.retirement + formData.business + formData.otherAssets;
    
    // Federal estate tax threshold for 2024
    const federalThreshold = 13610000; // $13.61M
    const estateExposure = Math.max(0, totalAssets - federalThreshold);
    const potentialTax = estateExposure * 0.4; // 40% estate tax rate
    
    // State estate tax (varies by state)
    const stateThresholds: Record<string, number> = {
      'NY': 6580000,
      'MA': 2000000,
      'OR': 1000000,
      'IL': 4000000,
      'CT': 12920000,
      'MN': 3000000
    };
    
    const stateThreshold = stateThresholds[formData.state] || federalThreshold;
    const stateExposure = Math.max(0, totalAssets - stateThreshold);
    const potentialStateTax = stateExposure * 0.16; // Average state estate tax
    
    const results = {
      totalAssets,
      federalExposure: estateExposure,
      stateExposure,
      potentialFederalTax: potentialTax,
      potentialStateTax,
      totalPotentialTax: potentialTax + potentialStateTax,
      recommendations: generateRecommendations(totalAssets, estateExposure, formData)
    };
    
    setPlanResults(results);
  };

  const generateRecommendations = (assets: number, exposure: number, data: EstateFormData) => {
    const recommendations = [];
    
    if (exposure > 0) {
      recommendations.push({
        priority: 'high',
        title: 'Estate Tax Planning Required',
        description: `Your estate exceeds the federal threshold by $${(exposure/1000000).toFixed(1)}M. Consider advanced planning strategies.`,
        strategies: ['Irrevocable Life Insurance Trust (ILIT)', 'Grantor Retained Annuity Trust (GRAT)', 'Charitable Remainder Trust']
      });
    }
    
    if (assets > 5000000 && !data.trustStructure) {
      recommendations.push({
        priority: 'medium',
        title: 'Trust Structure Recommended',
        description: 'With significant assets, a trust structure can provide tax benefits and asset protection.',
        strategies: ['Revocable Living Trust', 'Irrevocable Trust', 'Generation-Skipping Trust']
      });
    }
    
    if (data.children > 0) {
      recommendations.push({
        priority: 'medium',
        title: 'Generation-Skipping Planning',
        description: 'Optimize wealth transfer to children and grandchildren with minimal tax impact.',
        strategies: ['529 Education Plans', 'Custodial Accounts', 'Family Limited Partnership']
      });
    }
    
    if (data.business > 1000000) {
      recommendations.push({
        priority: 'high',
        title: 'Business Succession Planning',
        description: 'Protect your business value and ensure smooth transition.',
        strategies: ['Buy-Sell Agreement', 'Key Person Insurance', 'Management Succession Plan']
      });
    }
    
    return recommendations;
  };

  const estateGoalOptions = [
    'Minimize estate taxes',
    'Provide for spouse',
    'Support children education',
    'Maintain family business',
    'Charitable giving',
    'Asset protection',
    'Privacy preservation',
    'Avoid probate'
  ];

  const estateConcernOptions = [
    'High estate tax liability',
    'Family disputes',
    'Business continuity',
    'Liquidity issues',
    'Care for disabled family member',
    'Blended family considerations',
    'Privacy concerns',
    'State law variations'
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-full bg-gradient-to-r from-primary/20 to-accent/20">
              <Crown className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                SWAG™ Legacy Planning
              </h1>
              <p className="text-lg text-muted-foreground">
                Strategic Wealth Alpha GPS™ Estate Planning Analyzer
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Badge variant="secondary" className="bg-primary/10 text-primary">
              <Crown className="h-3 w-3 mr-1" />
              Professional Tool
            </Badge>
            <Badge variant="outline">AI-Powered Analysis</Badge>
            <Badge variant="outline">Attorney Collaboration</Badge>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="planner">Estate Planner</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="collaboration">Attorney Network</TabsTrigger>
            <TabsTrigger value="analysis">Analysis</TabsTrigger>
          </TabsList>

          {/* Estate Planner Tab */}
          <TabsContent value="planner" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserCheck className="h-5 w-5" />
                  Personal Information
                </CardTitle>
                <CardDescription>
                  Provide your basic information to customize the estate plan
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      value={formData.fullName}
                      onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                      placeholder="Enter your full legal name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="spouse">Spouse Name (Optional)</Label>
                    <Input
                      id="spouse"
                      value={formData.spouse}
                      onChange={(e) => setFormData({...formData, spouse: e.target.value})}
                      placeholder="Enter spouse's full name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="children">Number of Children</Label>
                    <Input
                      id="children"
                      type="number"
                      value={formData.children}
                      onChange={(e) => setFormData({...formData, children: parseInt(e.target.value) || 0})}
                      min="0"
                    />
                  </div>
                  <div>
                    <Label htmlFor="state">State of Residence</Label>
                    <Select value={formData.state} onValueChange={(value) => setFormData({...formData, state: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your state" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="CA">California</SelectItem>
                        <SelectItem value="NY">New York</SelectItem>
                        <SelectItem value="TX">Texas</SelectItem>
                        <SelectItem value="FL">Florida</SelectItem>
                        <SelectItem value="IL">Illinois</SelectItem>
                        <SelectItem value="MA">Massachusetts</SelectItem>
                        <SelectItem value="CT">Connecticut</SelectItem>
                        <SelectItem value="NJ">New Jersey</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Banknote className="h-5 w-5" />
                  Asset Inventory
                </CardTitle>
                <CardDescription>
                  Enter your current asset values for accurate estate analysis
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="primaryResidence">Primary Residence</Label>
                    <Input
                      id="primaryResidence"
                      type="number"
                      value={formData.primaryResidence}
                      onChange={(e) => setFormData({...formData, primaryResidence: parseInt(e.target.value) || 0})}
                      placeholder="Market value"
                    />
                  </div>
                  <div>
                    <Label htmlFor="investments">Investment Accounts</Label>
                    <Input
                      id="investments"
                      type="number"
                      value={formData.investments}
                      onChange={(e) => setFormData({...formData, investments: parseInt(e.target.value) || 0})}
                      placeholder="Taxable investments"
                    />
                  </div>
                  <div>
                    <Label htmlFor="retirement">Retirement Accounts</Label>
                    <Input
                      id="retirement"
                      type="number"
                      value={formData.retirement}
                      onChange={(e) => setFormData({...formData, retirement: parseInt(e.target.value) || 0})}
                      placeholder="401k, IRA, etc."
                    />
                  </div>
                  <div>
                    <Label htmlFor="business">Business Interests</Label>
                    <Input
                      id="business"
                      type="number"
                      value={formData.business}
                      onChange={(e) => setFormData({...formData, business: parseInt(e.target.value) || 0})}
                      placeholder="Business valuation"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="otherAssets">Other Assets</Label>
                    <Input
                      id="otherAssets"
                      type="number"
                      value={formData.otherAssets}
                      onChange={(e) => setFormData({...formData, otherAssets: parseInt(e.target.value) || 0})}
                      placeholder="Art, collectibles, etc."
                    />
                  </div>
                </div>
                
                <div className="mt-4 p-4 bg-primary/5 rounded-lg">
                  <div className="text-lg font-semibold">
                    Total Estate Value: {formatCurrency(
                      formData.primaryResidence + formData.investments + formData.retirement + 
                      formData.business + formData.otherAssets
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-center">
              <Button 
                onClick={calculateEstateAnalysis}
                size="lg"
                className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
              >
                <TrendingUp className="h-5 w-5 mr-2" />
                Generate SWAG™ Estate Analysis
              </Button>
            </div>
          </TabsContent>

          {/* Analysis Results Tab */}
          <TabsContent value="analysis" className="space-y-6">
            {planResults ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card>
                    <CardContent className="p-6">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-primary">
                          {formatCurrency(planResults.totalAssets)}
                        </div>
                        <div className="text-sm text-muted-foreground">Total Estate Value</div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-6">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-orange-500">
                          {formatCurrency(planResults.totalPotentialTax)}
                        </div>
                        <div className="text-sm text-muted-foreground">Potential Estate Tax</div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-6">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-green-500">
                          {formatCurrency(planResults.totalAssets - planResults.totalPotentialTax)}
                        </div>
                        <div className="text-sm text-muted-foreground">Net to Heirs</div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-orange-500" />
                      Estate Planning Recommendations
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {planResults.recommendations.map((rec: any, index: number) => (
                      <div key={index} className="p-4 border rounded-lg">
                        <div className="flex items-center gap-3 mb-2">
                          <Badge variant={rec.priority === 'high' ? 'destructive' : 'secondary'}>
                            {rec.priority} priority
                          </Badge>
                          <h4 className="font-semibold">{rec.title}</h4>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">{rec.description}</p>
                        <div className="space-y-1">
                          <p className="text-sm font-medium">Recommended Strategies:</p>
                          <ul className="text-sm text-muted-foreground list-disc list-inside">
                            {rec.strategies.map((strategy: string, i: number) => (
                              <li key={i}>{strategy}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Professional Review Request */}
                <Card className="bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Scale className="h-5 w-5 text-primary" />
                      Professional Attorney Review
                    </CardTitle>
                    <CardDescription>
                      Get your estate plan reviewed by a qualified estate planning attorney
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground mb-2">
                          Our network of estate planning attorneys can review your analysis and provide personalized legal guidance
                        </p>
                        <ul className="text-xs text-muted-foreground space-y-1">
                          <li>• Document drafting and review</li>
                          <li>• Tax optimization strategies</li>
                          <li>• Trust structure recommendations</li>
                          <li>• State-specific compliance</li>
                        </ul>
                      </div>
                      <Button 
                        onClick={() => setShowRequestModal(true)}
                        className="bg-primary text-primary-foreground hover:bg-primary/90"
                      >
                        <Users className="h-4 w-4 mr-2" />
                        Request Attorney Review
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </>
            ) : (
              <Card className="text-center py-12">
                <CardContent>
                  <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Analysis Yet</h3>
                  <p className="text-muted-foreground">
                    Complete the estate planner form to generate your SWAG™ analysis
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Documents Tab */}
          <TabsContent value="documents" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Estate Planning Documents
                </CardTitle>
                <CardDescription>
                  Manage and track your estate planning documents
                </CardDescription>
              </CardHeader>
              <CardContent>
                {documents.length === 0 ? (
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No documents yet. Complete your analysis to get started.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {documents.map((doc) => (
                      <div key={doc.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <h4 className="font-medium">{doc.document_name}</h4>
                          <p className="text-sm text-muted-foreground">{doc.document_type}</p>
                        </div>
                        <Badge variant={doc.status === 'completed' ? 'default' : 'secondary'}>
                          {doc.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Attorney Network Tab */}
          <TabsContent value="collaboration" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Scale className="h-5 w-5" />
                  Attorney Collaboration Network
                </CardTitle>
                <CardDescription>
                  Connect with qualified estate planning attorneys
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-semibold">Available Services:</h4>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        Will and Testament Drafting
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        Trust Creation and Management
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        Estate Tax Planning
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        Business Succession Planning
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        Charitable Planning
                      </li>
                    </ul>
                  </div>
                  <div className="space-y-4">
                    <h4 className="font-semibold">Process:</h4>
                    <ol className="space-y-2 text-sm">
                      <li className="flex items-start gap-2">
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">1</span>
                        Complete your SWAG™ estate analysis
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">2</span>
                        Request attorney review with your data
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">3</span>
                        Get matched with qualified attorney
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">4</span>
                        Collaborate on document creation
                      </li>
                    </ol>
                  </div>
                </div>
                
                <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    <strong>Note:</strong> All attorneys in our network are licensed professionals specializing in estate planning. 
                    Fees are determined directly between you and the attorney.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Professional Request Modal */}
      <ProfessionalRequestModal
        open={showRequestModal}
        onClose={() => setShowRequestModal(false)}
        toolData={{
          tool_type: 'swag_legacy_planning',
          formData,
          planResults,
          analysis_date: new Date().toISOString()
        }}
        defaultRequestType="estate_review"
        defaultProfessionalType="attorney"
      />
    </div>
  );
}