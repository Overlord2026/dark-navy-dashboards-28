import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Play, 
  ArrowRight, 
  ArrowLeft, 
  Home, 
  Users, 
  DollarSign, 
  PiggyBank,
  Building,
  Target,
  Shield,
  FileText,
  Settings
} from 'lucide-react';

interface IntakeData {
  // Step 2: Personal Info
  name: string;
  dateOfBirth: string;
  maritalStatus: string;
  state: string;
  beneficiaries: Array<{ name: string; relationship: string }>;
  
  // Step 3: Income Sources
  incomeSources: Array<{
    type: string;
    amount: number;
    startDate: string;
    cola: number;
  }>;
  
  // Step 4: Accounts
  accounts: Array<{
    type: string;
    balance: number;
    annualContribution: number;
    growthRate: number;
  }>;
  
  // Step 5: Properties
  properties: Array<{
    type: string;
    value: number;
    income: number;
  }>;
  
  // Step 6: Expenses & Goals
  monthlyEssentials: number;
  discretionarySpend: number;
  travelBudget: number;
  oneOffGoals: Array<{ description: string; amount: number; targetDate: string }>;
  
  // Step 7: Insurance
  insurance: {
    life: { coverage: number; premium: number };
    ltc: { coverage: number; premium: number };
    disability: { coverage: number; premium: number };
  };
  
  // Step 8: Tax & Legal
  currentTaxBracket: string;
  rothConversionThreshold: number;
  estateDocuments: string[];
  
  // Step 9: Scenarios
  selectedScenarios: string[];
}

const steps = [
  { id: 1, title: 'Welcome', icon: Home, description: 'Introduction to SWAG GPS' },
  { id: 2, title: 'Personal Info', icon: Users, description: 'Basic details & beneficiaries' },
  { id: 3, title: 'Income Sources', icon: DollarSign, description: 'Social Security, pensions, annuities' },
  { id: 4, title: 'Accounts', icon: PiggyBank, description: 'Investment accounts & contributions' },
  { id: 5, title: 'Properties', icon: Building, description: 'Real estate & other assets' },
  { id: 6, title: 'Goals', icon: Target, description: 'Expenses & future goals' },
  { id: 7, title: 'Insurance', icon: Shield, description: 'Life, LTC, disability coverage' },
  { id: 8, title: 'Tax & Legal', icon: FileText, description: 'Tax planning & estate docs' },
  { id: 9, title: 'Scenarios', icon: Settings, description: 'Stress test scenarios' }
];

const swagPhases = [
  { name: 'Income Now', years: '1-2', color: 'bg-blue-500', description: 'Immediate income needs and stability' },
  { name: 'Income Later', years: '3-12', color: 'bg-green-500', description: 'Bridge to full retirement income' },
  { name: 'Growth', years: '12+', color: 'bg-purple-500', description: 'Long-term wealth accumulation' },
  { name: 'Legacy', years: 'Ongoing', color: 'bg-orange-500', description: 'Estate and wealth transfer' }
];

export const SWAGRetirementIntake = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [intakeData, setIntakeData] = useState<IntakeData>({
    name: '',
    dateOfBirth: '',
    maritalStatus: '',
    state: '',
    beneficiaries: [{ name: '', relationship: '' }],
    incomeSources: [],
    accounts: [],
    properties: [],
    monthlyEssentials: 0,
    discretionarySpend: 0,
    travelBudget: 0,
    oneOffGoals: [],
    insurance: {
      life: { coverage: 0, premium: 0 },
      ltc: { coverage: 0, premium: 0 },
      disability: { coverage: 0, premium: 0 }
    },
    currentTaxBracket: '',
    rothConversionThreshold: 0,
    estateDocuments: [],
    selectedScenarios: []
  });

  const progress = (currentStep / steps.length) * 100;

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    } else {
      // Submit and navigate to results
      console.log('Submitting intake data:', intakeData);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const addBeneficiary = () => {
    setIntakeData(prev => ({
      ...prev,
      beneficiaries: [...prev.beneficiaries, { name: '', relationship: '' }]
    }));
  };

  const addIncomeSource = () => {
    setIntakeData(prev => ({
      ...prev,
      incomeSources: [...prev.incomeSources, { type: '', amount: 0, startDate: '', cola: 0 }]
    }));
  };

  const addAccount = () => {
    setIntakeData(prev => ({
      ...prev,
      accounts: [...prev.accounts, { type: '', balance: 0, annualContribution: 0, growthRate: 0 }]
    }));
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-4">Welcome to Your SWAG GPS Retirement Roadmap</h2>
              <p className="text-lg text-muted-foreground mb-6">
                Get a comprehensive retirement plan using our proprietary 4-phase system
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              {swagPhases.map((phase, index) => (
                <Card key={index} className="text-center">
                  <CardContent className="pt-6">
                    <div className={`w-12 h-12 ${phase.color} rounded-full mx-auto mb-3 flex items-center justify-center text-white font-bold`}>
                      {index + 1}
                    </div>
                    <h3 className="font-semibold">{phase.name}</h3>
                    <p className="text-sm text-muted-foreground">{phase.years}</p>
                    <p className="text-xs mt-2">{phase.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="bg-primary/5">
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-3">What You'll Get:</h3>
                <ul className="space-y-2 text-sm">
                  <li>✓ Monte Carlo success probability analysis</li>
                  <li>✓ Tax optimization and Roth conversion strategies</li>
                  <li>✓ Estate planning recommendations</li>
                  <li>✓ Stress test scenarios (market downturns, LTC events)</li>
                  <li>✓ Personalized advisor follow-up</li>
                </ul>
              </CardContent>
            </Card>

            <div className="text-center">
              <div className="w-full max-w-md mx-auto mb-4">
                <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                  <Play className="h-12 w-12 text-primary" />
                  <span className="ml-2 text-sm">SWAG GPS Explainer Video</span>
                </div>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Personal & Household Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={intakeData.name}
                  onChange={(e) => setIntakeData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter your full name"
                />
              </div>
              
              <div>
                <Label htmlFor="dob">Date of Birth</Label>
                <Input
                  id="dob"
                  type="date"
                  value={intakeData.dateOfBirth}
                  onChange={(e) => setIntakeData(prev => ({ ...prev, dateOfBirth: e.target.value }))}
                />
              </div>

              <div>
                <Label htmlFor="marital">Marital Status</Label>
                <Select value={intakeData.maritalStatus} onValueChange={(value) => setIntakeData(prev => ({ ...prev, maritalStatus: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="single">Single</SelectItem>
                    <SelectItem value="married">Married</SelectItem>
                    <SelectItem value="divorced">Divorced</SelectItem>
                    <SelectItem value="widowed">Widowed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="state">State of Residence</Label>
                <Select value={intakeData.state} onValueChange={(value) => setIntakeData(prev => ({ ...prev, state: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select state" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CA">California</SelectItem>
                    <SelectItem value="NY">New York</SelectItem>
                    <SelectItem value="TX">Texas</SelectItem>
                    <SelectItem value="FL">Florida</SelectItem>
                    {/* Add more states */}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <Label>Beneficiaries</Label>
                <Button variant="outline" size="sm" onClick={addBeneficiary}>
                  Add Beneficiary
                </Button>
              </div>
              
              <div className="space-y-3">
                {intakeData.beneficiaries.map((beneficiary, index) => (
                  <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <Input
                      placeholder="Beneficiary name"
                      value={beneficiary.name}
                      onChange={(e) => {
                        const updated = [...intakeData.beneficiaries];
                        updated[index].name = e.target.value;
                        setIntakeData(prev => ({ ...prev, beneficiaries: updated }));
                      }}
                    />
                    <Input
                      placeholder="Relationship"
                      value={beneficiary.relationship}
                      onChange={(e) => {
                        const updated = [...intakeData.beneficiaries];
                        updated[index].relationship = e.target.value;
                        setIntakeData(prev => ({ ...prev, beneficiaries: updated }));
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Income Sources</h2>
              <Button variant="outline" onClick={addIncomeSource}>
                Add Income Source
              </Button>
            </div>

            <div className="space-y-4">
              {intakeData.incomeSources.map((source, index) => (
                <Card key={index}>
                  <CardContent className="pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div>
                        <Label>Income Type</Label>
                        <Select value={source.type} onValueChange={(value) => {
                          const updated = [...intakeData.incomeSources];
                          updated[index].type = value;
                          setIntakeData(prev => ({ ...prev, incomeSources: updated }));
                        }}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="social_security">Social Security</SelectItem>
                            <SelectItem value="pension">Pension</SelectItem>
                            <SelectItem value="annuity">Annuity</SelectItem>
                            <SelectItem value="rental">Rental Income</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Label>Annual Amount</Label>
                        <Input
                          type="number"
                          placeholder="$0"
                          value={source.amount}
                          onChange={(e) => {
                            const updated = [...intakeData.incomeSources];
                            updated[index].amount = Number(e.target.value);
                            setIntakeData(prev => ({ ...prev, incomeSources: updated }));
                          }}
                        />
                      </div>

                      <div>
                        <Label>Start Date</Label>
                        <Input
                          type="date"
                          value={source.startDate}
                          onChange={(e) => {
                            const updated = [...intakeData.incomeSources];
                            updated[index].startDate = e.target.value;
                            setIntakeData(prev => ({ ...prev, incomeSources: updated }));
                          }}
                        />
                      </div>

                      <div>
                        <Label>COLA (%)</Label>
                        <Input
                          type="number"
                          placeholder="2.5"
                          step="0.1"
                          value={source.cola}
                          onChange={(e) => {
                            const updated = [...intakeData.incomeSources];
                            updated[index].cola = Number(e.target.value);
                            setIntakeData(prev => ({ ...prev, incomeSources: updated }));
                          }}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {intakeData.incomeSources.length === 0 && (
              <Card className="border-dashed">
                <CardContent className="pt-6 text-center">
                  <p className="text-muted-foreground">No income sources added yet</p>
                  <Button variant="outline" className="mt-2" onClick={addIncomeSource}>
                    Add Your First Income Source
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        );

      case 9:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Scenario Selection</h2>
            <p className="text-muted-foreground">
              Select up to 3 scenarios to stress test your retirement plan
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { id: 'early_retirement', name: 'Early Retirement', description: 'Retire 2-5 years earlier than planned' },
                { id: 'market_downturn', name: 'Market Downturn', description: '2008-style market crash in first 5 years' },
                { id: 'inheritance', name: 'Unexpected Inheritance', description: 'Receive $500K inheritance at age 70' },
                { id: 'ltc_event', name: 'Long-Term Care Event', description: 'Need 3+ years of LTC services' },
                { id: 'roth_conversion', name: 'Aggressive Roth Conversions', description: 'Convert traditional to Roth IRA' },
                { id: 'healthcare_costs', name: 'High Healthcare Costs', description: '50% higher medical expenses' }
              ].map((scenario) => (
                <Card
                  key={scenario.id}
                  className={`cursor-pointer transition-colors ${
                    intakeData.selectedScenarios.includes(scenario.id) 
                      ? 'border-primary bg-primary/5' 
                      : 'hover:border-primary/50'
                  }`}
                  onClick={() => {
                    const isSelected = intakeData.selectedScenarios.includes(scenario.id);
                    let updated: string[];
                    
                    if (isSelected) {
                      updated = intakeData.selectedScenarios.filter(id => id !== scenario.id);
                    } else if (intakeData.selectedScenarios.length < 3) {
                      updated = [...intakeData.selectedScenarios, scenario.id];
                    } else {
                      return; // Max 3 scenarios
                    }
                    
                    setIntakeData(prev => ({ ...prev, selectedScenarios: updated }));
                  }}
                >
                  <CardContent className="pt-6">
                    <div className="flex items-start space-x-3">
                      <Checkbox 
                        checked={intakeData.selectedScenarios.includes(scenario.id)}
                        disabled={!intakeData.selectedScenarios.includes(scenario.id) && intakeData.selectedScenarios.length >= 3}
                      />
                      <div>
                        <h3 className="font-semibold">{scenario.name}</h3>
                        <p className="text-sm text-muted-foreground">{scenario.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="text-center">
              <Badge variant="outline">
                {intakeData.selectedScenarios.length} of 3 scenarios selected
              </Badge>
            </div>
          </div>
        );

      default:
        return (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Step {currentStep} content coming soon...</p>
          </div>
        );
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-xl font-semibold">SWAG GPS Retirement Roadmap</h1>
          <span className="text-sm text-muted-foreground">
            Step {currentStep} of {steps.length}
          </span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Step Navigation */}
      <div className="flex items-center justify-center mb-8 overflow-x-auto">
        <div className="flex space-x-2">
          {steps.map((step) => {
            const Icon = step.icon;
            const isActive = step.id === currentStep;
            const isCompleted = step.id < currentStep;
            
            return (
              <div
                key={step.id}
                className={`flex flex-col items-center p-2 rounded-lg min-w-[80px] ${
                  isActive ? 'bg-primary text-primary-foreground' :
                  isCompleted ? 'bg-primary/10 text-primary' :
                  'bg-muted text-muted-foreground'
                }`}
              >
                <Icon className="h-5 w-5 mb-1" />
                <span className="text-xs font-medium">{step.title}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Step Content */}
      <Card className="mb-8">
        <CardContent className="pt-6">
          {renderStep()}
        </CardContent>
      </Card>

      {/* Navigation Buttons */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentStep === 1}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Previous
        </Button>

        <Button onClick={handleNext}>
          {currentStep === steps.length ? 'Generate Roadmap' : 'Next'}
          {currentStep < steps.length && <ArrowRight className="h-4 w-4 ml-2" />}
        </Button>
      </div>
    </div>
  );
};