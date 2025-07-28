import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { 
  CheckCircle, 
  AlertTriangle, 
  XCircle, 
  MapPin, 
  Calendar,
  Home,
  CreditCard,
  Vote,
  Car,
  Plane
} from 'lucide-react';
import { toast } from 'sonner';

interface AssessmentQuestion {
  id: string;
  question: string;
  type: 'radio' | 'number' | 'text';
  options?: string[];
  required: boolean;
  category: string;
  weight: number;
}

const assessmentQuestions: AssessmentQuestion[] = [
  {
    id: 'target_state',
    question: 'Which state are you establishing residency in?',
    type: 'radio',
    options: ['Florida', 'Texas', 'Tennessee', 'Nevada', 'Wyoming', 'Other'],
    required: true,
    category: 'Basic Info',
    weight: 0
  },
  {
    id: 'days_in_state',
    question: 'How many days per year do you spend in your new state?',
    type: 'number',
    required: true,
    category: 'Physical Presence',
    weight: 25
  },
  {
    id: 'primary_home',
    question: 'Where is your primary residence located?',
    type: 'radio',
    options: ['New state', 'Former state', 'Split between states', 'Multiple properties'],
    required: true,
    category: 'Domicile',
    weight: 20
  },
  {
    id: 'drivers_license',
    question: 'Have you updated your driver\'s license to your new state?',
    type: 'radio',
    options: ['Yes, within 30 days of move', 'Yes, but after 30 days', 'No, still have old state license'],
    required: true,
    category: 'Documentation',
    weight: 15
  },
  {
    id: 'voter_registration',
    question: 'Have you updated your voter registration?',
    type: 'radio',
    options: ['Yes, registered in new state only', 'Yes, but still registered in old state too', 'No, not updated'],
    required: true,
    category: 'Documentation',
    weight: 10
  },
  {
    id: 'bank_accounts',
    question: 'Where are your primary bank accounts located?',
    type: 'radio',
    options: ['New state', 'Former state', 'Mix of both states', 'National banks'],
    required: true,
    category: 'Financial',
    weight: 10
  },
  {
    id: 'tax_returns',
    question: 'Where did you file your last tax return as a resident?',
    type: 'radio',
    options: ['New state only', 'Former state only', 'Both states', 'Uncertain'],
    required: true,
    category: 'Tax',
    weight: 20
  }
];

export function ResidencyAssessment() {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showResults, setShowResults] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const handleAnswerChange = (questionId: string, value: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const calculateScore = () => {
    let totalScore = 0;
    let maxScore = 0;

    assessmentQuestions.forEach(question => {
      if (question.weight > 0) {
        maxScore += question.weight;
        const answer = answers[question.id];
        
        if (answer) {
          switch (question.id) {
            case 'days_in_state':
              const days = parseInt(answer);
              if (days >= 183) totalScore += question.weight;
              else if (days >= 150) totalScore += question.weight * 0.8;
              else if (days >= 120) totalScore += question.weight * 0.6;
              else totalScore += question.weight * 0.3;
              break;
              
            case 'primary_home':
              if (answer === 'New state') totalScore += question.weight;
              else if (answer === 'Split between states') totalScore += question.weight * 0.5;
              break;
              
            case 'drivers_license':
              if (answer === 'Yes, within 30 days of move') totalScore += question.weight;
              else if (answer === 'Yes, but after 30 days') totalScore += question.weight * 0.7;
              break;
              
            case 'voter_registration':
              if (answer === 'Yes, registered in new state only') totalScore += question.weight;
              break;
              
            case 'bank_accounts':
              if (answer === 'New state') totalScore += question.weight;
              else if (answer === 'National banks') totalScore += question.weight * 0.8;
              else if (answer === 'Mix of both states') totalScore += question.weight * 0.5;
              break;
              
            case 'tax_returns':
              if (answer === 'New state only') totalScore += question.weight;
              else if (answer === 'Both states') totalScore += question.weight * 0.3;
              break;
          }
        }
      }
    });

    return Math.round((totalScore / maxScore) * 100);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreIcon = (score: number) => {
    if (score >= 80) return <CheckCircle className="h-6 w-6 text-green-600" />;
    if (score >= 60) return <AlertTriangle className="h-6 w-6 text-yellow-600" />;
    return <XCircle className="h-6 w-6 text-red-600" />;
  };

  const getRiskLevel = (score: number) => {
    if (score >= 80) return { level: 'Low Risk', color: 'bg-green-100 text-green-800' };
    if (score >= 60) return { level: 'Medium Risk', color: 'bg-yellow-100 text-yellow-800' };
    return { level: 'High Risk', color: 'bg-red-100 text-red-800' };
  };

  const handleSubmit = () => {
    const requiredQuestions = assessmentQuestions.filter(q => q.required);
    const unanswered = requiredQuestions.filter(q => !answers[q.id]);
    
    if (unanswered.length > 0) {
      toast.error(`Please answer all required questions (${unanswered.length} remaining)`);
      return;
    }

    setShowResults(true);
  };

  const handleDownloadReport = () => {
    const score = calculateScore();
    const riskLevel = getRiskLevel(score);
    
    toast.success(`Generating your personalized ${riskLevel.level} residency report...`);
    // Here you would generate and download the PDF report
  };

  if (showResults) {
    const score = calculateScore();
    const riskLevel = getRiskLevel(score);
    const targetState = answers.target_state;

    return (
      <div className="space-y-6">
        <Card>
          <CardHeader className="text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              {getScoreIcon(score)}
              <CardTitle className="text-2xl">Your Residency Score</CardTitle>
            </div>
            <div className={`text-4xl font-bold ${getScoreColor(score)}`}>
              {score}/100
            </div>
            <Badge className={riskLevel.color}>{riskLevel.level}</Badge>
          </CardHeader>
          <CardContent className="space-y-6">
            <Progress value={score} className="h-3" />
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Key Findings</h3>
                <div className="space-y-2">
                  {score >= 80 && (
                    <div className="flex items-center gap-2 text-green-600">
                      <CheckCircle className="h-4 w-4" />
                      <span className="text-sm">Strong residency documentation</span>
                    </div>
                  )}
                  {score < 60 && (
                    <div className="flex items-center gap-2 text-red-600">
                      <XCircle className="h-4 w-4" />
                      <span className="text-sm">Multiple compliance gaps identified</span>
                    </div>
                  )}
                  {parseInt(answers.days_in_state) < 183 && (
                    <div className="flex items-center gap-2 text-yellow-600">
                      <AlertTriangle className="h-4 w-4" />
                      <span className="text-sm">Insufficient time in new state</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Recommendations</h3>
                <div className="space-y-2 text-sm">
                  {score < 80 && (
                    <>
                      <div>• Update all government documents within 30 days</div>
                      <div>• Spend 183+ days in {targetState} annually</div>
                      <div>• Establish clear domicile indicators</div>
                      <div>• Document your relocation timeline</div>
                    </>
                  )}
                  {score >= 80 && (
                    <>
                      <div>• Maintain detailed records of time in state</div>
                      <div>• Review annually for continued compliance</div>
                      <div>• Consider audit protection services</div>
                    </>
                  )}
                </div>
              </div>
            </div>

            <Separator />

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button onClick={handleDownloadReport}>
                <CheckCircle className="h-4 w-4 mr-2" />
                Download Full Report
              </Button>
              <Button variant="outline" onClick={() => setShowResults(false)}>
                Retake Assessment
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentQuestion = assessmentQuestions[currentStep];
  const progress = ((currentStep + 1) / assessmentQuestions.length) * 100;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>State Residency Assessment</CardTitle>
            <Badge variant="outline">
              {currentStep + 1} of {assessmentQuestions.length}
            </Badge>
          </div>
          <CardDescription>
            Answer these questions to evaluate your residency compliance
          </CardDescription>
          <Progress value={progress} className="mt-4" />
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Badge variant="secondary">{currentQuestion.category}</Badge>
              {currentQuestion.required && (
                <Badge variant="destructive" className="text-xs">Required</Badge>
              )}
            </div>
            
            <h3 className="text-lg font-medium">{currentQuestion.question}</h3>
            
            {currentQuestion.type === 'radio' && (
              <RadioGroup 
                value={answers[currentQuestion.id] || ''} 
                onValueChange={(value) => handleAnswerChange(currentQuestion.id, value)}
              >
                {currentQuestion.options?.map((option) => (
                  <div key={option} className="flex items-center space-x-2">
                    <RadioGroupItem value={option} id={option} />
                    <Label htmlFor={option}>{option}</Label>
                  </div>
                ))}
              </RadioGroup>
            )}
            
            {currentQuestion.type === 'number' && (
              <Input
                type="number"
                placeholder="Enter number of days"
                value={answers[currentQuestion.id] || ''}
                onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
              />
            )}
          </div>
          
          <div className="flex justify-between">
            <Button 
              variant="outline" 
              onClick={() => setCurrentStep(prev => Math.max(0, prev - 1))}
              disabled={currentStep === 0}
            >
              Previous
            </Button>
            
            {currentStep === assessmentQuestions.length - 1 ? (
              <Button onClick={handleSubmit}>
                Calculate My Score
              </Button>
            ) : (
              <Button 
                onClick={() => setCurrentStep(prev => prev + 1)}
                disabled={currentQuestion.required && !answers[currentQuestion.id]}
              >
                Next
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}