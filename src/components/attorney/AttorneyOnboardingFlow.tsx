import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { 
  Scale, 
  Building, 
  Palette, 
  Shield, 
  User, 
  CreditCard, 
  MapPin,
  Upload,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Gavel,
  FileText,
  Users
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface OnboardingData {
  // Step 2 - Practice Details
  firmName: string;
  specialtyAreas: string[];
  licenseInfo: string;
  jurisdictions: string[];
  yearsExperience: string;
  
  // Step 3 - Brand Setup
  logo: File | null;
  brandColors: {
    primary: string;
    secondary: string;
  };
  
  // Step 4 - Compliance Tools
  enableCompliance: boolean;
  enableLitigation: boolean;
  enableFilingAlerts: boolean;
  selectedJurisdictions: string[];
  
  // Step 5 - Marketplace Profile
  bio: string;
  serviceCategories: string[];
  clientTypes: string[];
  consultationFee: string;
  
  // Step 6 - Subscription
  selectedPlan: 'basic' | 'premium';
}

const SPECIALTY_AREAS = [
  'Estate Planning',
  'Business Law',
  'Litigation',
  'Real Estate',
  'Tax Law',
  'Family Law',
  'Corporate Law',
  'Employment Law',
  'Intellectual Property',
  'Criminal Law'
];

const SERVICE_CATEGORIES = [
  'Wills & Trusts',
  'Business Formation',
  'Contract Review',
  'Litigation Support',
  'Compliance Consulting',
  'Real Estate Transactions',
  'Tax Planning',
  'Estate Administration'
];

const CLIENT_TYPES = [
  'High Net Worth Individuals',
  'Small Businesses',
  'Corporations',
  'Non-Profits',
  'Real Estate Investors',
  'Family Offices',
  'Startups',
  'Professional Practices'
];

const JURISDICTIONS = [
  'California', 'New York', 'Texas', 'Florida', 'Illinois',
  'Pennsylvania', 'Ohio', 'Georgia', 'North Carolina', 'Michigan'
];

export const AttorneyOnboardingFlow: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [data, setData] = useState<OnboardingData>({
    firmName: '',
    specialtyAreas: [],
    licenseInfo: '',
    jurisdictions: [],
    yearsExperience: '',
    logo: null,
    brandColors: { primary: '#3B82F6', secondary: '#10B981' },
    enableCompliance: true,
    enableLitigation: false,
    enableFilingAlerts: true,
    selectedJurisdictions: [],
    bio: '',
    serviceCategories: [],
    clientTypes: [],
    consultationFee: '',
    selectedPlan: 'basic'
  });

  const totalSteps = 7;
  const progress = (currentStep / totalSteps) * 100;

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      // Complete onboarding
      navigate('/attorney');
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const updateData = (updates: Partial<OnboardingData>) => {
    setData(prev => ({ ...prev, ...updates }));
  };

  const toggleArrayItem = (array: string[], item: string) => {
    return array.includes(item) 
      ? array.filter(i => i !== item)
      : [...array, item];
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <Scale className="w-16 h-16 text-primary mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Welcome to Your Legal Hub</h2>
              <p className="text-muted-foreground">
                Let's set up your comprehensive legal practice management system
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-4">
              <Card className="text-center p-4">
                <FileText className="w-8 h-8 text-primary mx-auto mb-2" />
                <h3 className="font-semibold mb-1">Document Automation</h3>
                <p className="text-sm text-muted-foreground">Streamlined templates and workflows</p>
              </Card>
              
              <Card className="text-center p-4">
                <Gavel className="w-8 h-8 text-primary mx-auto mb-2" />
                <h3 className="font-semibold mb-1">Case Management</h3>
                <p className="text-sm text-muted-foreground">Track deadlines and compliance</p>
              </Card>
              
              <Card className="text-center p-4">
                <Users className="w-8 h-8 text-primary mx-auto mb-2" />
                <h3 className="font-semibold mb-1">Client Portal</h3>
                <p className="text-sm text-muted-foreground">Secure collaboration workspace</p>
              </Card>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">Practice Details</h2>
              <p className="text-muted-foreground">Tell us about your legal practice</p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="firmName">Firm Name</Label>
                  <Input
                    id="firmName"
                    value={data.firmName}
                    onChange={(e) => updateData({ firmName: e.target.value })}
                    placeholder="Smith & Associates LLP"
                  />
                </div>
                
                <div>
                  <Label htmlFor="licenseInfo">Bar License Number</Label>
                  <Input
                    id="licenseInfo"
                    value={data.licenseInfo}
                    onChange={(e) => updateData({ licenseInfo: e.target.value })}
                    placeholder="CA-12345"
                  />
                </div>
                
                <div>
                  <Label htmlFor="yearsExperience">Years of Experience</Label>
                  <Input
                    id="yearsExperience"
                    value={data.yearsExperience}
                    onChange={(e) => updateData({ yearsExperience: e.target.value })}
                    placeholder="10"
                    type="number"
                  />
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <Label>Specialty Areas</Label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {SPECIALTY_AREAS.map(area => (
                      <div key={area} className="flex items-center space-x-2">
                        <Checkbox
                          id={area}
                          checked={data.specialtyAreas.includes(area)}
                          onCheckedChange={() => updateData({
                            specialtyAreas: toggleArrayItem(data.specialtyAreas, area)
                          })}
                        />
                        <Label htmlFor={area} className="text-sm">{area}</Label>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <Label>Licensed Jurisdictions</Label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {JURISDICTIONS.slice(0, 6).map(jurisdiction => (
                      <div key={jurisdiction} className="flex items-center space-x-2">
                        <Checkbox
                          id={jurisdiction}
                          checked={data.jurisdictions.includes(jurisdiction)}
                          onCheckedChange={() => updateData({
                            jurisdictions: toggleArrayItem(data.jurisdictions, jurisdiction)
                          })}
                        />
                        <Label htmlFor={jurisdiction} className="text-sm">{jurisdiction}</Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">Brand Setup</h2>
              <p className="text-muted-foreground">Customize your professional appearance</p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div>
                  <Label>Firm Logo</Label>
                  <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                    <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground mb-2">
                      Upload your firm logo
                    </p>
                    <Button variant="outline" size="sm">
                      Choose File
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <Label>Brand Colors</Label>
                  <div className="space-y-3 mt-2">
                    <div className="flex items-center gap-3">
                      <Label htmlFor="primaryColor" className="w-20">Primary</Label>
                      <input
                        type="color"
                        id="primaryColor"
                        value={data.brandColors.primary}
                        onChange={(e) => updateData({
                          brandColors: { ...data.brandColors, primary: e.target.value }
                        })}
                        className="w-12 h-8 rounded border"
                      />
                      <span className="text-sm text-muted-foreground">{data.brandColors.primary}</span>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <Label htmlFor="secondaryColor" className="w-20">Secondary</Label>
                      <input
                        type="color"
                        id="secondaryColor"
                        value={data.brandColors.secondary}
                        onChange={(e) => updateData({
                          brandColors: { ...data.brandColors, secondary: e.target.value }
                        })}
                        className="w-12 h-8 rounded border"
                      />
                      <span className="text-sm text-muted-foreground">{data.brandColors.secondary}</span>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-medium mb-2">Preview</h4>
                  <div className="space-y-2">
                    <div 
                      className="h-8 rounded"
                      style={{ backgroundColor: data.brandColors.primary }}
                    ></div>
                    <div 
                      className="h-4 rounded"
                      style={{ backgroundColor: data.brandColors.secondary }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">Compliance & Litigation Tools</h2>
              <p className="text-muted-foreground">Enable advanced practice management features</p>
            </div>
            
            <div className="space-y-6">
              <Card className="p-6">
                <div className="flex items-start gap-4">
                  <Shield className="w-6 h-6 text-primary mt-1" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold">Compliance Calendar</h3>
                      <Checkbox
                        checked={data.enableCompliance}
                        onCheckedChange={(checked) => updateData({ enableCompliance: !!checked })}
                      />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Automated deadline tracking and compliance monitoring
                    </p>
                  </div>
                </div>
              </Card>
              
              <Card className="p-6 border-primary/50 bg-primary/5">
                <div className="flex items-start gap-4">
                  <Gavel className="w-6 h-6 text-primary mt-1" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">Litigation Tracker</h3>
                        <Badge variant="secondary">Premium</Badge>
                      </div>
                      <Checkbox
                        checked={data.enableLitigation}
                        onCheckedChange={(checked) => updateData({ enableLitigation: !!checked })}
                      />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Case management, discovery deadlines, and court filing alerts
                    </p>
                  </div>
                </div>
              </Card>
              
              <Card className="p-6">
                <div className="flex items-start gap-4">
                  <MapPin className="w-6 h-6 text-primary mt-1" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold">Jurisdiction Filing Alerts</h3>
                      <Checkbox
                        checked={data.enableFilingAlerts}
                        onCheckedChange={(checked) => updateData({ enableFilingAlerts: !!checked })}
                      />
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      State-specific filing requirements and deadlines
                    </p>
                    
                    {data.enableFilingAlerts && (
                      <div>
                        <Label className="text-sm font-medium">Select Jurisdictions</Label>
                        <div className="grid grid-cols-3 gap-2 mt-2">
                          {JURISDICTIONS.slice(0, 9).map(jurisdiction => (
                            <div key={jurisdiction} className="flex items-center space-x-2">
                              <Checkbox
                                id={`filing-${jurisdiction}`}
                                checked={data.selectedJurisdictions.includes(jurisdiction)}
                                onCheckedChange={() => updateData({
                                  selectedJurisdictions: toggleArrayItem(data.selectedJurisdictions, jurisdiction)
                                })}
                              />
                              <Label htmlFor={`filing-${jurisdiction}`} className="text-xs">{jurisdiction}</Label>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">Marketplace Profile</h2>
              <p className="text-muted-foreground">Create your professional listing</p>
            </div>
            
            <div className="space-y-6">
              <div>
                <Label htmlFor="bio">Professional Bio</Label>
                <Textarea
                  id="bio"
                  value={data.bio}
                  onChange={(e) => updateData({ bio: e.target.value })}
                  placeholder="Tell potential clients about your experience, approach, and what sets your practice apart..."
                  rows={4}
                />
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label>Service Categories</Label>
                  <div className="space-y-2 mt-2">
                    {SERVICE_CATEGORIES.map(category => (
                      <div key={category} className="flex items-center space-x-2">
                        <Checkbox
                          id={`service-${category}`}
                          checked={data.serviceCategories.includes(category)}
                          onCheckedChange={() => updateData({
                            serviceCategories: toggleArrayItem(data.serviceCategories, category)
                          })}
                        />
                        <Label htmlFor={`service-${category}`} className="text-sm">{category}</Label>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <Label>Client Types Served</Label>
                  <div className="space-y-2 mt-2">
                    {CLIENT_TYPES.map(type => (
                      <div key={type} className="flex items-center space-x-2">
                        <Checkbox
                          id={`client-${type}`}
                          checked={data.clientTypes.includes(type)}
                          onCheckedChange={() => updateData({
                            clientTypes: toggleArrayItem(data.clientTypes, type)
                          })}
                        />
                        <Label htmlFor={`client-${type}`} className="text-sm">{type}</Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div>
                <Label htmlFor="consultationFee">Initial Consultation Fee</Label>
                <Input
                  id="consultationFee"
                  value={data.consultationFee}
                  onChange={(e) => updateData({ consultationFee: e.target.value })}
                  placeholder="$500"
                />
              </div>
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">Choose Your Plan</h2>
              <p className="text-muted-foreground">Select the features that fit your practice</p>
            </div>
            
            <RadioGroup
              value={data.selectedPlan}
              onValueChange={(value) => updateData({ selectedPlan: value as 'basic' | 'premium' })}
            >
              <div className="grid md:grid-cols-2 gap-6">
                <Card className={`cursor-pointer transition-all ${
                  data.selectedPlan === 'basic' ? 'ring-2 ring-primary' : ''
                }`}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <RadioGroupItem value="basic" />
                        Basic Plan
                      </CardTitle>
                      <Badge variant="outline">$99/month</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-primary" />
                        Secure Vault (10GB)
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-primary" />
                        Marketplace listing
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-primary" />
                        Basic estate planning templates
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-primary" />
                        Client messaging portal
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-primary" />
                        Standard compliance calendar
                      </li>
                    </ul>
                  </CardContent>
                </Card>
                
                <Card className={`cursor-pointer transition-all ${
                  data.selectedPlan === 'premium' ? 'ring-2 ring-primary bg-primary/5' : ''
                }`}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <RadioGroupItem value="premium" />
                        Premium Plan
                      </CardTitle>
                      <Badge>$199/month</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-3">Everything in Basic, plus:</p>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-primary" />
                        Unlimited Vault storage
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-primary" />
                        Litigation & Compliance Tracker
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-primary" />
                        Business Entity Management Pro
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-primary" />
                        Integrated CRM & marketing toolkit
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-primary" />
                        Advanced estate planning automation
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-primary" />
                        Priority marketplace listing
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </RadioGroup>
          </div>
        );

      case 7:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <CheckCircle className="w-16 h-16 text-primary mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Welcome to Your Legal Hub!</h2>
              <p className="text-muted-foreground">
                Your practice management system is ready. Let's take a quick tour.
              </p>
            </div>
            
            <div className="space-y-4">
              <Card className="p-4">
                <h3 className="font-semibold mb-2">✅ Account Created</h3>
                <p className="text-sm text-muted-foreground">
                  {data.firmName} profile set up with {data.selectedPlan} plan
                </p>
              </Card>
              
              <Card className="p-4">
                <h3 className="font-semibold mb-2">📋 Next Steps</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Complete your marketplace profile</li>
                  <li>• Upload your first client documents</li>
                  <li>• Invite team members</li>
                  <li>• Set up your calendar integration</li>
                </ul>
              </Card>
              
              <Card className="p-4">
                <h3 className="font-semibold mb-2">🎯 Quick Tour</h3>
                <p className="text-sm text-muted-foreground">
                  We'll show you the key features to get you started quickly
                </p>
              </Card>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Progress Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Scale className="w-8 h-8 text-primary" />
              <div>
                <h1 className="text-2xl font-bold">Attorney Onboarding</h1>
                <p className="text-sm text-muted-foreground">
                  Step {currentStep} of {totalSteps}
                </p>
              </div>
            </div>
            <Badge variant="outline">
              {Math.round(progress)}% Complete
            </Badge>
          </div>
          
          <Progress value={progress} className="h-2" />
        </div>

        {/* Step Content */}
        <Card className="mb-8">
          <CardContent className="p-8">
            {renderStepContent()}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 1}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>
          
          <Button onClick={handleNext}>
            {currentStep === totalSteps ? 'Complete Setup' : 'Continue'}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
};