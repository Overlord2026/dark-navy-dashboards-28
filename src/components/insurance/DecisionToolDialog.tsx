import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Calculator, Info, ArrowRight, ArrowLeft } from 'lucide-react';
import { DecisionTool, DecisionQuestion } from '@/types/fiduciary-insurance';

interface DecisionToolDialogProps {
  tool: DecisionTool;
  open: boolean;
  onClose: () => void;
  onComplete: (results: Record<string, any>) => void;
}

export function DecisionToolDialog({ tool, open, onClose, onComplete }: DecisionToolDialogProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [results, setResults] = useState<Record<string, any> | null>(null);

  const currentQuestion = tool.questions[currentStep];
  const progress = ((currentStep + 1) / tool.questions.length) * 100;
  const isLastQuestion = currentStep === tool.questions.length - 1;

  const handleAnswer = (value: any) => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: value
    }));
  };

  const handleNext = () => {
    if (isLastQuestion) {
      calculateResults();
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const calculateResults = () => {
    // Mock calculation logic - replace with actual calculations
    let calculatedResults: Record<string, any> = {};

    if (tool.calculatorType === 'ltc-needs') {
      const age = answers.age || 65;
      const state = answers.state || 'California';
      const assets = answers.assets || 'Under $250k';
      
      const dailyCost = state === 'California' ? 350 : 
                      state === 'New York' ? 400 : 
                      state === 'Florida' ? 250 : 300;
      
      const annualCost = dailyCost * 365;
      const projectedYearsOfCare = 2.5; // Average
      const totalEstimatedCost = annualCost * projectedYearsOfCare;
      
      calculatedResults = {
        dailyCost,
        annualCost,
        totalEstimatedCost,
        recommendation: assets.includes('Under') ? 
          'LTC insurance is recommended to protect your limited assets' :
          'Consider self-insurance or hybrid products',
        monthlyPremiumEstimate: Math.round((age * 25) + (dailyCost * 0.5))
      };
    } else if (tool.calculatorType === 'medicare-eligibility') {
      const timing = answers['turning-65'] || 'Already 65+';
      const hasEmployerCoverage = answers['current-coverage'] || false;
      const budget = answers['monthly-budget'] || 'Under $200';
      
      calculatedResults = {
        recommendedPath: hasEmployerCoverage ? 
          'Delay Medicare enrollment while you have employer coverage' :
          'Enroll in Medicare during your Initial Enrollment Period',
        supplementRecommendation: budget.includes('Under') ? 
          'Consider Medicare Advantage for lower monthly costs' :
          'Medicare Supplement Plan G or N recommended',
        urgency: timing === 'Within 6 months' ? 'high' : 'medium'
      };
    } else if (tool.calculatorType === 'iul-cost') {
      const coverage = parseInt(answers['coverage-amount']?.replace(/[^\d]/g, '') || '500000');
      const age = answers.age || 45;
      const timeHorizon = answers['time-horizon'] || '20-30 years';
      
      const termPremium = Math.round(coverage * 0.001 * (age / 40));
      const iulPremium = termPremium * 8; // IUL typically 8x more expensive
      const investmentDifference = iulPremium - termPremium;
      
      calculatedResults = {
        termPremium,
        iulPremium,
        investmentDifference,
        projectedTermPlusInvesting: investmentDifference * 20 * 1.07, // 7% return assumption
        projectedIULValue: iulPremium * 20 * 1.045, // 4.5% after fees
        recommendation: 'Term life plus investing is likely better for your situation'
      };
    }

    setResults(calculatedResults);
  };

  const handleComplete = () => {
    if (results) {
      onComplete({ answers, results });
    }
    onClose();
  };

  const renderQuestion = (question: DecisionQuestion) => {
    const currentAnswer = answers[question.id];

    switch (question.type) {
      case 'number':
        return (
          <div className="space-y-2">
            <Label htmlFor={question.id}>{question.question}</Label>
            <Input
              id={question.id}
              type="number"
              value={currentAnswer || ''}
              onChange={(e) => handleAnswer(parseInt(e.target.value))}
              placeholder="Enter number"
            />
          </div>
        );

      case 'select':
        return (
          <div className="space-y-2">
            <Label>{question.question}</Label>
            <Select value={currentAnswer || ''} onValueChange={handleAnswer}>
              <SelectTrigger>
                <SelectValue placeholder="Select an option..." />
              </SelectTrigger>
              <SelectContent>
                {question.options?.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        );

      case 'boolean':
        return (
          <div className="space-y-3">
            <Label>{question.question}</Label>
            <RadioGroup value={currentAnswer?.toString() || ''} onValueChange={(value) => handleAnswer(value === 'true')}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="true" id="yes" />
                <Label htmlFor="yes">Yes</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="false" id="no" />
                <Label htmlFor="no">No</Label>
              </div>
            </RadioGroup>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Calculator className="h-5 w-5" />
            <span>{tool.title}</span>
          </DialogTitle>
        </DialogHeader>

        {!results ? (
          <div className="space-y-6">
            {/* Progress */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Question {currentStep + 1} of {tool.questions.length}</span>
                <span>{Math.round(progress)}% complete</span>
              </div>
              <Progress value={progress} className="w-full" />
            </div>

            {/* Question */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">{currentQuestion.question}</CardTitle>
                {currentQuestion.helpText && (
                  <Alert className="mt-3">
                    <Info className="h-4 w-4" />
                    <AlertDescription>{currentQuestion.helpText}</AlertDescription>
                  </Alert>
                )}
              </CardHeader>
              <CardContent>
                {renderQuestion(currentQuestion)}
              </CardContent>
            </Card>

            {/* Navigation */}
            <div className="flex justify-between">
              <Button 
                variant="outline" 
                onClick={handleBack}
                disabled={currentStep === 0}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              
              <Button 
                onClick={handleNext}
                disabled={!answers[currentQuestion.id] && currentQuestion.required}
              >
                {isLastQuestion ? 'Calculate Results' : 'Next'}
                {!isLastQuestion && <ArrowRight className="h-4 w-4 ml-2" />}
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calculator className="h-5 w-5 text-green-600" />
                  <span>Your Results</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(results).map(([key, value]) => (
                  <div key={key} className="grid grid-cols-3 gap-4 py-2 border-b last:border-0">
                    <div className="font-medium capitalize">
                      {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                    </div>
                    <div className="col-span-2 text-muted-foreground">
                      {typeof value === 'number' && key.toLowerCase().includes('cost') ? 
                        `$${value.toLocaleString()}` : 
                        value?.toString()
                      }
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setResults(null)} className="flex-1">
                Recalculate
              </Button>
              <Button onClick={handleComplete} className="flex-1">
                Get Personalized Advice
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}