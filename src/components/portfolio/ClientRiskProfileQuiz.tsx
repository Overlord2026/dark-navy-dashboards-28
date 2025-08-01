import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  ClipboardList, 
  ChevronRight, 
  ChevronLeft,
  Target,
  Calendar,
  DollarSign,
  TrendingUp
} from 'lucide-react';

interface QuizQuestion {
  id: string;
  question: string;
  options: {
    value: string;
    label: string;
    score: number;
  }[];
  category: 'timeHorizon' | 'riskTolerance' | 'experience' | 'objectives' | 'demographics';
}

interface RiskProfile {
  age: number;
  timeHorizon: number;
  riskTolerance: 'conservative' | 'moderate' | 'growth' | 'aggressive';
  investmentExperience: string;
  primaryObjective: string;
  riskScore: number;
  riskCapacity: number;
  investmentGoals: string[];
}

interface ClientRiskProfileQuizProps {
  onComplete: (profile: RiskProfile) => void;
  onClose?: () => void;
  className?: string;
}

const quizQuestions: QuizQuestion[] = [
  {
    id: 'age',
    question: 'What is your age?',
    category: 'demographics',
    options: [
      { value: '18-30', label: 'Under 30', score: 5 },
      { value: '31-40', label: '31-40', score: 4 },
      { value: '41-50', label: '41-50', score: 3 },
      { value: '51-60', label: '51-60', score: 2 },
      { value: '60+', label: 'Over 60', score: 1 }
    ]
  },
  {
    id: 'timeHorizon',
    question: 'When do you expect to need this money?',
    category: 'timeHorizon',
    options: [
      { value: 'less-than-2', label: 'Less than 2 years', score: 1 },
      { value: '2-5', label: '2-5 years', score: 2 },
      { value: '5-10', label: '5-10 years', score: 3 },
      { value: '10-20', label: '10-20 years', score: 4 },
      { value: 'more-than-20', label: 'More than 20 years', score: 5 }
    ]
  },
  {
    id: 'primaryObjective',
    question: 'What is your primary investment objective?',
    category: 'objectives',
    options: [
      { value: 'capital-preservation', label: 'Preserve capital with minimal risk', score: 1 },
      { value: 'income', label: 'Generate steady income', score: 2 },
      { value: 'balanced', label: 'Balance growth and income', score: 3 },
      { value: 'growth', label: 'Long-term capital growth', score: 4 },
      { value: 'aggressive-growth', label: 'Maximum capital appreciation', score: 5 }
    ]
  },
  {
    id: 'experience',
    question: 'How would you describe your investment experience?',
    category: 'experience',
    options: [
      { value: 'none', label: 'No investment experience', score: 1 },
      { value: 'limited', label: 'Limited experience with basic investments', score: 2 },
      { value: 'moderate', label: 'Moderate experience with various investments', score: 3 },
      { value: 'extensive', label: 'Extensive experience with complex investments', score: 4 },
      { value: 'professional', label: 'Professional investment background', score: 5 }
    ]
  },
  {
    id: 'marketDecline',
    question: 'If your portfolio declined 20% in a year, what would you do?',
    category: 'riskTolerance',
    options: [
      { value: 'sell-all', label: 'Sell everything to prevent further losses', score: 1 },
      { value: 'sell-some', label: 'Sell some investments to reduce risk', score: 2 },
      { value: 'do-nothing', label: 'Do nothing and wait for recovery', score: 3 },
      { value: 'buy-more', label: 'Buy more at lower prices', score: 4 },
      { value: 'increase-risk', label: 'Increase risk for higher potential returns', score: 5 }
    ]
  },
  {
    id: 'volatility',
    question: 'How comfortable are you with investment volatility?',
    category: 'riskTolerance',
    options: [
      { value: 'very-uncomfortable', label: 'Very uncomfortable - prefer stable returns', score: 1 },
      { value: 'uncomfortable', label: 'Somewhat uncomfortable with fluctuations', score: 2 },
      { value: 'neutral', label: 'Neutral - accept some volatility for returns', score: 3 },
      { value: 'comfortable', label: 'Comfortable with volatility for growth', score: 4 },
      { value: 'very-comfortable', label: 'Very comfortable - embrace volatility', score: 5 }
    ]
  },
  {
    id: 'returns',
    question: 'Which return scenario appeals to you most?',
    category: 'riskTolerance',
    options: [
      { value: 'guaranteed-3', label: 'Guaranteed 3% annual return', score: 1 },
      { value: 'likely-5', label: 'Likely 5% return with minimal downside', score: 2 },
      { value: 'possible-7', label: 'Possible 7% return with some volatility', score: 3 },
      { value: 'potential-10', label: 'Potential 10% return with significant volatility', score: 4 },
      { value: 'aggressive-15', label: 'Potential 15%+ return with high volatility', score: 5 }
    ]
  },
  {
    id: 'income',
    question: 'How important is current income from your investments?',
    category: 'objectives',
    options: [
      { value: 'very-important', label: 'Very important - need regular income', score: 1 },
      { value: 'somewhat-important', label: 'Somewhat important', score: 2 },
      { value: 'neutral', label: 'Neutral - balanced approach', score: 3 },
      { value: 'not-important', label: 'Not important - focus on growth', score: 4 },
      { value: 'reinvest', label: 'Prefer to reinvest all returns', score: 5 }
    ]
  }
];

export const ClientRiskProfileQuiz: React.FC<ClientRiskProfileQuizProps> = ({
  onComplete,
  onClose,
  className = ''
}) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isComplete, setIsComplete] = useState(false);
  const [profile, setProfile] = useState<RiskProfile | null>(null);

  const handleAnswer = (questionId: string, value: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const nextQuestion = () => {
    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      calculateRiskProfile();
    }
  };

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const calculateRiskProfile = () => {
    const scores: Record<string, number> = {};
    let totalScore = 0;
    let maxScore = 0;

    // Calculate scores by category
    quizQuestions.forEach(question => {
      const answer = answers[question.id];
      const option = question.options.find(opt => opt.value === answer);
      
      if (option) {
        if (!scores[question.category]) {
          scores[question.category] = 0;
        }
        scores[question.category] += option.score;
        totalScore += option.score;
      }
      
      maxScore += Math.max(...question.options.map(opt => opt.score));
    });

    // Calculate age from answer
    const ageAnswer = answers.age;
    let age = 35; // Default
    if (ageAnswer === '18-30') age = 25;
    else if (ageAnswer === '31-40') age = 35;
    else if (ageAnswer === '41-50') age = 45;
    else if (ageAnswer === '51-60') age = 55;
    else if (ageAnswer === '60+') age = 65;

    // Calculate time horizon
    const timeAnswer = answers.timeHorizon;
    let timeHorizon = 10; // Default
    if (timeAnswer === 'less-than-2') timeHorizon = 1;
    else if (timeAnswer === '2-5') timeHorizon = 3;
    else if (timeAnswer === '5-10') timeHorizon = 7;
    else if (timeAnswer === '10-20') timeHorizon = 15;
    else if (timeAnswer === 'more-than-20') timeHorizon = 25;

    // Determine risk tolerance
    const riskToleranceScore = (scores.riskTolerance || 0) / (quizQuestions.filter(q => q.category === 'riskTolerance').length);
    let riskTolerance: 'conservative' | 'moderate' | 'growth' | 'aggressive' = 'moderate';
    
    if (riskToleranceScore <= 2) riskTolerance = 'conservative';
    else if (riskToleranceScore <= 3) riskTolerance = 'moderate';
    else if (riskToleranceScore <= 4) riskTolerance = 'growth';
    else riskTolerance = 'aggressive';

    // Calculate overall risk score (1-100)
    const riskScore = Math.round((totalScore / maxScore) * 100);

    // Risk capacity based on age and time horizon
    const riskCapacity = Math.min(100, ((100 - age) + timeHorizon * 2));

    const calculatedProfile: RiskProfile = {
      age,
      timeHorizon,
      riskTolerance,
      investmentExperience: answers.experience || 'moderate',
      primaryObjective: answers.primaryObjective || 'balanced',
      riskScore: Math.min(riskScore, riskCapacity), // Risk score shouldn't exceed capacity
      riskCapacity,
      investmentGoals: [answers.primaryObjective || 'balanced', answers.income || 'balanced']
    };

    setProfile(calculatedProfile);
    setIsComplete(true);
  };

  const getRiskLevelInfo = (score: number) => {
    if (score <= 25) return { level: 'Conservative', color: 'bg-green-100 text-green-800', description: 'Focus on capital preservation with minimal risk' };
    if (score <= 50) return { level: 'Moderate', color: 'bg-blue-100 text-blue-800', description: 'Balanced approach between growth and stability' };
    if (score <= 75) return { level: 'Growth', color: 'bg-orange-100 text-orange-800', description: 'Focus on long-term growth with moderate risk' };
    return { level: 'Aggressive', color: 'bg-red-100 text-red-800', description: 'Maximum growth potential with high risk tolerance' };
  };

  const progress = ((currentQuestion + 1) / quizQuestions.length) * 100;
  const currentQ = quizQuestions[currentQuestion];

  if (isComplete && profile) {
    const riskInfo = getRiskLevelInfo(profile.riskScore);
    
    return (
      <Card className={className}>
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2">
            <Target className="h-5 w-5" />
            Your Risk Profile
          </CardTitle>
          <CardDescription>
            Based on your responses, here's your personalized risk profile
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Risk Score Display */}
            <div className="text-center">
              <div className="relative inline-flex items-center justify-center w-24 h-24 mb-3">
                <svg className="transform -rotate-90 w-24 h-24">
                  <circle
                    cx="48"
                    cy="48"
                    r="40"
                    stroke="hsl(var(--muted))"
                    strokeWidth="6"
                    fill="none"
                  />
                  <circle
                    cx="48"
                    cy="48"
                    r="40"
                    stroke="hsl(var(--primary))"
                    strokeWidth="6"
                    fill="none"
                    strokeDasharray={`${2 * Math.PI * 40}`}
                    strokeDashoffset={`${2 * Math.PI * 40 * (1 - profile.riskScore / 100)}`}
                    className="transition-all duration-1000"
                  />
                </svg>
                <div className="absolute text-center">
                  <div className="text-lg font-bold">{profile.riskScore}</div>
                </div>
              </div>
              
              <Badge className={`${riskInfo.color} border px-4 py-2 text-sm font-medium mb-2`}>
                {riskInfo.level}
              </Badge>
              <p className="text-sm text-gray-600">{riskInfo.description}</p>
            </div>

            {/* Profile Details */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <Calendar className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium">Time Horizon</span>
                </div>
                <p className="font-semibold">{profile.timeHorizon} years</p>
              </div>

              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium">Primary Goal</span>
                </div>
                <p className="font-semibold capitalize">{profile.primaryObjective.replace('-', ' ')}</p>
              </div>

              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <DollarSign className="h-4 w-4 text-purple-600" />
                  <span className="text-sm font-medium">Experience</span>
                </div>
                <p className="font-semibold capitalize">{profile.investmentExperience}</p>
              </div>

              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <Target className="h-4 w-4 text-orange-600" />
                  <span className="text-sm font-medium">Risk Capacity</span>
                </div>
                <p className="font-semibold">{profile.riskCapacity}/100</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button onClick={() => onComplete(profile)} className="flex-1">
                Use This Profile
              </Button>
              {onClose && (
                <Button onClick={onClose} variant="outline">
                  Close
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ClipboardList className="h-5 w-5" />
          Risk Profile Assessment
        </CardTitle>
        <CardDescription>
          Question {currentQuestion + 1} of {quizQuestions.length}
        </CardDescription>
        <Progress value={progress} className="mt-2" />
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-4">{currentQ.question}</h3>
            
            <RadioGroup
              value={answers[currentQ.id] || ''}
              onValueChange={(value) => handleAnswer(currentQ.id, value)}
            >
              <div className="space-y-3">
                {currentQ.options.map((option) => (
                  <div key={option.value} className="flex items-center space-x-2">
                    <RadioGroupItem value={option.value} id={option.value} />
                    <Label htmlFor={option.value} className="flex-1 cursor-pointer">
                      {option.label}
                    </Label>
                  </div>
                ))}
              </div>
            </RadioGroup>
          </div>

          <div className="flex justify-between">
            <Button
              onClick={prevQuestion}
              disabled={currentQuestion === 0}
              variant="outline"
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>
            
            <Button
              onClick={nextQuestion}
              disabled={!answers[currentQ.id]}
            >
              {currentQuestion === quizQuestions.length - 1 ? 'Calculate Profile' : 'Next'}
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};