import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  Crown,
  TrendingUp,
  FileText,
  Calculator,
  MessageCircle
} from 'lucide-react';
import { useSubscriptionAccess } from '@/hooks/useSubscriptionAccess';
import { FeatureAccessIndicator } from '@/components/navigation/FeatureAccessIndicator';
import { toast } from 'sonner';

interface RiskFactor {
  id: string;
  question: string;
  weight: number;
  riskLevel: 'low' | 'medium' | 'high';
  category: string;
}

const riskFactors: RiskFactor[] = [
  {
    id: 'former_state_taxes',
    question: 'What was your annual state tax burden in your former state?',
    weight: 20,
    riskLevel: 'high',
    category: 'Financial Profile'
  },
  {
    id: 'income_level',
    question: 'What is your annual income level?',
    weight: 25,
    riskLevel: 'high',
    category: 'Financial Profile'
  },
  {
    id: 'ties_to_former_state',
    question: 'How many significant ties do you still maintain to your former state?',
    weight: 20,
    riskLevel: 'medium',
    category: 'Domicile Factors'
  },
  {
    id: 'documentation_completeness',
    question: 'How complete is your residency documentation?',
    weight: 15,
    riskLevel: 'medium',
    category: 'Documentation'
  },
  {
    id: 'days_in_states',
    question: 'What percentage of days do you spend in your new vs. former state?',
    weight: 20,
    riskLevel: 'high',
    category: 'Physical Presence'
  }
];

export function AuditRiskAnalyzer() {
  const { checkFeatureAccess } = useSubscriptionAccess();
  const [activeTab, setActiveTab] = useState('analyzer');
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showResults, setShowResults] = useState(false);
  
  const hasAccess = checkFeatureAccess('audit_risk_analyzer');

  if (!hasAccess) {
    return (
      <div className="text-center py-12 space-y-6">
        <Shield className="h-16 w-16 text-primary mx-auto" />
        <div>
          <h3 className="text-2xl font-bold mb-2">AI-Powered Audit Risk Analysis</h3>
          <p className="text-muted-foreground max-w-md mx-auto">
            Get sophisticated risk scoring and personalized recommendations 
            to protect against state residency audits.
          </p>
        </div>
        <FeatureAccessIndicator feature="audit_risk_analyzer" />
      </div>
    );
  }

  const calculateRiskScore = () => {
    let totalScore = 0;
    let maxScore = 0;

    riskFactors.forEach(factor => {
      maxScore += factor.weight;
      const answer = answers[factor.id];
      
      if (answer) {
        let factorScore = 0;
        
        switch (factor.id) {
          case 'former_state_taxes':
            const taxAmount = parseInt(answer);
            if (taxAmount > 50000) factorScore = factor.weight * 0.9;
            else if (taxAmount > 25000) factorScore = factor.weight * 0.7;
            else if (taxAmount > 10000) factorScore = factor.weight * 0.5;
            else factorScore = factor.weight * 0.2;
            break;
            
          case 'income_level':
            if (answer === '1m+') factorScore = factor.weight * 0.9;
            else if (answer === '500k-1m') factorScore = factor.weight * 0.7;
            else if (answer === '250k-500k') factorScore = factor.weight * 0.5;
            else factorScore = factor.weight * 0.2;
            break;
            
          case 'ties_to_former_state':
            const ties = parseInt(answer);
            factorScore = factor.weight * Math.min(ties / 5, 1);
            break;
            
          case 'documentation_completeness':
            if (answer === 'complete') factorScore = factor.weight * 0.1;
            else if (answer === 'mostly') factorScore = factor.weight * 0.4;
            else if (answer === 'partial') factorScore = factor.weight * 0.7;
            else factorScore = factor.weight * 0.9;
            break;
            
          case 'days_in_states':
            if (answer === '80-20') factorScore = factor.weight * 0.1;
            else if (answer === '70-30') factorScore = factor.weight * 0.3;
            else if (answer === '60-40') factorScore = factor.weight * 0.6;
            else factorScore = factor.weight * 0.9;
            break;
        }
        
        totalScore += factorScore;
      }
    });

    return Math.round((totalScore / maxScore) * 100);
  };

  const getRiskLevel = (score: number) => {
    if (score >= 70) return { level: 'High Risk', color: 'bg-red-100 text-red-800', icon: XCircle };
    if (score >= 40) return { level: 'Medium Risk', color: 'bg-yellow-100 text-yellow-800', icon: AlertTriangle };
    return { level: 'Low Risk', color: 'bg-green-100 text-green-800', icon: CheckCircle };
  };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold">Audit Risk Analyzer</h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          AI-powered analysis of your state residency audit risk with personalized 
          recommendations for protection and compliance.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="analyzer">
            <Calculator className="h-4 w-4 mr-2" />
            Risk Analysis
          </TabsTrigger>
          <TabsTrigger value="protection">
            <Shield className="h-4 w-4 mr-2" />
            Protection Strategies
          </TabsTrigger>
          <TabsTrigger value="review">
            <MessageCircle className="h-4 w-4 mr-2" />
            Expert Review
          </TabsTrigger>
        </TabsList>

        <TabsContent value="analyzer">
          <RiskAnalysisForm 
            answers={answers}
            setAnswers={setAnswers}
            showResults={showResults}
            setShowResults={setShowResults}
            calculateRiskScore={calculateRiskScore}
            getRiskLevel={getRiskLevel}
          />
        </TabsContent>

        <TabsContent value="protection">
          <ProtectionStrategies />
        </TabsContent>

        <TabsContent value="review">
          <ExpertReview />
        </TabsContent>
      </Tabs>
    </div>
  );
}

interface RiskAnalysisFormProps {
  answers: Record<string, string>;
  setAnswers: (answers: Record<string, string>) => void;
  showResults: boolean;
  setShowResults: (show: boolean) => void;
  calculateRiskScore: () => number;
  getRiskLevel: (score: number) => any;
}

function RiskAnalysisForm({ 
  answers, 
  setAnswers, 
  showResults, 
  setShowResults, 
  calculateRiskScore, 
  getRiskLevel 
}: RiskAnalysisFormProps) {
  const [currentStep, setCurrentStep] = useState(0);

  const handleAnswerChange = (questionId: string, value: string) => {
    setAnswers({
      ...answers,
      [questionId]: value
    });
  };

  const handleSubmit = () => {
    const unanswered = riskFactors.filter(factor => !answers[factor.id]);
    
    if (unanswered.length > 0) {
      toast.error(`Please answer all questions (${unanswered.length} remaining)`);
      return;
    }

    setShowResults(true);
  };

  if (showResults) {
    const score = calculateRiskScore();
    const riskLevel = getRiskLevel(score);
    const RiskIcon = riskLevel.icon;

    return (
      <div className="space-y-6">
        <Card>
          <CardHeader className="text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <RiskIcon className={`h-8 w-8 ${score >= 70 ? 'text-red-600' : score >= 40 ? 'text-yellow-600' : 'text-green-600'}`} />
              <CardTitle className="text-2xl">Audit Risk Assessment</CardTitle>
            </div>
            <div className={`text-4xl font-bold ${score >= 70 ? 'text-red-600' : score >= 40 ? 'text-yellow-600' : 'text-green-600'}`}>
              {score}% Risk Level
            </div>
            <Badge className={riskLevel.color}>{riskLevel.level}</Badge>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <Progress value={score} className="h-3" />
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Key Risk Factors</h3>
                {riskFactors.map(factor => {
                  const answer = answers[factor.id];
                  const factorRisk = answer ? 'medium' : 'low'; // Simplified for demo
                  
                  return (
                    <div key={factor.id} className="flex items-center gap-3 p-3 rounded-lg border">
                      <div className={`w-3 h-3 rounded-full ${
                        factorRisk === 'high' ? 'bg-red-500' : 
                        factorRisk === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                      }`} />
                      <div className="flex-1">
                        <div className="font-medium text-sm">{factor.category}</div>
                        <div className="text-xs text-muted-foreground">Weight: {factor.weight}%</div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Recommendations</h3>
                <div className="space-y-3">
                  {score >= 70 && (
                    <>
                      <div className="flex items-start gap-2 p-3 rounded-lg bg-red-50 border border-red-200">
                        <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5" />
                        <div className="text-sm">
                          <div className="font-medium text-red-800">Immediate Action Required</div>
                          <div className="text-red-700">Consider audit protection services and legal review</div>
                        </div>
                      </div>
                      <div className="flex items-start gap-2 p-3 rounded-lg bg-yellow-50 border border-yellow-200">
                        <FileText className="h-4 w-4 text-yellow-600 mt-0.5" />
                        <div className="text-sm">
                          <div className="font-medium text-yellow-800">Documentation Review</div>
                          <div className="text-yellow-700">Strengthen residency documentation immediately</div>
                        </div>
                      </div>
                    </>
                  )}
                  
                  {score >= 40 && score < 70 && (
                    <>
                      <div className="flex items-start gap-2 p-3 rounded-lg bg-yellow-50 border border-yellow-200">
                        <Shield className="h-4 w-4 text-yellow-600 mt-0.5" />
                        <div className="text-sm">
                          <div className="font-medium text-yellow-800">Proactive Protection</div>
                          <div className="text-yellow-700">Consider additional safeguards and monitoring</div>
                        </div>
                      </div>
                    </>
                  )}
                  
                  {score < 40 && (
                    <div className="flex items-start gap-2 p-3 rounded-lg bg-green-50 border border-green-200">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                      <div className="text-sm">
                        <div className="font-medium text-green-800">Well Positioned</div>
                        <div className="text-green-700">Maintain current practices and annual review</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6 border-t">
              <Button onClick={() => toast.success('Generating detailed audit protection report...')}>
                <FileText className="h-4 w-4 mr-2" />
                Download Full Report
              </Button>
              <Button variant="outline" onClick={() => setShowResults(false)}>
                Retake Analysis
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentFactor = riskFactors[currentStep];
  const progress = ((currentStep + 1) / riskFactors.length) * 100;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Risk Factor Analysis</CardTitle>
            <Badge variant="outline">
              {currentStep + 1} of {riskFactors.length}
            </Badge>
          </div>
          <CardDescription>
            Answer these questions to assess your audit risk profile
          </CardDescription>
          <Progress value={progress} className="mt-4" />
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <Badge variant="secondary">{currentFactor.category}</Badge>
            <h3 className="text-lg font-medium">{currentFactor.question}</h3>
            
            {currentFactor.id === 'former_state_taxes' && (
              <Input
                type="number"
                placeholder="Enter annual state tax amount"
                value={answers[currentFactor.id] || ''}
                onChange={(e) => handleAnswerChange(currentFactor.id, e.target.value)}
              />
            )}
            
            {currentFactor.id === 'income_level' && (
              <RadioGroup 
                value={answers[currentFactor.id] || ''} 
                onValueChange={(value) => handleAnswerChange(currentFactor.id, value)}
              >
                {['Under $250K', '$250K - $500K', '$500K - $1M', '$1M+'].map((option, idx) => (
                  <div key={option} className="flex items-center space-x-2">
                    <RadioGroupItem value={['250k', '250k-500k', '500k-1m', '1m+'][idx]} id={option} />
                    <Label htmlFor={option}>{option}</Label>
                  </div>
                ))}
              </RadioGroup>
            )}
            
            {currentFactor.id === 'ties_to_former_state' && (
              <div className="space-y-2">
                <Label>Number of significant ties (business, family, property, etc.)</Label>
                <Input
                  type="number"
                  min="0"
                  max="10"
                  placeholder="0-10"
                  value={answers[currentFactor.id] || ''}
                  onChange={(e) => handleAnswerChange(currentFactor.id, e.target.value)}
                />
              </div>
            )}
            
            {currentFactor.id === 'documentation_completeness' && (
              <RadioGroup 
                value={answers[currentFactor.id] || ''} 
                onValueChange={(value) => handleAnswerChange(currentFactor.id, value)}
              >
                {[
                  { value: 'complete', label: 'Complete - All documents updated' },
                  { value: 'mostly', label: 'Mostly complete - Few items missing' },
                  { value: 'partial', label: 'Partial - Several items missing' },
                  { value: 'minimal', label: 'Minimal - Most items not updated' }
                ].map((option) => (
                  <div key={option.value} className="flex items-center space-x-2">
                    <RadioGroupItem value={option.value} id={option.value} />
                    <Label htmlFor={option.value}>{option.label}</Label>
                  </div>
                ))}
              </RadioGroup>
            )}
            
            {currentFactor.id === 'days_in_states' && (
              <RadioGroup 
                value={answers[currentFactor.id] || ''} 
                onValueChange={(value) => handleAnswerChange(currentFactor.id, value)}
              >
                {[
                  { value: '80-20', label: '80% new state, 20% former state' },
                  { value: '70-30', label: '70% new state, 30% former state' },
                  { value: '60-40', label: '60% new state, 40% former state' },
                  { value: '50-50', label: '50% each state or less in new state' }
                ].map((option) => (
                  <div key={option.value} className="flex items-center space-x-2">
                    <RadioGroupItem value={option.value} id={option.value} />
                    <Label htmlFor={option.value}>{option.label}</Label>
                  </div>
                ))}
              </RadioGroup>
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
            
            {currentStep === riskFactors.length - 1 ? (
              <Button onClick={handleSubmit}>
                <Calculator className="h-4 w-4 mr-2" />
                Calculate Risk Score
              </Button>
            ) : (
              <Button 
                onClick={() => setCurrentStep(prev => prev + 1)}
                disabled={!answers[currentFactor.id]}
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

function ProtectionStrategies() {
  const strategies = [
    {
      title: 'Documentation Shield',
      description: 'Comprehensive residency documentation package',
      features: ['Updated government IDs', 'Voter registration', 'Bank account statements', 'Utility bills'],
      level: 'Essential'
    },
    {
      title: 'Day Tracking System',
      description: 'Automated tracking of time spent in each state',
      features: ['GPS-based tracking', 'Calendar integration', 'Audit-ready reports', 'Alert notifications'],
      level: 'Recommended'
    },
    {
      title: 'Professional Review',
      description: 'Annual residency compliance review by experts',
      features: ['Document review', 'Risk assessment', 'Compliance updates', 'Planning recommendations'],
      level: 'Premium'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <h3 className="text-2xl font-bold">Protection Strategies</h3>
        <p className="text-muted-foreground">
          Layered protection approaches to minimize audit risk and ensure compliance
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {strategies.map((strategy) => (
          <Card key={strategy.title}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{strategy.title}</CardTitle>
                <Badge variant={
                  strategy.level === 'Essential' ? 'default' :
                  strategy.level === 'Recommended' ? 'secondary' : 'outline'
                }>
                  {strategy.level}
                </Badge>
              </div>
              <CardDescription>{strategy.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {strategy.features.map((feature) => (
                  <div key={feature} className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
              </div>
              <Button className="w-full mt-4" variant="outline">
                Learn More
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function ExpertReview() {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <h3 className="text-2xl font-bold">Expert Audit Review</h3>
        <p className="text-muted-foreground">
          Request a comprehensive review by residency audit specialists
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Professional Audit Defense Review</CardTitle>
          <CardDescription>
            Comprehensive analysis by certified professionals with audit defense experience
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-semibold">What's Included</h4>
              <div className="space-y-2">
                {[
                  'Complete residency documentation review',
                  'State-specific compliance analysis',
                  'Audit risk assessment and scoring',
                  'Personalized protection recommendations',
                  'Written report with action items',
                  'Follow-up consultation call'
                ].map((item) => (
                  <div key={item} className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-semibold">Turnaround & Pricing</h4>
              <div className="space-y-3">
                <div className="p-4 rounded-lg border">
                  <div className="font-medium">Standard Review</div>
                  <div className="text-sm text-muted-foreground">5-7 business days</div>
                  <div className="text-lg font-bold text-primary">$1,500</div>
                </div>
                <div className="p-4 rounded-lg border border-primary">
                  <div className="font-medium">Priority Review</div>
                  <div className="text-sm text-muted-foreground">2-3 business days</div>
                  <div className="text-lg font-bold text-primary">$2,500</div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="text-center pt-6 border-t">
            <Button size="lg">
              <MessageCircle className="h-5 w-5 mr-2" />
              Request Expert Review
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}