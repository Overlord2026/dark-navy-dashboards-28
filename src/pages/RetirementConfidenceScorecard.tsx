import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Logo } from '@/components/ui/Logo';
import { useNavigate } from 'react-router-dom';
import { Trophy, Calendar, ArrowRight, ArrowLeft, Shield, CheckCircle } from 'lucide-react';
import { withTrademarks } from '@/utils/trademark';
import { useEventTracking } from '@/hooks/useEventTracking';
import { supabase } from '@/integrations/supabase/client';

interface Question {
  id: number;
  question: string;
  options: {
    value: string;
    label: string;
    points: number;
  }[];
}

const questions: Question[] = [
  {
    id: 1,
    question: "How confident are you in your current retirement savings amount?",
    options: [
      { value: "very-confident", label: "Very confident - I'm on track", points: 10 },
      { value: "somewhat-confident", label: "Somewhat confident - but have concerns", points: 7 },
      { value: "not-confident", label: "Not confident - I'm worried", points: 3 },
      { value: "no-idea", label: "I have no idea where I stand", points: 0 }
    ]
  },
  {
    id: 2,
    question: "Do you have a written retirement income plan?",
    options: [
      { value: "comprehensive", label: "Yes, comprehensive and regularly updated", points: 10 },
      { value: "basic", label: "Yes, but it's basic or outdated", points: 6 },
      { value: "mental", label: "No, but I have a mental plan", points: 3 },
      { value: "none", label: "No plan at all", points: 0 }
    ]
  },
  {
    id: 3,
    question: "How well do you understand your Social Security benefits and timing strategy?",
    options: [
      { value: "optimized", label: "Fully optimized strategy in place", points: 10 },
      { value: "understand", label: "Good understanding, plan to optimize", points: 7 },
      { value: "basic", label: "Basic knowledge only", points: 4 },
      { value: "confused", label: "Confused or no knowledge", points: 0 }
    ]
  },
  {
    id: 4,
    question: "Have you planned for healthcare costs in retirement?",
    options: [
      { value: "fully-planned", label: "Fully planned with dedicated savings", points: 10 },
      { value: "partially-planned", label: "Partially planned", points: 6 },
      { value: "aware", label: "Aware but haven't planned", points: 3 },
      { value: "unaware", label: "Haven't considered this", points: 0 }
    ]
  },
  {
    id: 5,
    question: "How tax-efficient is your retirement withdrawal strategy?",
    options: [
      { value: "optimized", label: "Fully optimized with professional guidance", points: 10 },
      { value: "planned", label: "Have a strategy but could improve", points: 6 },
      { value: "basic", label: "Basic understanding only", points: 3 },
      { value: "no-strategy", label: "No withdrawal strategy", points: 0 }
    ]
  },
  {
    id: 6,
    question: "Do you have adequate emergency funds for retirement?",
    options: [
      { value: "well-funded", label: "Yes, well-funded for 2+ years", points: 10 },
      { value: "adequate", label: "Adequate for 6-12 months", points: 7 },
      { value: "some", label: "Some emergency funds", points: 4 },
      { value: "none", label: "No dedicated emergency funds", points: 0 }
    ]
  },
  {
    id: 7,
    question: "How protected is your retirement plan from market volatility?",
    options: [
      { value: "well-protected", label: "Well-diversified with risk management", points: 10 },
      { value: "somewhat-protected", label: "Somewhat diversified", points: 6 },
      { value: "minimal-protection", label: "Minimal protection strategies", points: 3 },
      { value: "no-protection", label: "No volatility protection", points: 0 }
    ]
  },
  {
    id: 8,
    question: "Have you planned for long-term care costs?",
    options: [
      { value: "fully-covered", label: "Insurance or dedicated savings in place", points: 10 },
      { value: "partially-covered", label: "Partial planning", points: 6 },
      { value: "aware", label: "Aware but haven't acted", points: 3 },
      { value: "unplanned", label: "Haven't considered this", points: 0 }
    ]
  },
  {
    id: 9,
    question: "How confident are you about leaving a legacy for your family?",
    options: [
      { value: "very-confident", label: "Very confident with estate plan", points: 10 },
      { value: "somewhat-confident", label: "Somewhat confident", points: 7 },
      { value: "uncertain", label: "Uncertain about legacy planning", points: 4 },
      { value: "no-plan", label: "No legacy plan", points: 0 }
    ]
  },
  {
    id: 10,
    question: "How often do you review and adjust your retirement strategy?",
    options: [
      { value: "regularly", label: "At least annually with professional help", points: 10 },
      { value: "occasionally", label: "Occasionally on my own", points: 6 },
      { value: "rarely", label: "Rarely review or adjust", points: 3 },
      { value: "never", label: "Never review", points: 0 }
    ]
  }
];

export default function RetirementConfidenceScorecard() {
  const navigate = useNavigate();
  const { trackCalculatorUsed, trackLeadConverted, trackFeatureUsed } = useEventTracking();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [showResults, setShowResults] = useState(false);

  const handleAnswer = (questionId: number, value: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      const score = calculateScore();
      setShowResults(true);
      
      // Track scorecard completion
      trackCalculatorUsed('retirement_confidence_scorecard', {
        score,
        total_questions: questions.length,
        completion_time: Date.now()
      });
      
      // Track potential lead conversion opportunity
      trackLeadConverted({ score, source: 'scorecard_completion' });
      
      // Trigger email automation
      triggerScorecardEmail(score);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const calculateScore = () => {
    return questions.reduce((total, question) => {
      const answer = answers[question.id];
      const option = question.options.find(opt => opt.value === answer);
      return total + (option?.points || 0);
    }, 0);
  };

  const getScoreLevel = (score: number) => {
    if (score >= 80) return { level: "Excellent", color: "text-green-600", description: "You're well-prepared for retirement!" };
    if (score >= 60) return { level: "Good", color: "text-blue-600", description: "You're on the right track with some areas to improve" };
    if (score >= 40) return { level: "Fair", color: "text-yellow-600", description: "Several important areas need attention" };
    return { level: "Needs Work", color: "text-red-600", description: "Significant planning gaps to address" };
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const currentQ = questions[currentQuestion];
  const currentAnswer = answers[currentQ?.id];

  const handleScheduleReview = () => {
    trackFeatureUsed('schedule_consultation', { source: 'scorecard_results' });
    window.open('https://calendly.com/tonygomes/talk-with-tony', '_blank');
  };

  const triggerScorecardEmail = async (score: number) => {
    try {
      const email = prompt('Enter your email to receive your scorecard:');
      if (!email) return;
      
      const scoreLevel = getScoreLevel(score);
      
      const { error } = await supabase.functions.invoke('send-scorecard-email', {
        body: {
          email,
          firstName: '',
          score,
          scoreLevel: scoreLevel.level
        }
      });
      
      if (error) {
        console.error('Failed to send scorecard email:', error);
      } else {
        console.log('Scorecard email sent successfully');
      }
    } catch (error) {
      console.error('Failed to trigger scorecard email:', error);
    }
  };

  if (showResults) {
    const score = calculateScore();
    const scoreLevel = getScoreLevel(score);

    return (
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b bg-card/50 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <Logo variant="tree" onClick={() => navigate('/')} />
            <Button variant="outline" onClick={() => navigate('/')}>
              Back to Home
            </Button>
          </div>
        </header>

        {/* Results */}
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <div className="space-y-4">
              <Trophy className="h-16 w-16 mx-auto text-primary" />
              <h1 className="text-4xl font-bold text-foreground">
                {withTrademarks("Your Retirement Confidence Score is Ready!")}
              </h1>
              <div className="text-6xl font-bold text-primary">{score}/100</div>
              <div className={`text-2xl font-semibold ${scoreLevel.color}`}>
                {scoreLevel.level}
              </div>
              <p className="text-lg text-muted-foreground">
                {scoreLevel.description}
              </p>
            </div>

            <Card className="bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
              <CardHeader>
                <CardTitle className="text-2xl">
                  To receive your personalized scorecard report and get a Customized Retirement Roadmap
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-muted-foreground">
                  Book your complimentary review or purchase your roadmap for a one-time fee.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button 
                    size="lg"
                    className="bg-primary hover:bg-primary/90 text-lg px-8 py-6 flex-1"
                    onClick={handleScheduleReview}
                  >
                    <Calendar className="h-5 w-5 mr-2" />
                    Book My Complimentary Confidence Review
                  </Button>
                  <Button 
                    variant="outline" 
                    size="lg"
                    className="text-lg px-8 py-6 flex-1"
                    onClick={() => navigate('/roadmap-info')}
                  >
                    Learn more about your Retirement Roadmap
                    <ArrowRight className="h-5 w-5 ml-2" />
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg">
                        {withTrademarks("Retirement Confidence Scorecard")} includes:
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {[
                        'Detailed score breakdown by category',
                        'Personalized recommendations',
                        'Priority action items',
                        'Educational resources'
                      ].map((item, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                          <span className="text-sm">{item}</span>
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg">Customized Retirement Roadmap includes:</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {[
                        'Tax-efficient withdrawal strategy',
                        'Social Security optimization',
                        'Healthcare cost planning',
                        '90-day implementation plan'
                      ].map((item, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-primary flex-shrink-0" />
                          <span className="text-sm">{item}</span>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </div>

                <div className="bg-muted/30 rounded-lg p-6 border space-y-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="h-5 w-5 text-primary" />
                    <span className="font-medium">
                      {withTrademarks("Boutique Family Office")} Promise
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {withTrademarks("Fiduciary duty. No commissions. No conflicts. Your interests first.")}
                  </p>
                  
                  <div className="space-y-2 text-xs text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-3 w-3 text-success" />
                      <span>We respect your privacy and will never share your information.</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-3 w-3 text-success" />
                      <span>Your data is secure and advertising-free environment.</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-3 w-3 text-success" />
                      <span>You always control who can access your Family Office Hub.</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="outline" onClick={() => navigate('/calculator')}>
                Try Fee Impact Calculator
              </Button>
              <Button variant="outline" onClick={() => navigate('/gap-analyzer')}>
                Analyze Income Gap
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Logo variant="tree" onClick={() => navigate('/')} />
          <Button variant="outline" onClick={() => navigate('/')}>
            Back to Home
          </Button>
        </div>
      </header>

      {/* Quiz */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-4">
              {withTrademarks("Retirement Confidence Scorecard")}
            </h1>
            <p className="text-muted-foreground">
              Answer 10 questions to assess your retirement readiness
            </p>
            <div className="mt-4">
              <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
                <span>Question {currentQuestion + 1} of {questions.length}</span>
                <span>{Math.round(progress)}% complete</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl">
                {currentQ.question}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <RadioGroup
                value={currentAnswer || ""}
                onValueChange={(value) => handleAnswer(currentQ.id, value)}
              >
                {currentQ.options.map((option) => (
                  <div key={option.value} className="flex items-center space-x-2">
                    <RadioGroupItem value={option.value} id={option.value} />
                    <Label htmlFor={option.value} className="flex-1 cursor-pointer">
                      {option.label}
                    </Label>
                  </div>
                ))}
              </RadioGroup>

              <div className="flex justify-between pt-6">
                <Button
                  variant="outline"
                  onClick={handlePrevious}
                  disabled={currentQuestion === 0}
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Previous
                </Button>
                
                <Button
                  onClick={handleNext}
                  disabled={!currentAnswer}
                  className="bg-primary hover:bg-primary/90"
                >
                  {currentQuestion === questions.length - 1 ? 'Get My Score' : 'Next'}
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}