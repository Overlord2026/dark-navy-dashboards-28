import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Helmet } from 'react-helmet-async';
import { toast } from 'sonner';
import { analytics } from '@/lib/analytics';
import { CheckCircle, Users, Target, Heart, TrendingUp, Shield } from 'lucide-react';

interface FamilyOnboardingState {
  segment: 'aspiring' | 'retirees' | null;
  goals: string[];
  email: string;
}

const SEGMENTS = [
  {
    key: 'aspiring' as const,
    title: 'Aspiring Wealthy',
    description: 'Building wealth systematically with smart automation and professional guidance',
    icon: TrendingUp,
    color: 'from-emerald-50 to-green-50 border-emerald-200'
  },
  {
    key: 'retirees' as const,
    title: 'Retirees',
    description: 'Income planning, estate organization, and legacy management',
    icon: Shield,
    color: 'from-blue-50 to-indigo-50 border-blue-200'
  }
];

const GOALS = [
  { key: 'organize', label: 'Organize', icon: Target, description: 'Accounts, docs, and professionals' },
  { key: 'plan', label: 'Plan', icon: TrendingUp, description: 'Financial roadmaps and strategies' },
  { key: 'comply', label: 'Comply', icon: CheckCircle, description: 'Regulations and requirements' },
  { key: 'prove', label: 'Prove', icon: Shield, description: 'Audit trails and documentation' },
  { key: 'collaborate', label: 'Collaborate', icon: Users, description: 'Family and trusted professionals' }
];

export default function FamilyOnboarding() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [state, setState] = useState<FamilyOnboardingState>({
    segment: (searchParams.get('seg') as 'aspiring' | 'retirees') || null,
    goals: [],
    email: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    analytics.trackFamilyOnboardingStart(state.segment || undefined, { 
      referrer: document.referrer
    });
    
    // Skip to step 2 if segment is pre-selected
    if (state.segment) {
      setStep(2);
    }
  }, []);

  const handleSegmentSelect = (segment: 'aspiring' | 'retirees') => {
    setState(prev => ({ ...prev, segment }));
    analytics.trackFamilySegmentSelection(segment);
    setStep(2);
  };

  const handleGoalToggle = (goalKey: string) => {
    setState(prev => ({
      ...prev,
      goals: prev.goals.includes(goalKey)
        ? prev.goals.filter(g => g !== goalKey)
        : [...prev.goals, goalKey]
    }));
  };

  const handleComplete = async () => {
    if (!state.email || !state.segment) return;
    
    setLoading(true);
    
    try {
      analytics.trackFamilyGoalsSelection(state.goals, { segment: state.segment });

      // Simulate API call to create workspace
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Store session data
      localStorage.setItem('user_session', JSON.stringify({
        email: state.email,
        segment: state.segment,
        goals: state.goals,
        onboarded: true
      }));

      analytics.trackFamilyOnboardingComplete(state.segment, state.goals, {
        email: state.email,
        goals_count: state.goals.length
      });

      toast.success('Welcome to your Family Workspace!');
      navigate('/family/home');
      
    } catch (error) {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Family Onboarding - Get Started</title>
        <meta name="description" content="Quick 3-step setup for your private family workspace" />
      </Helmet>
      
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 p-4">
        <div className="max-w-4xl mx-auto pt-12">
          
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl font-bold text-foreground">Set up your Family Workspace</h1>
              <div className="text-sm text-muted-foreground">Step {step} of 3</div>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div 
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${(step / 3) * 100}%` }}
              />
            </div>
          </div>

          {/* Step 1: Segment Selection */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-xl font-semibold mb-2">Choose your family stage</h2>
                <p className="text-muted-foreground">This helps us personalize your workspace</p>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                {SEGMENTS.map((segment) => {
                  const IconComponent = segment.icon;
                  return (
                    <Card
                      key={segment.key}
                      className={`cursor-pointer transition-all duration-200 hover:shadow-lg bg-gradient-to-br ${segment.color}`}
                      onClick={() => handleSegmentSelect(segment.key)}
                    >
                      <CardContent className="p-8 text-center">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-lg bg-white/80 flex items-center justify-center">
                          <IconComponent className="w-8 h-8 text-primary" />
                        </div>
                        <h3 className="text-xl font-semibold mb-2">{segment.title}</h3>
                        <p className="text-muted-foreground">{segment.description}</p>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          )}

          {/* Step 2: Goals Selection */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-xl font-semibold mb-2">What are your main goals?</h2>
                <p className="text-muted-foreground">Select all that apply - we'll tailor your dashboard</p>
              </div>
              
              <div className="grid md:grid-cols-5 gap-4">
                {GOALS.map((goal) => {
                  const IconComponent = goal.icon;
                  const isSelected = state.goals.includes(goal.key);
                  
                  return (
                    <Card
                      key={goal.key}
                      className={`cursor-pointer transition-all duration-200 ${
                        isSelected ? 'ring-2 ring-primary shadow-lg' : 'hover:shadow-md'
                      }`}
                      onClick={() => handleGoalToggle(goal.key)}
                    >
                      <CardContent className="p-6 text-center">
                        <div className={`w-12 h-12 mx-auto mb-3 rounded-lg flex items-center justify-center ${
                          isSelected ? 'bg-primary text-primary-foreground' : 'bg-muted'
                        }`}>
                          <IconComponent className="w-6 h-6" />
                        </div>
                        <h3 className="font-semibold mb-1">{goal.label}</h3>
                        <p className="text-xs text-muted-foreground">{goal.description}</p>
                        {isSelected && (
                          <Badge variant="default" className="mt-2 text-xs">Selected</Badge>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
              
              <div className="flex gap-4 justify-center">
                <Button variant="outline" onClick={() => setStep(1)}>
                  Back
                </Button>
                <Button 
                  onClick={() => setStep(3)}
                  disabled={state.goals.length === 0}
                >
                  Continue ({state.goals.length} selected)
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Email */}
          {step === 3 && (
            <div className="max-w-md mx-auto">
              <Card>
                <CardHeader className="text-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Heart className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Almost done!</CardTitle>
                  <p className="text-muted-foreground">Enter your email to create your workspace</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={state.email}
                      onChange={(e) => setState(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="your@email.com"
                      autoFocus
                    />
                  </div>
                  
                  <div className="text-sm text-muted-foreground">
                    <p>✓ {SEGMENTS.find(s => s.key === state.segment)?.title} workspace</p>
                    <p>✓ {state.goals.length} goals selected</p>
                    <p>✓ Personalized dashboard ready</p>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => setStep(2)} className="flex-1">
                      Back
                    </Button>
                    <Button 
                      onClick={handleComplete}
                      disabled={!state.email || loading}
                      className="flex-1"
                    >
                      {loading ? 'Creating workspace...' : 'Launch workspace'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </>
  );
}