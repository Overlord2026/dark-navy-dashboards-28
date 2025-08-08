import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Building2, 
  User, 
  Settings, 
  Database,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Phone,
  FileText,
  Zap
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface OnboardingData {
  profile: {
    name: string;
    brokerage: string;
    role: string;
    licenseNumber: string;
    states: string[];
    niche: string;
    email: string;
    phone: string;
  };
  systems: {
    mlsEnabled: boolean;
    mlsEndpoint: string;
    mlsApiKey: string;
    officeId: string;
    brokerId: string;
    vaultEnabled: boolean;
    twilioEnabled: boolean;
    twilioNumber: string;
  };
  sampleData: {
    listings: boolean;
    owners: boolean;
    entities: boolean;
    scenarios: boolean;
  };
}

const RealtorOnboarding: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [data, setData] = useState<OnboardingData>({
    profile: {
      name: '',
      brokerage: '',
      role: '',
      licenseNumber: '',
      states: [],
      niche: '',
      email: '',
      phone: ''
    },
    systems: {
      mlsEnabled: false,
      mlsEndpoint: '',
      mlsApiKey: '',
      officeId: '',
      brokerId: '',
      vaultEnabled: true,
      twilioEnabled: false,
      twilioNumber: ''
    },
    sampleData: {
      listings: true,
      owners: true,
      entities: true,
      scenarios: true
    }
  });

  const progress = (currentStep / 3) * 100;

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    // Save onboarding data
    localStorage.setItem('realtorOnboardingData', JSON.stringify(data));
    
    // Track completion
    if (typeof window !== 'undefined' && (window as any).analytics) {
      (window as any).analytics.track('realtor_onboarding_completed', {
        role: data.profile.role,
        niche: data.profile.niche,
        mlsEnabled: data.systems.mlsEnabled,
        twilioEnabled: data.systems.twilioEnabled
      });
    }

    toast.success('Onboarding completed successfully!');
    navigate('/realtor/dashboard');
  };

  const updateProfile = (field: string, value: any) => {
    setData(prev => ({
      ...prev,
      profile: { ...prev.profile, [field]: value }
    }));
  };

  const updateSystems = (field: string, value: any) => {
    setData(prev => ({
      ...prev,
      systems: { ...prev.systems, [field]: value }
    }));
  };

  const updateSampleData = (field: string, value: boolean) => {
    setData(prev => ({
      ...prev,
      sampleData: { ...prev.sampleData, [field]: value }
    }));
  };

  const addState = (state: string) => {
    if (!data.profile.states.includes(state)) {
      updateProfile('states', [...data.profile.states, state]);
    }
  };

  const removeState = (state: string) => {
    updateProfile('states', data.profile.states.filter(s => s !== state));
  };

  return (
    <div className="min-h-screen bg-brand-bg">
      {/* Header */}
      <div className="bg-brand-dark border-b border-brand-primary/20">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Building2 className="h-8 w-8 text-brand-primary" />
              <span className="text-xl font-bold text-brand-text">BFO Realtor Setup</span>
            </div>
            <Badge variant="outline" className="text-brand-accent border-brand-accent">
              Step {currentStep} of 3
            </Badge>
          </div>
          <div className="mt-4">
            <Progress value={progress} className="h-2" />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          
          {/* Step 1: Profile */}
          {currentStep === 1 && (
            <Card className="bg-brand-dark border-brand-primary/20">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <User className="h-6 w-6 text-brand-primary" />
                  <CardTitle className="text-brand-text">Profile Setup</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name" className="text-brand-text">Full Name</Label>
                    <Input
                      id="name"
                      value={data.profile.name}
                      onChange={(e) => updateProfile('name', e.target.value)}
                      placeholder="Your full name"
                      className="bg-brand-bg border-brand-primary/20 text-brand-text"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email" className="text-brand-text">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={data.profile.email}
                      onChange={(e) => updateProfile('email', e.target.value)}
                      placeholder="your@email.com"
                      className="bg-brand-bg border-brand-primary/20 text-brand-text"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="brokerage" className="text-brand-text">Brokerage</Label>
                    <Input
                      id="brokerage"
                      value={data.profile.brokerage}
                      onChange={(e) => updateProfile('brokerage', e.target.value)}
                      placeholder="Your brokerage name"
                      className="bg-brand-bg border-brand-primary/20 text-brand-text"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone" className="text-brand-text">Phone</Label>
                    <Input
                      id="phone"
                      value={data.profile.phone}
                      onChange={(e) => updateProfile('phone', e.target.value)}
                      placeholder="(555) 123-4567"
                      className="bg-brand-bg border-brand-primary/20 text-brand-text"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="role" className="text-brand-text">Role</Label>
                    <Select onValueChange={(value) => updateProfile('role', value)}>
                      <SelectTrigger className="bg-brand-bg border-brand-primary/20 text-brand-text">
                        <SelectValue placeholder="Select your role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="realtor">Realtor</SelectItem>
                        <SelectItem value="property_manager">Property Manager</SelectItem>
                        <SelectItem value="broker_owner">Broker Owner</SelectItem>
                        <SelectItem value="team_lead">Team Lead</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="license" className="text-brand-text">License Number</Label>
                    <Input
                      id="license"
                      value={data.profile.licenseNumber}
                      onChange={(e) => updateProfile('licenseNumber', e.target.value)}
                      placeholder="License #"
                      className="bg-brand-bg border-brand-primary/20 text-brand-text"
                    />
                  </div>
                </div>

                <div>
                  <Label className="text-brand-text">States Licensed</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {['CA', 'TX', 'FL', 'NY', 'IL', 'PA', 'OH', 'GA', 'NC', 'MI'].map(state => (
                      <button
                        key={state}
                        onClick={() => data.profile.states.includes(state) ? removeState(state) : addState(state)}
                        className={`px-3 py-1 text-sm rounded-md border transition-colors ${
                          data.profile.states.includes(state)
                            ? 'bg-brand-primary text-brand-dark border-brand-primary'
                            : 'bg-brand-bg text-brand-text border-brand-primary/20 hover:border-brand-primary/40'
                        }`}
                      >
                        {state}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <Label htmlFor="niche" className="text-brand-text">Primary Niche</Label>
                  <Select onValueChange={(value) => updateProfile('niche', value)}>
                    <SelectTrigger className="bg-brand-bg border-brand-primary/20 text-brand-text">
                      <SelectValue placeholder="Select your niche" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="residential">Residential Sales</SelectItem>
                      <SelectItem value="investors">Real Estate Investors</SelectItem>
                      <SelectItem value="property_management">Property Management</SelectItem>
                      <SelectItem value="commercial">Commercial Real Estate</SelectItem>
                      <SelectItem value="luxury">Luxury Properties</SelectItem>
                      <SelectItem value="first_time">First-Time Buyers</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 2: Connect Systems */}
          {currentStep === 2 && (
            <Card className="bg-brand-dark border-brand-primary/20">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Settings className="h-6 w-6 text-brand-primary" />
                  <CardTitle className="text-brand-text">Connect Your Systems</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-8">
                
                {/* MLS Integration */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Database className="h-5 w-5 text-brand-accent" />
                      <div>
                        <h3 className="text-brand-text font-medium">MLS/RETS Integration</h3>
                        <p className="text-brand-text/60 text-sm">Connect to your MLS for listing sync</p>
                      </div>
                    </div>
                    <Checkbox
                      checked={data.systems.mlsEnabled}
                      onCheckedChange={(checked) => updateSystems('mlsEnabled', !!checked)}
                    />
                  </div>
                  
                  {data.systems.mlsEnabled && (
                    <div className="ml-8 space-y-4 p-4 bg-brand-bg rounded-lg border border-brand-primary/20">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="mlsEndpoint" className="text-brand-text">RETS/RESO API Endpoint</Label>
                          <Input
                            id="mlsEndpoint"
                            value={data.systems.mlsEndpoint}
                            onChange={(e) => updateSystems('mlsEndpoint', e.target.value)}
                            placeholder="https://api.mlsystem.com"
                            className="bg-brand-dark border-brand-primary/20 text-brand-text"
                          />
                        </div>
                        <div>
                          <Label htmlFor="mlsApiKey" className="text-brand-text">API Key</Label>
                          <Input
                            id="mlsApiKey"
                            type="password"
                            value={data.systems.mlsApiKey}
                            onChange={(e) => updateSystems('mlsApiKey', e.target.value)}
                            placeholder="Your API key"
                            className="bg-brand-dark border-brand-primary/20 text-brand-text"
                          />
                        </div>
                      </div>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="officeId" className="text-brand-text">Office/Broker ID</Label>
                          <Input
                            id="officeId"
                            value={data.systems.officeId}
                            onChange={(e) => updateSystems('officeId', e.target.value)}
                            placeholder="Office ID"
                            className="bg-brand-dark border-brand-primary/20 text-brand-text"
                          />
                        </div>
                        <div>
                          <Label htmlFor="brokerId" className="text-brand-text">Agent/Broker ID</Label>
                          <Input
                            id="brokerId"
                            value={data.systems.brokerId}
                            onChange={(e) => updateSystems('brokerId', e.target.value)}
                            placeholder="Your agent ID"
                            className="bg-brand-dark border-brand-primary/20 text-brand-text"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Document Vault */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-brand-accent" />
                      <div>
                        <h3 className="text-brand-text font-medium">BFO Secure Vault</h3>
                        <p className="text-brand-text/60 text-sm">Document storage and client portals</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-green-500 text-sm">Auto-enabled</span>
                    </div>
                  </div>
                </div>

                {/* Twilio Communications */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Phone className="h-5 w-5 text-brand-accent" />
                      <div>
                        <h3 className="text-brand-text font-medium">Twilio Communications</h3>
                        <p className="text-brand-text/60 text-sm">SMS, voice calls, and call recording</p>
                      </div>
                    </div>
                    <Checkbox
                      checked={data.systems.twilioEnabled}
                      onCheckedChange={(checked) => updateSystems('twilioEnabled', !!checked)}
                    />
                  </div>
                  
                  {data.systems.twilioEnabled && (
                    <div className="ml-8 p-4 bg-brand-bg rounded-lg border border-brand-primary/20">
                      <p className="text-brand-text/80 text-sm mb-4">
                        We'll provision a dedicated phone number for your business communications.
                      </p>
                      <Button 
                        variant="outline" 
                        className="border-brand-accent text-brand-accent hover:bg-brand-accent hover:text-brand-dark"
                        onClick={() => toast.info('Phone provisioning will be completed after onboarding')}
                      >
                        Provision Phone Number
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 3: Sample Data */}
          {currentStep === 3 && (
            <Card className="bg-brand-dark border-brand-primary/20">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Zap className="h-6 w-6 text-brand-primary" />
                  <CardTitle className="text-brand-text">Sample Data & Quick Start</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-brand-text/80">
                  Import sample data to quickly explore the platform and see how it works with real scenarios.
                </p>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-brand-bg rounded-lg border border-brand-primary/20">
                    <div>
                      <h3 className="text-brand-text font-medium">3 Demo Listings</h3>
                      <p className="text-brand-text/60 text-sm">Sample properties with cap-rate calculations</p>
                    </div>
                    <Checkbox
                      checked={data.sampleData.listings}
                      onCheckedChange={(checked) => updateSampleData('listings', !!checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 bg-brand-bg rounded-lg border border-brand-primary/20">
                    <div>
                      <h3 className="text-brand-text font-medium">5 Property Owners</h3>
                      <p className="text-brand-text/60 text-sm">Sample investor profiles and contact history</p>
                    </div>
                    <Checkbox
                      checked={data.sampleData.owners}
                      onCheckedChange={(checked) => updateSampleData('owners', !!checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 bg-brand-bg rounded-lg border border-brand-primary/20">
                    <div>
                      <h3 className="text-brand-text font-medium">1 Entity Structure</h3>
                      <p className="text-brand-text/60 text-sm">Sample LLC with property mappings</p>
                    </div>
                    <Checkbox
                      checked={data.sampleData.entities}
                      onCheckedChange={(checked) => updateSampleData('entities', !!checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 bg-brand-bg rounded-lg border border-brand-primary/20">
                    <div>
                      <h3 className="text-brand-text font-medium">1 Cap-Rate Scenario</h3>
                      <p className="text-brand-text/60 text-sm">Investment analysis example</p>
                    </div>
                    <Checkbox
                      checked={data.sampleData.scenarios}
                      onCheckedChange={(checked) => updateSampleData('scenarios', !!checked)}
                    />
                  </div>
                </div>

                <div className="bg-brand-primary/10 p-4 rounded-lg border border-brand-primary/20">
                  <p className="text-brand-text text-sm">
                    <strong>Next:</strong> After completing setup, you'll access your Command Center dashboard with 
                    all features ready to use. You can always modify these settings later.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Navigation */}
          <div className="flex justify-between mt-8">
            <Button 
              variant="outline" 
              onClick={handlePrevious} 
              disabled={currentStep === 1}
              className="border-brand-accent text-brand-accent hover:bg-brand-accent hover:text-brand-dark"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>
            
            <Button 
              onClick={handleNext}
              className="bg-brand-primary text-brand-dark hover:bg-brand-primary/90"
            >
              {currentStep === 3 ? 'Complete Setup' : 'Next'}
              {currentStep < 3 && <ArrowRight className="h-4 w-4 ml-2" />}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RealtorOnboarding;