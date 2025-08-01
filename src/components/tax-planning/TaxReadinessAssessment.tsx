import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, AlertCircle, XCircle, Download, Calendar } from "lucide-react";
import { analytics } from "@/lib/analytics";
import { FamilyOfficeReferralTrigger } from "./FamilyOfficeReferralTrigger";

interface AssessmentQuestion {
  id: string;
  question: string;
  weight: number;
  category: 'documents' | 'planning' | 'compliance' | 'optimization';
}

const assessmentQuestions: AssessmentQuestion[] = [
  { id: 'w2_1099', question: 'Do you have all W-2s and 1099s from this tax year?', weight: 10, category: 'documents' },
  { id: 'deductions', question: 'Have you tracked deductible expenses (charitable, medical, business)?', weight: 8, category: 'documents' },
  { id: 'retirement_contrib', question: 'Have you maximized retirement account contributions?', weight: 9, category: 'planning' },
  { id: 'tax_withholding', question: 'Have you reviewed your tax withholding for next year?', weight: 7, category: 'planning' },
  { id: 'estimated_payments', question: 'Are you current on estimated tax payments (if applicable)?', weight: 8, category: 'compliance' },
  { id: 'tax_loss_harvest', question: 'Have you considered tax-loss harvesting opportunities?', weight: 6, category: 'optimization' },
  { id: 'roth_conversion', question: 'Have you evaluated Roth conversion opportunities?', weight: 7, category: 'optimization' },
  { id: 'state_residency', question: 'Have you optimized your state tax situation?', weight: 5, category: 'optimization' }
];

export function TaxReadinessAssessment() {
  const [responses, setResponses] = useState<Record<string, boolean>>({});
  const [showResults, setShowResults] = useState(false);
  const [email, setEmail] = useState('');

  const handleResponse = (questionId: string, answer: boolean) => {
    setResponses(prev => ({ ...prev, [questionId]: answer }));
  };

  const calculateScore = () => {
    const totalWeight = assessmentQuestions.reduce((sum, q) => sum + q.weight, 0);
    const earnedWeight = assessmentQuestions.reduce((sum, q) => {
      return responses[q.id] ? sum + q.weight : sum;
    }, 0);
    return Math.round((earnedWeight / totalWeight) * 100);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreIcon = (score: number) => {
    if (score >= 80) return <CheckCircle className="h-5 w-5 text-green-600" />;
    if (score >= 60) return <AlertCircle className="h-5 w-5 text-yellow-600" />;
    return <XCircle className="h-5 w-5 text-red-600" />;
  };

  const handleSubmitAssessment = () => {
    const score = calculateScore();
    setShowResults(true);
    
    // Track analytics
    analytics.track('tax_assessment_completed', {
      score,
      questions_answered: Object.keys(responses).length,
      email_provided: !!email
    });
  };

  const handleDownloadGuide = () => {
    analytics.track('tax_guide_download', {
      score: calculateScore(),
      source: 'assessment'
    });
    // In production, trigger actual download
    console.log('Download tax planning guide');
  };

  const handleScheduleConsultation = () => {
    analytics.track('tax_consultation_interest', {
      score: calculateScore(),
      source: 'assessment'
    });
    window.open("https://calendly.com/tonygomes/talk-with-tony", "_blank");
  };

  const score = calculateScore();
  const allQuestionsAnswered = assessmentQuestions.every(q => q.id in responses);

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CheckCircle className="h-6 w-6 text-primary" />
          Tax Readiness Assessment
        </CardTitle>
        <CardDescription>
          Evaluate your tax preparation status and identify optimization opportunities
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {!showResults ? (
          <>
            <div className="space-y-4">
              {assessmentQuestions.map((question) => (
                <div key={question.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="font-medium mb-2">{question.question}</p>
                      <Badge variant="outline" className="text-xs">
                        {question.category.charAt(0).toUpperCase() + question.category.slice(1)}
                      </Badge>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <Button
                        size="sm"
                        variant={responses[question.id] === true ? "default" : "outline"}
                        onClick={() => handleResponse(question.id, true)}
                      >
                        Yes
                      </Button>
                      <Button
                        size="sm"
                        variant={responses[question.id] === false ? "destructive" : "outline"}
                        onClick={() => handleResponse(question.id, false)}
                      >
                        No
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-muted/50 p-4 rounded-lg">
              <p className="text-sm text-muted-foreground mb-2">
                Optional: Provide your email to receive personalized tax planning recommendations
              </p>
              <input
                type="email"
                placeholder="your.email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2 border rounded"
              />
            </div>

            <Button 
              onClick={handleSubmitAssessment}
              disabled={!allQuestionsAnswered}
              className="w-full"
            >
              Get My Tax Readiness Score
            </Button>
          </>
        ) : (
          <div className="space-y-6">
            <div className="text-center">
              <div className="flex items-center justify-center gap-3 mb-4">
                {getScoreIcon(score)}
                <h3 className="text-2xl font-bold">Your Tax Readiness Score</h3>
              </div>
              <div className={`text-6xl font-bold ${getScoreColor(score)} mb-2`}>
                {score}%
              </div>
              <Progress value={score} className="w-full max-w-md mx-auto mb-4" />
              
              {score >= 80 && (
                <p className="text-green-700 font-medium">
                  Excellent! You're well-prepared for tax season.
                </p>
              )}
              {score >= 60 && score < 80 && (
                <p className="text-yellow-700 font-medium">
                  Good progress! A few optimizations could improve your tax situation.
                </p>
              )}
              {score < 60 && (
                <p className="text-red-700 font-medium">
                  Significant opportunities exist to improve your tax planning.
                </p>
              )}
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Button onClick={handleDownloadGuide} className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                Download Tax Planning Guide
              </Button>
              <Button 
                onClick={handleScheduleConsultation}
                variant="outline"
                className="flex items-center gap-2"
              >
                <Calendar className="h-4 w-4" />
                Schedule Tax Consultation
              </Button>
            </div>

            {/* Family Office Referral Trigger */}
            {score < 75 && (
              <FamilyOfficeReferralTrigger 
                triggerContext="assessment_score"
                assessmentScore={score}
                triggerData={{ 
                  missed_questions: assessmentQuestions.filter(q => !responses[q.id]).length,
                  categories_needing_help: [...new Set(assessmentQuestions.filter(q => !responses[q.id]).map(q => q.category))]
                }}
              />
            )}

            <div className="bg-muted/50 p-4 rounded-lg">
              <h4 className="font-medium mb-2">Recommended Next Steps:</h4>
              <ul className="space-y-1 text-sm">
                {assessmentQuestions
                  .filter(q => !responses[q.id])
                  .map(q => (
                    <li key={q.id} className="flex items-center gap-2">
                      <XCircle className="h-3 w-3 text-red-500" />
                      {q.question.replace('Have you', 'Complete').replace('Do you have', 'Gather').replace('?', '')}
                    </li>
                  ))}
              </ul>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}