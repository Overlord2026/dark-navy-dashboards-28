import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { MainLayout } from '@/components/layout/MainLayout';
import { FileText, Users, DollarSign, Calendar, CheckCircle } from 'lucide-react';

export default function NewProposalPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;
  
  const [proposalData, setProposalData] = useState({
    clientName: '',
    clientEmail: '',
    proposalType: '',
    investmentAmount: '',
    riskTolerance: '',
    timeHorizon: '',
    objectives: '',
    notes: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setProposalData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSave = () => {
    // TODO: Implement proposal save to Supabase
    console.log('Saving proposal:', proposalData);
  };

  const progressPercent = (currentStep / totalSteps) * 100;

  return (
    <MainLayout>
      <div className="container mx-auto p-6 max-w-4xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Create New Proposal</h1>
          <p className="text-muted-foreground">
            Build a comprehensive investment proposal for your client
          </p>
        </div>

        {/* Progress Bar */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Step {currentStep} of {totalSteps}</span>
              <span className="text-sm text-muted-foreground">{Math.round(progressPercent)}% Complete</span>
            </div>
            <Progress value={progressPercent} className="w-full" />
          </CardContent>
        </Card>

        {/* Step Content */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {currentStep === 1 && <Users className="h-5 w-5" />}
              {currentStep === 2 && <DollarSign className="h-5 w-5" />}
              {currentStep === 3 && <FileText className="h-5 w-5" />}
              {currentStep === 4 && <CheckCircle className="h-5 w-5" />}
              
              {currentStep === 1 && "Client Information"}
              {currentStep === 2 && "Investment Details"}
              {currentStep === 3 && "Proposal Strategy"}
              {currentStep === 4 && "Review & Submit"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            
            {/* Step 1: Client Information */}
            {currentStep === 1 && (
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="clientName">Client Name</Label>
                  <Input
                    id="clientName"
                    value={proposalData.clientName}
                    onChange={(e) => handleInputChange('clientName', e.target.value)}
                    placeholder="Enter client's full name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="clientEmail">Client Email</Label>
                  <Input
                    id="clientEmail"
                    type="email"
                    value={proposalData.clientEmail}
                    onChange={(e) => handleInputChange('clientEmail', e.target.value)}
                    placeholder="client@example.com"
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="proposalType">Proposal Type</Label>
                  <Select onValueChange={(value) => handleInputChange('proposalType', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select proposal type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="comprehensive">Comprehensive Portfolio</SelectItem>
                      <SelectItem value="retirement">Retirement Planning</SelectItem>
                      <SelectItem value="tax-optimization">Tax Optimization</SelectItem>
                      <SelectItem value="estate-planning">Estate Planning</SelectItem>
                      <SelectItem value="education-funding">Education Funding</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {/* Step 2: Investment Details */}
            {currentStep === 2 && (
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="investmentAmount">Investment Amount</Label>
                  <Input
                    id="investmentAmount"
                    type="number"
                    value={proposalData.investmentAmount}
                    onChange={(e) => handleInputChange('investmentAmount', e.target.value)}
                    placeholder="Enter amount"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timeHorizon">Time Horizon</Label>
                  <Select onValueChange={(value) => handleInputChange('timeHorizon', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select time horizon" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="short">Short-term (1-3 years)</SelectItem>
                      <SelectItem value="medium">Medium-term (3-10 years)</SelectItem>
                      <SelectItem value="long">Long-term (10+ years)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="riskTolerance">Risk Tolerance</Label>
                  <Select onValueChange={(value) => handleInputChange('riskTolerance', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select risk tolerance" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="conservative">Conservative</SelectItem>
                      <SelectItem value="moderate">Moderate</SelectItem>
                      <SelectItem value="aggressive">Aggressive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {/* Step 3: Proposal Strategy */}
            {currentStep === 3 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="objectives">Investment Objectives</Label>
                  <Textarea
                    id="objectives"
                    value={proposalData.objectives}
                    onChange={(e) => handleInputChange('objectives', e.target.value)}
                    placeholder="Describe the client's investment objectives and goals..."
                    rows={4}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notes">Additional Notes</Label>
                  <Textarea
                    id="notes"
                    value={proposalData.notes}
                    onChange={(e) => handleInputChange('notes', e.target.value)}
                    placeholder="Any additional notes or special considerations..."
                    rows={3}
                  />
                </div>
              </div>
            )}

            {/* Step 4: Review & Submit */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div className="bg-muted/50 p-4 rounded-lg">
                  <h3 className="font-semibold mb-3">Proposal Summary</h3>
                  <div className="grid gap-2 text-sm">
                    <div className="flex justify-between">
                      <span>Client:</span>
                      <span>{proposalData.clientName || 'Not specified'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Email:</span>
                      <span>{proposalData.clientEmail || 'Not specified'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Type:</span>
                      <span>{proposalData.proposalType || 'Not specified'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Investment Amount:</span>
                      <span>${proposalData.investmentAmount ? Number(proposalData.investmentAmount).toLocaleString() : 'Not specified'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Risk Tolerance:</span>
                      <span>{proposalData.riskTolerance || 'Not specified'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Time Horizon:</span>
                      <span>{proposalData.timeHorizon || 'Not specified'}</span>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 border border-amber-200 bg-amber-50 rounded-lg">
                  <p className="text-sm text-amber-800">
                    <strong>Note:</strong> This proposal will be saved as a draft and can be edited before sending to the client.
                  </p>
                </div>
              </div>
            )}

            <Separator />

            {/* Navigation Buttons */}
            <div className="flex justify-between">
              <Button 
                variant="outline" 
                onClick={handlePrevious}
                disabled={currentStep === 1}
              >
                Previous
              </Button>
              
              <div className="flex gap-2">
                <Button variant="outline" onClick={handleSave}>
                  Save Draft
                </Button>
                
                {currentStep === totalSteps ? (
                  <Button onClick={handleSave}>
                    Create Proposal
                  </Button>
                ) : (
                  <Button onClick={handleNext}>
                    Next
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}