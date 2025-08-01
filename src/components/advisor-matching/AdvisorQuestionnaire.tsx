import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Search, ArrowRight, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

interface QuestionnaireData {
  annual_income: string;
  states_with_income: string[];
  has_equity_comp: string;
  owns_business: string;
  international_income: string;
  net_worth: string;
  budget_range: string;
  preferred_meeting_type: string;
  timeline: string;
  estate_planning: string;
  charitable_giving: string;
  investment_planning: string;
  specific_needs: string;
}

interface AdvisorQuestionnaireProps {
  onComplete: (responses: QuestionnaireData) => void;
  loading?: boolean;
}

const STEPS = [
  { id: 'income', title: 'Income & Assets', description: 'Tell us about your financial situation' },
  { id: 'complexity', title: 'Tax Complexity', description: 'Help us understand your tax needs' },
  { id: 'preferences', title: 'Preferences', description: 'Your meeting and budget preferences' },
  { id: 'planning', title: 'Planning Needs', description: 'Areas where you need assistance' }
];

const US_STATES = [
  'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
  'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
  'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
  'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
  'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
];

export function AdvisorQuestionnaire({ onComplete, loading = false }: AdvisorQuestionnaireProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<QuestionnaireData>({
    annual_income: '',
    states_with_income: [],
    has_equity_comp: '',
    owns_business: '',
    international_income: '',
    net_worth: '',
    budget_range: '',
    preferred_meeting_type: '',
    timeline: '',
    estate_planning: '',
    charitable_giving: '',
    investment_planning: '',
    specific_needs: ''
  });

  const progress = ((currentStep + 1) / STEPS.length) * 100;

  const updateFormData = (field: keyof QuestionnaireData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleStateToggle = (state: string, checked: boolean) => {
    const currentStates = formData.states_with_income;
    if (checked) {
      updateFormData('states_with_income', [...currentStates, state]);
    } else {
      updateFormData('states_with_income', currentStates.filter(s => s !== state));
    }
  };

  const nextStep = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    // Validate required fields
    if (!formData.annual_income || !formData.budget_range || !formData.preferred_meeting_type) {
      toast.error('Please complete all required fields');
      return;
    }

    onComplete(formData);
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 0:
        return formData.annual_income && formData.states_with_income.length > 0;
      case 1:
        return formData.has_equity_comp && formData.owns_business;
      case 2:
        return formData.budget_range && formData.preferred_meeting_type && formData.timeline;
      case 3:
        return true;
      default:
        return false;
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="annual_income">Annual Income *</Label>
              <Select value={formData.annual_income} onValueChange={(value) => updateFormData('annual_income', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select income range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="under_50k">Under $50,000</SelectItem>
                  <SelectItem value="50k_100k">$50,000 - $100,000</SelectItem>
                  <SelectItem value="100k_250k">$100,000 - $250,000</SelectItem>
                  <SelectItem value="250k_500k">$250,000 - $500,000</SelectItem>
                  <SelectItem value="500k_1m">$500,000 - $1,000,000</SelectItem>
                  <SelectItem value="over_1m">Over $1,000,000</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>States with Income *</Label>
              <div className="grid grid-cols-5 gap-2 max-h-40 overflow-y-auto border rounded p-3">
                {US_STATES.map(state => (
                  <div key={state} className="flex items-center space-x-2">
                    <Checkbox
                      id={state}
                      checked={formData.states_with_income.includes(state)}
                      onCheckedChange={(checked) => handleStateToggle(state, checked as boolean)}
                    />
                    <Label htmlFor={state} className="text-sm">{state}</Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="net_worth">Estimated Net Worth</Label>
              <Select value={formData.net_worth} onValueChange={(value) => updateFormData('net_worth', value)}>
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
          </div>
        );

      case 1:
        return (
          <div className="space-y-6">
            <div className="space-y-3">
              <Label>Do you have equity compensation (stock options, RSUs, ESPP)?</Label>
              <RadioGroup value={formData.has_equity_comp} onValueChange={(value) => updateFormData('has_equity_comp', value)}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="true" id="equity_yes" />
                  <Label htmlFor="equity_yes">Yes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="false" id="equity_no" />
                  <Label htmlFor="equity_no">No</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-3">
              <Label>Do you own a business?</Label>
              <RadioGroup value={formData.owns_business} onValueChange={(value) => updateFormData('owns_business', value)}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="true" id="business_yes" />
                  <Label htmlFor="business_yes">Yes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="false" id="business_no" />
                  <Label htmlFor="business_no">No</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-3">
              <Label>Do you have international income or assets?</Label>
              <RadioGroup value={formData.international_income} onValueChange={(value) => updateFormData('international_income', value)}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="true" id="intl_yes" />
                  <Label htmlFor="intl_yes">Yes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="false" id="intl_no" />
                  <Label htmlFor="intl_no">No</Label>
                </div>
              </RadioGroup>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label>Budget Range (per hour) *</Label>
              <Select value={formData.budget_range} onValueChange={(value) => updateFormData('budget_range', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select budget range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="under_200">Under $200/hour</SelectItem>
                  <SelectItem value="200_400">$200 - $400/hour</SelectItem>
                  <SelectItem value="400_600">$400 - $600/hour</SelectItem>
                  <SelectItem value="over_600">Over $600/hour</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Preferred Meeting Type *</Label>
              <Select value={formData.preferred_meeting_type} onValueChange={(value) => updateFormData('preferred_meeting_type', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="How would you like to meet?" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="video">Video call</SelectItem>
                  <SelectItem value="phone">Phone call</SelectItem>
                  <SelectItem value="in_person">In-person</SelectItem>
                  <SelectItem value="any">Any method</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Timeline *</Label>
              <Select value={formData.timeline} onValueChange={(value) => updateFormData('timeline', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="When do you need assistance?" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="immediate">Within 1 week</SelectItem>
                  <SelectItem value="soon">Within 1 month</SelectItem>
                  <SelectItem value="flexible">Within 3 months</SelectItem>
                  <SelectItem value="planning">Just planning ahead</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="space-y-3">
              <Label>Estate Planning Needs</Label>
              <RadioGroup value={formData.estate_planning} onValueChange={(value) => updateFormData('estate_planning', value)}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="true" id="estate_yes" />
                  <Label htmlFor="estate_yes">Yes, I need estate planning assistance</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="false" id="estate_no" />
                  <Label htmlFor="estate_no">No, not at this time</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-3">
              <Label>Charitable Giving</Label>
              <RadioGroup value={formData.charitable_giving} onValueChange={(value) => updateFormData('charitable_giving', value)}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="true" id="charity_yes" />
                  <Label htmlFor="charity_yes">Yes, I want to optimize charitable giving</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="false" id="charity_no" />
                  <Label htmlFor="charity_no">No, not applicable</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-3">
              <Label>Investment Tax Planning</Label>
              <RadioGroup value={formData.investment_planning} onValueChange={(value) => updateFormData('investment_planning', value)}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="true" id="invest_yes" />
                  <Label htmlFor="invest_yes">Yes, I need investment tax strategies</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="false" id="invest_no" />
                  <Label htmlFor="invest_no">No, not needed</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label htmlFor="specific_needs">Specific Needs or Questions</Label>
              <textarea
                id="specific_needs"
                className="w-full p-3 border rounded-md resize-none"
                rows={4}
                placeholder="Tell us about any specific tax situations or questions you have..."
                value={formData.specific_needs}
                onChange={(e) => updateFormData('specific_needs', e.target.value)}
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center gap-3 mb-4">
          <Search className="h-6 w-6 text-primary" />
          <div>
            <CardTitle>Find Your Tax Specialist</CardTitle>
            <CardDescription>
              {STEPS[currentStep].description}
            </CardDescription>
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Step {currentStep + 1} of {STEPS.length}: {STEPS[currentStep].title}</span>
            <span>{Math.round(progress)}% complete</span>
          </div>
          <Progress value={progress} className="w-full" />
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {renderStep()}

        <div className="flex justify-between pt-6">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 0}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>

          {currentStep === STEPS.length - 1 ? (
            <Button
              onClick={handleSubmit}
              disabled={loading}
              className="min-w-[120px]"
            >
              {loading ? 'Finding Matches...' : 'Find My Specialist'}
              <Search className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button
              onClick={nextStep}
              disabled={!isStepValid()}
            >
              Next
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}