import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { 
  FileText, 
  Upload, 
  CheckCircle, 
  AlertTriangle, 
  Clock, 
  Users, 
  Building, 
  Map, 
  Heart,
  Calendar,
  Scale,
  Phone,
  ArrowRight,
  ArrowLeft,
  Home,
  Shield,
  Briefcase
} from 'lucide-react';
import { toast } from 'sonner';

interface EstateIntakeData {
  id?: string;
  user_id: string;
  current_step: number;
  total_steps: number;
  progress_percentage: number;
  intake_data: any;
  assessment_results: any;
  status: 'in_progress' | 'completed' | 'needs_attorney';
  created_at?: string;
  updated_at?: string;
}

interface Question {
  id: string;
  title: string;
  type: 'single' | 'multiple' | 'text' | 'number' | 'select';
  options?: string[];
  required: boolean;
  help_text?: string;
  conditions?: any;
}

const estateQuestions: Question[] = [
  {
    id: 'has_will',
    title: 'Do you currently have a Will?',
    type: 'single',
    options: ['Yes', 'No', 'Not sure'],
    required: true,
    help_text: 'A Will is a legal document that specifies how your assets will be distributed after your death.'
  },
  {
    id: 'has_trust',
    title: 'Do you have any Trusts established?',
    type: 'single',
    options: ['Yes', 'No', 'Not sure'],
    required: true,
    help_text: 'Trusts can help manage assets, reduce taxes, and avoid probate.'
  },
  {
    id: 'marital_status',
    title: 'What is your marital status?',
    type: 'single',
    options: ['Single', 'Married', 'Divorced', 'Widowed', 'Domestic Partnership'],
    required: true
  },
  {
    id: 'has_children',
    title: 'Do you have children?',
    type: 'single',
    options: ['Yes', 'No'],
    required: true
  },
  {
    id: 'minor_children',
    title: 'Do you have children under 18?',
    type: 'single',
    options: ['Yes', 'No'],
    required: true,
    conditions: { has_children: 'Yes' }
  },
  {
    id: 'blended_family',
    title: 'Do you have a blended family (children from previous relationships)?',
    type: 'single',
    options: ['Yes', 'No'],
    required: true,
    conditions: { has_children: 'Yes' }
  },
  {
    id: 'business_owner',
    title: 'Do you own a business?',
    type: 'single',
    options: ['Yes', 'No'],
    required: true
  },
  {
    id: 'multi_state_property',
    title: 'Do you own property in multiple states?',
    type: 'single',
    options: ['Yes', 'No'],
    required: true
  },
  {
    id: 'special_needs',
    title: 'Do you have family members with special needs?',
    type: 'single',
    options: ['Yes', 'No'],
    required: true
  },
  {
    id: 'estate_value',
    title: 'What is the approximate value of your estate?',
    type: 'select',
    options: ['Under $100k', '$100k - $500k', '$500k - $1M', '$1M - $5M', '$5M - $10M', 'Over $10M'],
    required: true,
    help_text: 'Include all assets: real estate, investments, business interests, personal property.'
  }
];

export function EstateIntakeWizard() {
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [intakeData, setIntakeData] = useState<EstateIntakeData | null>(null);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (user && isOpen) {
      loadExistingIntake();
    }
  }, [user, isOpen]);

  const loadExistingIntake = async () => {
    try {
      const { data, error } = await supabase
        .from('estate_intake')
        .select('*')
        .eq('user_id', user?.id)
        .eq('status', 'in_progress')
        .single();

      if (data) {
        setIntakeData(data);
        setCurrentStep(data.current_step);
        setAnswers(data.intake_data || {});
      }
    } catch (error) {
      // No existing intake found
    }
  };

  const saveProgress = async () => {
    if (!user) return;

    const progressData: Partial<EstateIntakeData> = {
      user_id: user.id,
      current_step: currentStep,
      total_steps: estateQuestions.length,
      progress_percentage: Math.round((currentStep / estateQuestions.length) * 100),
      intake_data: answers,
      status: currentStep >= estateQuestions.length ? 'completed' : 'in_progress'
    };

    try {
      if (intakeData?.id) {
        const { error } = await supabase
          .from('estate_intake')
          .update(progressData)
          .eq('id', intakeData.id);
        if (error) throw error;
      } else {
        const { data, error } = await supabase
          .from('estate_intake')
          .insert([progressData])
          .select()
          .single();
        if (error) throw error;
        setIntakeData(data);
      }
    } catch (error) {
      console.error('Error saving progress:', error);
      toast.error('Failed to save progress');
    }
  };

  const handleAnswer = (questionId: string, value: any) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const handleNext = async () => {
    await saveProgress();
    if (currentStep < estateQuestions.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      await completeIntake();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const completeIntake = async () => {
    const assessment = assessEstatePlan(answers);
    
    const finalData: Partial<EstateIntakeData> = {
      current_step: estateQuestions.length,
      progress_percentage: 100,
      intake_data: answers,
      assessment_results: assessment,
      status: assessment.needsAttorney ? 'needs_attorney' : 'completed'
    };

    try {
      await supabase
        .from('estate_intake')
        .update(finalData)
        .eq('id', intakeData?.id);

      toast.success('Estate planning assessment completed!');
      setIsOpen(false);
    } catch (error) {
      console.error('Error completing intake:', error);
      toast.error('Failed to complete assessment');
    }
  };

  const assessEstatePlan = (answers: Record<string, any>) => {
    let riskScore = 0;
    let recommendations = [];
    let needsAttorney = false;

    // Assess based on answers
    if (answers.has_will === 'No') {
      riskScore += 30;
      recommendations.push('Create a Will immediately');
      needsAttorney = true;
    }

    if (answers.has_trust === 'No' && answers.estate_value !== 'Under $100k') {
      riskScore += 25;
      recommendations.push('Consider establishing a Trust');
    }

    if (answers.minor_children === 'Yes') {
      riskScore += 20;
      recommendations.push('Designate guardians for minor children');
      needsAttorney = true;
    }

    if (answers.blended_family === 'Yes') {
      riskScore += 15;
      recommendations.push('Address blended family complexities');
      needsAttorney = true;
    }

    if (answers.business_owner === 'Yes') {
      riskScore += 20;
      recommendations.push('Business succession planning needed');
      needsAttorney = true;
    }

    if (answers.multi_state_property === 'Yes') {
      riskScore += 15;
      recommendations.push('Multi-state property planning required');
      needsAttorney = true;
    }

    if (answers.special_needs === 'Yes') {
      riskScore += 25;
      recommendations.push('Special needs trust planning');
      needsAttorney = true;
    }

    return {
      riskScore,
      riskLevel: riskScore > 50 ? 'High' : riskScore > 25 ? 'Medium' : 'Low',
      recommendations,
      needsAttorney,
      priority: riskScore > 75 ? 'Urgent' : riskScore > 50 ? 'High' : 'Standard'
    };
  };

  const getCurrentQuestion = () => {
    if (currentStep >= estateQuestions.length) return null;
    const question = estateQuestions[currentStep];
    
    // Check conditions
    if (question.conditions) {
      for (const [key, value] of Object.entries(question.conditions)) {
        if (answers[key] !== value) {
          // Skip this question
          setTimeout(() => handleNext(), 0);
          return null;
        }
      }
    }
    
    return question;
  };

  const renderQuestion = (question: Question) => {
    const currentAnswer = answers[question.id];

    return (
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold">{question.title}</h2>
          {question.help_text && (
            <p className="text-muted-foreground text-sm max-w-md mx-auto">
              {question.help_text}
            </p>
          )}
        </div>

        <div className="max-w-md mx-auto">
          {question.type === 'single' && question.options && (
            <RadioGroup 
              value={currentAnswer} 
              onValueChange={(value) => handleAnswer(question.id, value)}
              className="space-y-3"
            >
              {question.options.map((option) => (
                <div key={option} className="flex items-center space-x-2">
                  <RadioGroupItem value={option} id={option} />
                  <Label htmlFor={option} className="flex-1 cursor-pointer">
                    {option}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          )}

          {question.type === 'select' && question.options && (
            <Select value={currentAnswer} onValueChange={(value) => handleAnswer(question.id, value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select an option..." />
              </SelectTrigger>
              <SelectContent>
                {question.options.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          {question.type === 'text' && (
            <Textarea
              value={currentAnswer || ''}
              onChange={(e) => handleAnswer(question.id, e.target.value)}
              placeholder="Enter your response..."
            />
          )}
        </div>
      </div>
    );
  };

  const progress = Math.round((currentStep / estateQuestions.length) * 100);
  const currentQuestion = getCurrentQuestion();

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-primary hover:bg-primary/90">
          <Scale className="h-4 w-4 mr-2" />
          Estate Planning Assessment
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Scale className="h-5 w-5" />
            Estate Planning Assessment
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress</span>
              <span>{currentStep} of {estateQuestions.length}</span>
            </div>
            <Progress value={progress} className="h-2" />
            <p className="text-xs text-muted-foreground text-center">
              {progress}% Complete
            </p>
          </div>

          {/* Question */}
          {currentQuestion ? (
            <>
              {renderQuestion(currentQuestion)}

              {/* Navigation */}
              <div className="flex justify-between pt-4">
                <Button
                  variant="outline"
                  onClick={handlePrevious}
                  disabled={currentStep === 0}
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Previous
                </Button>

                <Button
                  onClick={handleNext}
                  disabled={currentQuestion.required && !answers[currentQuestion.id]}
                >
                  {currentStep >= estateQuestions.length - 1 ? 'Complete' : 'Next'}
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </>
          ) : (
            <div className="text-center py-8">
              <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Assessment Complete!</h3>
              <p className="text-muted-foreground">
                Processing your responses...
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}