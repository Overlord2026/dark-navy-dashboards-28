import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { ChevronLeft, ChevronRight, Save } from 'lucide-react';
import { stateComplianceMap } from '../stateCompliance';
import { StateComplianceCallout } from './StateComplianceCallout';

interface IntakeData {
  // Personal Information
  fullName: string;
  dateOfBirth: string;
  stateOfResidence: string;
  maritalStatus: string;
  spouseName?: string;
  
  // Family
  hasChildren: boolean;
  children: Array<{
    name: string;
    dateOfBirth: string;
    relationship: string;
  }>;
  
  // Assets
  estimatedNetWorth: string;
  hasRealEstate: boolean;
  hasBusinessOwnership: boolean;
  hasRetirementAccounts: boolean;
  specificAssets: string;
  
  // Guardianship
  primaryGuardian?: string;
  alternateGuardian?: string;
  guardianInstructions?: string;
  
  // Fiduciaries
  primaryExecutor: string;
  alternateExecutor?: string;
  primaryTrustee?: string;
  alternateTrustee?: string;
  
  // Distribution
  distributionMethod: string;
  specificBequests: string;
  charityBequests?: string;
  
  // Health Directives
  healthcareAgent: string;
  alternateHealthcareAgent?: string;
  lifeSustainPreferences: string;
  organDonation: boolean;
  additionalInstructions?: string;
}

interface EstateIntakeWizardProps {
  onComplete: (data: IntakeData) => void;
  onSaveAndContinue: (data: IntakeData) => void;
  initialData?: Partial<IntakeData>;
}

const STEPS = [
  { id: 1, title: 'Personal Information' },
  { id: 2, title: 'Family' },
  { id: 3, title: 'Assets' },
  { id: 4, title: 'Guardianship' },
  { id: 5, title: 'Fiduciaries' },
  { id: 6, title: 'Distribution' },
  { id: 7, title: 'Health Directives' }
];

export const EstateIntakeWizard: React.FC<EstateIntakeWizardProps> = ({
  onComplete,
  onSaveAndContinue,
  initialData = {}
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<IntakeData>({
    fullName: '',
    dateOfBirth: '',
    stateOfResidence: '',
    maritalStatus: '',
    hasChildren: false,
    children: [],
    estimatedNetWorth: '',
    hasRealEstate: false,
    hasBusinessOwnership: false,
    hasRetirementAccounts: false,
    specificAssets: '',
    primaryExecutor: '',
    distributionMethod: '',
    specificBequests: '',
    healthcareAgent: '',
    lifeSustainPreferences: '',
    organDonation: false,
    ...initialData
  });

  const progress = (currentStep / STEPS.length) * 100;

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const nextStep = () => {
    if (currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSaveAndContinue = () => {
    onSaveAndContinue(formData);
  };

  const handleComplete = () => {
    onComplete(formData);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="fullName">Full Legal Name *</Label>
                <Input
                  id="fullName"
                  value={formData.fullName}
                  onChange={(e) => updateFormData('fullName', e.target.value)}
                  placeholder="Enter your full legal name"
                />
              </div>
              <div>
                <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => updateFormData('dateOfBirth', e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="stateOfResidence">State of Residence *</Label>
                <Select value={formData.stateOfResidence} onValueChange={(value) => updateFormData('stateOfResidence', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your state" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(stateComplianceMap).map(state => (
                      <SelectItem key={state.code} value={state.code}>
                        {state.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="maritalStatus">Marital Status *</Label>
                <Select value={formData.maritalStatus} onValueChange={(value) => updateFormData('maritalStatus', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select marital status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="single">Single</SelectItem>
                    <SelectItem value="married">Married</SelectItem>
                    <SelectItem value="divorced">Divorced</SelectItem>
                    <SelectItem value="widowed">Widowed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {formData.maritalStatus === 'married' && (
              <div>
                <Label htmlFor="spouseName">Spouse's Full Name</Label>
                <Input
                  id="spouseName"
                  value={formData.spouseName || ''}
                  onChange={(e) => updateFormData('spouseName', e.target.value)}
                  placeholder="Enter spouse's full legal name"
                />
              </div>
            )}

            {formData.stateOfResidence && (
              <StateComplianceCallout stateCode={formData.stateOfResidence} />
            )}
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="hasChildren"
                checked={formData.hasChildren}
                onCheckedChange={(checked) => updateFormData('hasChildren', checked)}
              />
              <Label htmlFor="hasChildren">I have children or dependents</Label>
            </div>

            {formData.hasChildren && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium">Children/Dependents</h4>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const newChildren = [...formData.children, { name: '', dateOfBirth: '', relationship: 'child' }];
                      updateFormData('children', newChildren);
                    }}
                  >
                    Add Child
                  </Button>
                </div>

                {formData.children.map((child, index) => (
                  <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border rounded-lg">
                    <div>
                      <Label>Name</Label>
                      <Input
                        value={child.name}
                        onChange={(e) => {
                          const newChildren = [...formData.children];
                          newChildren[index].name = e.target.value;
                          updateFormData('children', newChildren);
                        }}
                        placeholder="Child's name"
                      />
                    </div>
                    <div>
                      <Label>Date of Birth</Label>
                      <Input
                        type="date"
                        value={child.dateOfBirth}
                        onChange={(e) => {
                          const newChildren = [...formData.children];
                          newChildren[index].dateOfBirth = e.target.value;
                          updateFormData('children', newChildren);
                        }}
                      />
                    </div>
                    <div>
                      <Label>Relationship</Label>
                      <Select
                        value={child.relationship}
                        onValueChange={(value) => {
                          const newChildren = [...formData.children];
                          newChildren[index].relationship = value;
                          updateFormData('children', newChildren);
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="child">Child</SelectItem>
                          <SelectItem value="stepchild">Stepchild</SelectItem>
                          <SelectItem value="adopted">Adopted Child</SelectItem>
                          <SelectItem value="dependent">Dependent</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <Label htmlFor="estimatedNetWorth">Estimated Net Worth *</Label>
              <Select value={formData.estimatedNetWorth} onValueChange={(value) => updateFormData('estimatedNetWorth', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select net worth range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="under_100k">Under $100,000</SelectItem>
                  <SelectItem value="100k_500k">$100,000 - $500,000</SelectItem>
                  <SelectItem value="500k_1m">$500,000 - $1,000,000</SelectItem>
                  <SelectItem value="1m_5m">$1,000,000 - $5,000,000</SelectItem>
                  <SelectItem value="over_5m">Over $5,000,000</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium">Asset Types (check all that apply)</h4>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="hasRealEstate"
                  checked={formData.hasRealEstate}
                  onCheckedChange={(checked) => updateFormData('hasRealEstate', checked)}
                />
                <Label htmlFor="hasRealEstate">Real Estate</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="hasBusinessOwnership"
                  checked={formData.hasBusinessOwnership}
                  onCheckedChange={(checked) => updateFormData('hasBusinessOwnership', checked)}
                />
                <Label htmlFor="hasBusinessOwnership">Business Ownership</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="hasRetirementAccounts"
                  checked={formData.hasRetirementAccounts}
                  onCheckedChange={(checked) => updateFormData('hasRetirementAccounts', checked)}
                />
                <Label htmlFor="hasRetirementAccounts">Retirement Accounts (401k, IRA, etc.)</Label>
              </div>
            </div>

            <div>
              <Label htmlFor="specificAssets">Specific Assets or Special Considerations</Label>
              <Textarea
                id="specificAssets"
                value={formData.specificAssets}
                onChange={(e) => updateFormData('specificAssets', e.target.value)}
                placeholder="Describe any specific assets, collections, or special considerations..."
                rows={4}
              />
            </div>
          </div>
        );

      // Additional steps 4-7 would be implemented similarly...
      // For brevity, showing the pattern for the remaining steps

      default:
        return (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Step {currentStep} content</p>
          </div>
        );
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Progress Header */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Estate Planning Intake</h2>
          <div className="text-sm text-muted-foreground">
            Step {currentStep} of {STEPS.length}
          </div>
        </div>
        <Progress value={progress} className="h-2" />
        <div className="flex justify-center">
          <h3 className="text-lg font-medium">{STEPS[currentStep - 1].title}</h3>
        </div>
      </div>

      {/* Form Content */}
      <Card>
        <CardHeader>
          <CardTitle>{STEPS[currentStep - 1].title}</CardTitle>
        </CardHeader>
        <CardContent>
          {renderStepContent()}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between items-center">
        <Button
          variant="outline"
          onClick={prevStep}
          disabled={currentStep === 1}
          className="flex items-center gap-2"
        >
          <ChevronLeft className="h-4 w-4" />
          Previous
        </Button>

        <Button
          variant="ghost"
          onClick={handleSaveAndContinue}
          className="flex items-center gap-2"
        >
          <Save className="h-4 w-4" />
          Save & Continue Later
        </Button>

        {currentStep === STEPS.length ? (
          <Button onClick={handleComplete} className="flex items-center gap-2">
            Complete Intake
            <ChevronRight className="h-4 w-4" />
          </Button>
        ) : (
          <Button onClick={nextStep} className="flex items-center gap-2">
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
};