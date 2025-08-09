import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, AlertTriangle, XCircle, ArrowRight, RefreshCw } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

// Scorecard question types and data
interface ScorecardOption {
  id: string;
  label: string;
  points: number;
}

interface ScorecardQuestion {
  id: string;
  label: string;
  type: 'single';
  options: ScorecardOption[];
  prefill_map: Record<string, any>;
}

interface ScoringBand {
  min: number;
  label: string;
  color: string;
  message: string;
}

interface Recommendation {
  whenAnyRed?: string[];
  whenAmberOrRed?: string[];
  cta: string;
  link: string;
  bullets: string[];
}

// Scorecard configuration
const SCORECARD_CONFIG = {
  title: "Retirement Confidence Scorecard™",
  subtitle: "10 quick questions. See your score and next steps.",
  disclaimer: "This scorecard is educational and not individualized investment, tax, or legal advice. Results are estimates and may change with your circumstances.",
  maxPoints: 96,
  
  questions: [
    {
      id: "target_age_set",
      label: "Have you selected a target retirement age?",
      type: "single" as const,
      options: [
        { id: "yes", label: "Yes", points: 10 },
        { id: "rough", label: "I have a rough idea", points: 6 },
        { id: "no", label: "Not yet", points: 0 }
      ],
      prefill_map: { "roadmap.retirement_age_target": { "yes": "known", "rough": "rough", "no": null } }
    },
    {
      id: "expense_plan_monthly",
      label: "Do you know your core monthly living expenses (today's dollars)?",
      type: "single" as const,
      options: [
        { id: "dialed", label: "Dialed in (±10%)", points: 12 },
        { id: "estimate", label: "Good estimate (±25%)", points: 8 },
        { id: "guess", label: "Just guessing", points: 0 }
      ],
      prefill_map: { "roadmap.monthly_expense_estimate_confidence": { "dialed": "high", "estimate": "medium", "guess": "low" } }
    },
    {
      id: "income_now_gap",
      label: "How confident are you that Social Security/pension + safe income covers your first 1–2 years of core expenses?",
      type: "single" as const,
      options: [
        { id: "covered", label: "Covered", points: 12 },
        { id: "partial", label: "Partially covered", points: 6 },
        { id: "not", label: "Not covered", points: 0 }
      ],
      prefill_map: { "roadmap.phase_income_now_status": { "covered": "green", "partial": "amber", "not": "red" } }
    },
    {
      id: "income_later_buffer",
      label: "Do you have a plan for years 3–12 (income later) that limits sequence‑of‑returns risk?",
      type: "single" as const,
      options: [
        { id: "yes", label: "Yes", points: 10 },
        { id: "working", label: "Working on it", points: 5 },
        { id: "no", label: "No", points: 0 }
      ],
      prefill_map: { "roadmap.phase_income_later_status": { "yes": "green", "working": "amber", "no": "red" } }
    },
    {
      id: "growth_allocation",
      label: "Is your 12+ year growth allocation aligned with your risk tolerance and time horizon?",
      type: "single" as const,
      options: [
        { id: "aligned", label: "Aligned", points: 8 },
        { id: "somewhat", label: "Somewhat", points: 4 },
        { id: "misaligned", label: "Misaligned/unsure", points: 0 }
      ],
      prefill_map: { "roadmap.phase_growth_status": { "aligned": "green", "somewhat": "amber", "misaligned": "red" } }
    },
    {
      id: "legacy_intent",
      label: "Do you have legacy/beneficiary intentions and essential estate docs (will/POA/HC directives)?",
      type: "single" as const,
      options: [
        { id: "docs_set", label: "Yes—documents in place", points: 8 },
        { id: "in_progress", label: "Intent set, docs in progress", points: 4 },
        { id: "no", label: "Not yet", points: 0 }
      ],
      prefill_map: { "roadmap.phase_legacy_status": { "docs_set": "green", "in_progress": "amber", "no": "red" } }
    },
    {
      id: "healthcare_ltc",
      label: "Do you have a plan for healthcare and potential long‑term care costs?",
      type: "single" as const,
      options: [
        { id: "solid", label: "Solid plan/coverage", points: 8 },
        { id: "partial", label: "Partial plan", points: 4 },
        { id: "none", label: "No plan", points: 0 }
      ],
      prefill_map: { "roadmap.healthcare_ltc_readiness": { "solid": "green", "partial": "amber", "none": "red" } }
    },
    {
      id: "tax_strategy",
      label: "Have you considered tax‑efficient withdrawals (Roth/Traditional/Taxable) and Roth conversions?",
      type: "single" as const,
      options: [
        { id: "yes", label: "Yes, with a strategy", points: 10 },
        { id: "some", label: "Some discussion", points: 5 },
        { id: "no", label: "Not yet", points: 0 }
      ],
      prefill_map: { "roadmap.tax_strategy_status": { "yes": "green", "some": "amber", "no": "red" } }
    },
    {
      id: "cash_buffer",
      label: "Do you maintain a 6–12 month cash buffer for surprises?",
      type: "single" as const,
      options: [
        { id: "12mo", label: "Yes—~12 months", points: 8 },
        { id: "6mo", label: "Yes—~6 months", points: 6 },
        { id: "low", label: "Less than 6 months", points: 0 }
      ],
      prefill_map: { "roadmap.liquidity_buffer_months": { "12mo": 12, "6mo": 6, "low": 0 } }
    },
    {
      id: "income_sources_known",
      label: "Do you have a clear list of retirement income sources (SS, pension, rental, annuity) and amounts?",
      type: "single" as const,
      options: [
        { id: "complete", label: "Complete and current", points: 10 },
        { id: "partial", label: "Partial", points: 5 },
        { id: "none", label: "None documented", points: 0 }
      ],
      prefill_map: { "roadmap.income_sources_status": { "complete": "green", "partial": "amber", "none": "red" } }
    }
  ] as ScorecardQuestion[],
  
  scoringBands: [
    { min: 85, label: "Confident (Green)", color: "#10B981", message: "Your plan is on track. Let's validate with a SWAG™ Retirement Roadmap and fine‑tune taxes and healthcare." },
    { min: 65, label: "Work In Progress (Amber)", color: "#F59E0B", message: "Good foundation. Address income‑later risk, tax strategy, and healthcare/LTC to boost confidence." },
    { min: 0, label: "At Risk (Red)", color: "#EF4444", message: "You'll benefit from a clear plan for years 1–2 and 3–12, plus tax and estate basics. Start your Roadmap now." }
  ] as ScoringBand[],
  
  recommendations: [
    {
      whenAnyRed: ["phase_income_now_status", "phase_income_later_status"],
      cta: "Start SWAG™ Retirement Roadmap",
      link: "/roadmap/intake?prefill=true",
      bullets: [
        "Lock in 1–2 years of core expenses (Income Now).",
        "Build a 3–12 year buffer to cut sequence risk (Income Later).",
        "Align >12 year growth with your tolerance and goals."
      ]
    },
    {
      whenAmberOrRed: ["tax_strategy_status", "healthcare_ltc_readiness", "phase_legacy_status"],
      cta: "Book a Planning Session",
      link: "/book?topic=retirement-roadmap",
      bullets: [
        "Dial in a tax‑efficient withdrawal sequence & Roth conversion windows.",
        "Stress‑test healthcare and potential LTC costs.",
        "Update beneficiaries and essential estate documents."
      ]
    }
  ] as Recommendation[]
};

export const RetirementConfidenceScorecard: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [score, setScore] = useState<number | null>(null);
  const [scoringBand, setScoringBand] = useState<ScoringBand | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const persona = searchParams.get('persona') || 'client-family';
  const progress = ((currentStep + 1) / SCORECARD_CONFIG.questions.length) * 100;

  // Track analytics events
  useEffect(() => {
    // Track scorecard started
    trackAnalyticsEvent('scorecard_started', {
      persona,
      tool: 'retirement-confidence'
    });
  }, [persona]);

  const trackAnalyticsEvent = async (eventType: string, eventData: any) => {
    try {
      await supabase.from('analytics_scorecard_events').insert({
        event_type: eventType,
        event_data: eventData,
        session_id: `scorecard_${Date.now()}`
      });
    } catch (error) {
      console.error('Analytics tracking error:', error);
    }
  };

  const calculateScore = (allAnswers: Record<string, string>): number => {
    let totalPoints = 0;
    
    SCORECARD_CONFIG.questions.forEach(question => {
      const answer = allAnswers[question.id];
      if (answer) {
        const option = question.options.find(opt => opt.id === answer);
        if (option) {
          totalPoints += option.points;
        }
      }
    });
    
    // Scale to 100
    return Math.round((totalPoints / SCORECARD_CONFIG.maxPoints) * 100);
  };

  const getScoringBand = (score: number): ScoringBand => {
    return SCORECARD_CONFIG.scoringBands.find(band => score >= band.min) || SCORECARD_CONFIG.scoringBands[SCORECARD_CONFIG.scoringBands.length - 1];
  };

  const handleAnswerChange = (questionId: string, value: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const handleNext = () => {
    if (currentStep < SCORECARD_CONFIG.questions.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      handleSubmit();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      const finalScore = calculateScore(answers);
      const band = getScoringBand(finalScore);
      
      setScore(finalScore);
      setScoringBand(band);

      // Store submission in database
      const { error } = await supabase.from('retirement_confidence_submissions').insert({
        persona,
        answers_json: answers,
        score: finalScore
      });

      if (error) {
        console.error('Submission error:', error);
        toast({
          title: "Submission Error",
          description: "There was an issue saving your scorecard. Your results are still available.",
          variant: "destructive"
        });
      } else {
        // Track completion
        await trackAnalyticsEvent('scorecard_completed', {
          persona,
          score: finalScore,
          band: band.label
        });

        await trackAnalyticsEvent('scorecard_score_assigned', {
          score: finalScore,
          band: band.label
        });
      }

      setShowResults(true);
    } catch (error) {
      console.error('Scorecard submission error:', error);
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getIconForBand = (band: ScoringBand) => {
    if (band.label.includes('Confident')) return <CheckCircle className="h-8 w-8 text-success" />;
    if (band.label.includes('Progress')) return <AlertTriangle className="h-8 w-8 text-warning" />;
    return <XCircle className="h-8 w-8 text-destructive" />;
  };

  const generatePrefillData = () => {
    const prefillData: Record<string, any> = {};
    
    SCORECARD_CONFIG.questions.forEach(question => {
      const answer = answers[question.id];
      if (answer && question.prefill_map) {
        Object.entries(question.prefill_map).forEach(([key, mapping]) => {
          if (typeof mapping === 'object' && mapping[answer]) {
            prefillData[key] = mapping[answer];
          }
        });
      }
    });
    
    return prefillData;
  };

  const handleGoToRoadmap = async () => {
    await trackAnalyticsEvent('roadmap_intake_started', {
      source: 'scorecard',
      score
    });
    
    const prefillData = generatePrefillData();
    const queryString = new URLSearchParams({
      prefill: 'true',
      source: 'scorecard',
      score: score?.toString() || '0',
      ...prefillData
    }).toString();
    
    navigate(`/roadmap/intake?${queryString}`);
  };

  const resetScorecard = () => {
    setCurrentStep(0);
    setAnswers({});
    setScore(null);
    setScoringBand(null);
    setShowResults(false);
  };

  if (showResults && score !== null && scoringBand) {
    return (
      <div className="min-h-screen bg-background py-8 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Results Header */}
          <Card className="mb-8">
            <CardHeader className="text-center">
              <div className="flex items-center justify-center gap-4 mb-4">
                {getIconForBand(scoringBand)}
                <div>
                  <CardTitle className="text-3xl font-serif">Your Retirement Confidence Score™</CardTitle>
                  <p className="text-muted-foreground mt-2">{SCORECARD_CONFIG.subtitle}</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="text-6xl font-bold" style={{ color: scoringBand.color }}>
                  {score}/100
                </div>
                <Badge variant="secondary" className="text-lg px-4 py-2">
                  {scoringBand.label}
                </Badge>
                <p className="text-lg max-w-2xl mx-auto leading-relaxed">
                  {scoringBand.message}
                </p>
              </div>
            </CardHeader>
          </Card>

          {/* Recommendations */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {SCORECARD_CONFIG.recommendations.map((rec, index) => (
              <Card key={index} className="border-l-4" style={{ borderLeftColor: index === 0 ? '#10B981' : '#F59E0B' }}>
                <CardHeader>
                  <CardTitle className="text-xl">{rec.cta}</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 mb-4">
                    {rec.bullets.map((bullet, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-success mt-1 flex-shrink-0" />
                        <span className="text-sm">{bullet}</span>
                      </li>
                    ))}
                  </ul>
                  <Button 
                    onClick={index === 0 ? handleGoToRoadmap : () => navigate(rec.link)}
                    className="w-full"
                    variant={index === 0 ? "default" : "outline"}
                  >
                    {rec.cta} <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="text-center space-y-4">
            <Button onClick={handleGoToRoadmap} size="lg" className="mr-4">
              Get My SWAG™ Retirement Roadmap <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button onClick={resetScorecard} variant="outline" size="lg">
              <RefreshCw className="mr-2 h-4 w-4" /> Retake Scorecard
            </Button>
          </div>

          {/* Disclaimer */}
          <Card className="mt-8">
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground text-center">
                {SCORECARD_CONFIG.disclaimer}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const currentQuestion = SCORECARD_CONFIG.questions[currentStep];
  const selectedAnswer = answers[currentQuestion.id];

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-serif font-bold mb-4">{SCORECARD_CONFIG.title}</h1>
          <p className="text-xl text-muted-foreground mb-6">{SCORECARD_CONFIG.subtitle}</p>
          
          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Question {currentStep + 1} of {SCORECARD_CONFIG.questions.length}</span>
              <span>{Math.round(progress)}% Complete</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </div>

        {/* Question Card */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-xl leading-relaxed">
              {currentQuestion.label}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <RadioGroup
              value={selectedAnswer || ""}
              onValueChange={(value) => handleAnswerChange(currentQuestion.id, value)}
              className="space-y-4"
            >
              {currentQuestion.options.map((option) => (
                <div key={option.id} className="flex items-center space-x-2 p-4 rounded-lg border hover:bg-muted/50 transition-colors">
                  <RadioGroupItem value={option.id} id={option.id} />
                  <Label htmlFor={option.id} className="flex-1 cursor-pointer text-base">
                    {option.label}
                  </Label>
                  <Badge variant="outline" className="ml-auto">
                    {option.points} pts
                  </Badge>
                </div>
              ))}
            </RadioGroup>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button
            onClick={handlePrevious}
            disabled={currentStep === 0}
            variant="outline"
          >
            Previous
          </Button>
          
          <Button
            onClick={handleNext}
            disabled={!selectedAnswer || isSubmitting}
            className="min-w-[120px]"
          >
            {isSubmitting ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Calculating...
              </>
            ) : currentStep === SCORECARD_CONFIG.questions.length - 1 ? (
              <>
                See My Score <ArrowRight className="ml-2 h-4 w-4" />
              </>
            ) : (
              <>
                Next <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </div>

        {/* Disclaimer */}
        <Card className="mt-8">
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground text-center">
              {SCORECARD_CONFIG.disclaimer}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};