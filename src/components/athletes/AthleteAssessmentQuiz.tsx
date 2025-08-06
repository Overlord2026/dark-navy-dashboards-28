import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Target, AlertTriangle, TrendingUp } from 'lucide-react';

interface Question {
  id: string;
  question: string;
  options: { value: string; label: string; points: number }[];
}

const questions: Question[] = [
  {
    id: 'financial-plan',
    question: 'Do you have a comprehensive financial plan for life after sports?',
    options: [
      { value: 'comprehensive', label: 'Yes, comprehensive plan with trusted advisor', points: 3 },
      { value: 'basic', label: 'Basic plan, need more detail', points: 2 },
      { value: 'thinking', label: 'I\'m thinking about it', points: 1 },
      { value: 'none', label: 'No plan yet', points: 0 }
    ]
  },
  {
    id: 'emergency-fund',
    question: 'How prepared are you for unexpected career-ending events?',
    options: [
      { value: 'very-prepared', label: '12+ months expenses saved', points: 3 },
      { value: 'somewhat', label: '6-12 months expenses saved', points: 2 },
      { value: 'limited', label: '3-6 months expenses saved', points: 1 },
      { value: 'unprepared', label: 'Less than 3 months saved', points: 0 }
    ]
  },
  {
    id: 'mental-health',
    question: 'How do you feel about your mental preparation for retirement?',
    options: [
      { value: 'confident', label: 'Very confident and prepared', points: 3 },
      { value: 'somewhat-ready', label: 'Somewhat ready, working on it', points: 2 },
      { value: 'concerned', label: 'Concerned but haven\'t started planning', points: 1 },
      { value: 'worried', label: 'Very worried about this transition', points: 0 }
    ]
  },
  {
    id: 'career-transition',
    question: 'Do you have plans for your next career chapter?',
    options: [
      { value: 'clear-plan', label: 'Clear plan with actionable steps', points: 3 },
      { value: 'some-ideas', label: 'Some ideas, need to develop them', points: 2 },
      { value: 'exploring', label: 'Still exploring options', points: 1 },
      { value: 'no-idea', label: 'No idea what\'s next', points: 0 }
    ]
  },
  {
    id: 'support-network',
    question: 'How strong is your support network outside of sports?',
    options: [
      { value: 'strong', label: 'Very strong family and friend support', points: 3 },
      { value: 'moderate', label: 'Good support but could be stronger', points: 2 },
      { value: 'limited', label: 'Limited support outside sports', points: 1 },
      { value: 'minimal', label: 'Minimal support network', points: 0 }
    ]
  }
];

interface AthleteAssessmentQuizProps {
  onClose: () => void;
}

export function AthleteAssessmentQuiz({ onClose }: AthleteAssessmentQuizProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showResults, setShowResults] = useState(false);

  const handleAnswer = (questionId: string, value: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      setShowResults(true);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const calculateScore = () => {
    let totalScore = 0;
    Object.entries(answers).forEach(([questionId, value]) => {
      const question = questions.find(q => q.id === questionId);
      const option = question?.options.find(o => o.value === value);
      if (option) totalScore += option.points;
    });
    return totalScore;
  };

  const getScoreAnalysis = (score: number) => {
    const maxScore = questions.length * 3;
    const percentage = (score / maxScore) * 100;

    if (percentage >= 80) {
      return {
        level: 'Excellent',
        color: 'text-green-600',
        icon: <CheckCircle className="h-5 w-5 text-green-600" />,
        message: 'You\'re well-prepared for life after sports! Continue building on your strong foundation.',
        recommendations: [
          'Review and update your plans annually',
          'Consider mentoring other athletes',
          'Explore advanced wealth strategies'
        ]
      };
    } else if (percentage >= 60) {
      return {
        level: 'Good',
        color: 'text-blue-600',
        icon: <TrendingUp className="h-5 w-5 text-blue-600" />,
        message: 'You\'re on the right track but have room for improvement in key areas.',
        recommendations: [
          'Strengthen your weakest areas',
          'Connect with a financial advisor',
          'Build your post-career network'
        ]
      };
    } else {
      return {
        level: 'Needs Attention',
        color: 'text-orange-600',
        icon: <AlertTriangle className="h-5 w-5 text-orange-600" />,
        message: 'Important gaps identified. Let\'s get you the support you need.',
        recommendations: [
          'Start with our foundational modules',
          'Schedule a call with an advisor',
          'Join our athlete support community'
        ]
      };
    }
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const currentQ = questions[currentQuestion];
  const selectedAnswer = answers[currentQ?.id];

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Athlete Readiness Assessment
          </DialogTitle>
          <DialogDescription>
            Discover how prepared you are for life after sports
          </DialogDescription>
        </DialogHeader>

        {!showResults ? (
          <div className="space-y-6">
            {/* Progress */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Question {currentQuestion + 1} of {questions.length}</span>
                <span>{Math.round(progress)}% complete</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>

            {/* Question */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">{currentQ.question}</CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup 
                  value={selectedAnswer || ''} 
                  onValueChange={(value) => handleAnswer(currentQ.id, value)}
                  className="space-y-3"
                >
                  {currentQ.options.map((option) => (
                    <div key={option.value} className="flex items-center space-x-2 p-3 rounded-lg border hover:bg-accent/50 cursor-pointer">
                      <RadioGroupItem value={option.value} id={option.value} />
                      <Label htmlFor={option.value} className="flex-1 cursor-pointer">
                        {option.label}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </CardContent>
            </Card>

            {/* Navigation */}
            <div className="flex justify-between">
              <Button 
                variant="outline" 
                onClick={handlePrevious}
                disabled={currentQuestion === 0}
              >
                Previous
              </Button>
              <Button 
                onClick={handleNext}
                disabled={!selectedAnswer}
              >
                {currentQuestion === questions.length - 1 ? 'Get Results' : 'Next'}
              </Button>
            </div>
          </div>
        ) : (
          <AssessmentResults 
            score={calculateScore()} 
            analysis={getScoreAnalysis(calculateScore())}
            onClose={onClose}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

function AssessmentResults({ 
  score, 
  analysis, 
  onClose 
}: { 
  score: number; 
  analysis: ReturnType<typeof AthleteAssessmentQuiz.prototype.getScoreAnalysis>;
  onClose: () => void;
}) {
  const maxScore = questions.length * 3;
  const percentage = Math.round((score / maxScore) * 100);

  return (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-2">
          {analysis.icon}
          <h3 className="text-2xl font-bold">Assessment Complete</h3>
        </div>
        
        <div className="space-y-2">
          <div className="text-4xl font-bold">{percentage}%</div>
          <Badge variant="outline" className={analysis.color}>
            {analysis.level}
          </Badge>
        </div>
        
        <p className="text-muted-foreground max-w-md mx-auto">
          {analysis.message}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recommended Next Steps</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {analysis.recommendations.map((rec, index) => (
              <li key={index} className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                <span className="text-sm">{rec}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <div className="flex gap-2">
        <Button onClick={onClose} variant="outline" className="flex-1">
          Continue Learning
        </Button>
        <Button className="flex-1">
          Find an Advisor
        </Button>
      </div>
    </div>
  );
}