import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Trophy, Star, Shield, Users, Target, CheckCircle, ChevronRight, ChevronLeft } from 'lucide-react';

interface AthleteVIPOnboardingSlidesProps {
  onComplete: () => void;
  recipientName?: string;
  vipTier?: string;
}

interface SlideData {
  basicInfo: {
    name: string;
    sport: string;
    team: string;
    position: string;
    yearsActive: string;
    email: string;
    phone: string;
  };
  preferences: {
    communicationMethod: string;
    sessionPreference: string;
    primaryConcerns: string[];
  };
  goals: {
    shortTermGoals: string;
    longTermVision: string;
    retirementTimeline: string;
  };
}

const slides = [
  {
    id: 'welcome',
    title: 'Welcome to Your Elite Journey',
    component: 'WelcomeSlide'
  },
  {
    id: 'basic-info',
    title: 'Tell Us About Yourself',
    component: 'BasicInfoSlide'
  },
  {
    id: 'preferences',
    title: 'Communication & Support Preferences',
    component: 'PreferencesSlide'
  },
  {
    id: 'goals',
    title: 'Your Goals & Vision',
    component: 'GoalsSlide'
  },
  {
    id: 'marketplace',
    title: 'Marketplace Preview',
    component: 'MarketplaceSlide'
  },
  {
    id: 'completion',
    title: 'Welcome to the Elite Network',
    component: 'CompletionSlide'
  }
];

export function AthleteVIPOnboardingSlides({ 
  onComplete, 
  recipientName = 'Champion',
  vipTier = 'Founding Member'
}: AthleteVIPOnboardingSlidesProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slideData, setSlideData] = useState<SlideData>({
    basicInfo: {
      name: recipientName,
      sport: '',
      team: '',
      position: '',
      yearsActive: '',
      email: '',
      phone: ''
    },
    preferences: {
      communicationMethod: '',
      sessionPreference: '',
      primaryConcerns: []
    },
    goals: {
      shortTermGoals: '',
      longTermVision: '',
      retirementTimeline: ''
    }
  });

  const updateSlideData = (section: keyof SlideData, data: any) => {
    setSlideData(prev => ({
      ...prev,
      [section]: { ...prev[section], ...data }
    }));
  };

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(prev => prev + 1);
    } else {
      onComplete();
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(prev => prev - 1);
    }
  };

  const progress = ((currentSlide + 1) / slides.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-accent/5 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Trophy className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-bold">Athlete VIP Onboarding</h1>
          </div>
          <Progress value={progress} className="w-full max-w-md mx-auto h-2" />
          <p className="text-sm text-muted-foreground mt-2">
            Step {currentSlide + 1} of {slides.length}
          </p>
        </div>

        {/* Slide Content */}
        <Card className="min-h-[500px]">
          {currentSlide === 0 && <WelcomeSlide recipientName={recipientName} vipTier={vipTier} />}
          {currentSlide === 1 && (
            <BasicInfoSlide 
              data={slideData.basicInfo} 
              onChange={(data) => updateSlideData('basicInfo', data)} 
            />
          )}
          {currentSlide === 2 && (
            <PreferencesSlide 
              data={slideData.preferences} 
              onChange={(data) => updateSlideData('preferences', data)} 
            />
          )}
          {currentSlide === 3 && (
            <GoalsSlide 
              data={slideData.goals} 
              onChange={(data) => updateSlideData('goals', data)} 
            />
          )}
          {currentSlide === 4 && <MarketplaceSlide />}
          {currentSlide === 5 && <CompletionSlide onComplete={onComplete} />}
        </Card>

        {/* Navigation */}
        <div className="flex justify-between mt-6">
          <Button
            variant="outline"
            onClick={prevSlide}
            disabled={currentSlide === 0}
            className="flex items-center gap-2"
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>
          
          <Button
            onClick={nextSlide}
            className="flex items-center gap-2"
          >
            {currentSlide === slides.length - 1 ? 'Complete Setup' : 'Next'}
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

function WelcomeSlide({ recipientName, vipTier }: { recipientName: string; vipTier: string }) {
  return (
    <CardContent className="pt-8 text-center space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-center gap-2">
          <Trophy className="h-12 w-12 text-primary" />
          <Shield className="h-8 w-8 text-primary" />
        </div>
        
        <h2 className="text-3xl font-bold">Welcome, {recipientName}!</h2>
        
        <Badge variant="secondary" className="bg-gradient-elegant text-background text-lg px-4 py-2">
          <Star className="h-4 w-4 mr-2" />
          {vipTier}
        </Badge>
        
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          You've been selected as a founding member of our Athletes & Entertainers Wealth Education Center. 
          Join an elite community designed to protect and empower your financial future.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-4 mt-8">
        <div className="p-4 rounded-lg bg-primary/5 space-y-2">
          <Shield className="h-6 w-6 text-primary mx-auto" />
          <h3 className="font-semibold">Founding Badge</h3>
          <p className="text-sm text-muted-foreground">Premium marketplace positioning</p>
        </div>
        
        <div className="p-4 rounded-lg bg-primary/5 space-y-2">
          <Users className="h-6 w-6 text-primary mx-auto" />
          <h3 className="font-semibold">Elite Network</h3>
          <p className="text-sm text-muted-foreground">Connect with trusted advisors</p>
        </div>
        
        <div className="p-4 rounded-lg bg-primary/5 space-y-2">
          <Target className="h-6 w-6 text-primary mx-auto" />
          <h3 className="font-semibold">Tailored Education</h3>
          <p className="text-sm text-muted-foreground">Curriculum designed for athletes</p>
        </div>
      </div>
    </CardContent>
  );
}

function BasicInfoSlide({ data, onChange }: { data: any; onChange: (data: any) => void }) {
  return (
    <div>
      <CardHeader>
        <CardTitle>Tell Us About Yourself</CardTitle>
        <CardDescription>Help us personalize your experience</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="name">Full Name *</Label>
            <Input
              id="name"
              value={data.name}
              onChange={(e) => onChange({ name: e.target.value })}
              placeholder="Your full name"
            />
          </div>
          
          <div>
            <Label htmlFor="sport">Sport/Industry *</Label>
            <Select value={data.sport} onValueChange={(value) => onChange({ sport: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select your sport" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="football">Football (NFL)</SelectItem>
                <SelectItem value="basketball">Basketball (NBA/WNBA)</SelectItem>
                <SelectItem value="baseball">Baseball (MLB)</SelectItem>
                <SelectItem value="soccer">Soccer (MLS)</SelectItem>
                <SelectItem value="hockey">Hockey (NHL)</SelectItem>
                <SelectItem value="golf">Golf (PGA)</SelectItem>
                <SelectItem value="tennis">Tennis</SelectItem>
                <SelectItem value="olympic">Olympic Sports</SelectItem>
                <SelectItem value="entertainment">Entertainment</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="team">Current Team/Organization</Label>
            <Input
              id="team"
              value={data.team}
              onChange={(e) => onChange({ team: e.target.value })}
              placeholder="Team or organization"
            />
          </div>
          
          <div>
            <Label htmlFor="position">Position/Role</Label>
            <Input
              id="position"
              value={data.position}
              onChange={(e) => onChange({ position: e.target.value })}
              placeholder="Your position or role"
            />
          </div>
          
          <div>
            <Label htmlFor="yearsActive">Years Active</Label>
            <Select value={data.yearsActive} onValueChange={(value) => onChange({ yearsActive: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Years in profession" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1-3">1-3 years</SelectItem>
                <SelectItem value="4-7">4-7 years</SelectItem>
                <SelectItem value="8-12">8-12 years</SelectItem>
                <SelectItem value="13+">13+ years</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="email">Email Address *</Label>
            <Input
              id="email"
              type="email"
              value={data.email}
              onChange={(e) => onChange({ email: e.target.value })}
              placeholder="your.email@example.com"
            />
          </div>
        </div>
      </CardContent>
    </div>
  );
}

function PreferencesSlide({ data, onChange }: { data: any; onChange: (data: any) => void }) {
  const concerns = [
    'Financial planning for retirement',
    'Post-career depression and mental health',
    'Career transition planning',
    'Family and relationship management',
    'Investment and wealth protection',
    'Tax optimization strategies',
    'Business ventures and endorsements',
    'Estate planning and trusts'
  ];

  const toggleConcern = (concern: string) => {
    const newConcerns = data.primaryConcerns.includes(concern)
      ? data.primaryConcerns.filter((c: string) => c !== concern)
      : [...data.primaryConcerns, concern];
    onChange({ primaryConcerns: newConcerns });
  };

  return (
    <div>
      <CardHeader>
        <CardTitle>Communication & Support Preferences</CardTitle>
        <CardDescription>How would you like to engage with our platform?</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label>Preferred Communication Method</Label>
          <Select value={data.communicationMethod} onValueChange={(value) => onChange({ communicationMethod: value })}>
            <SelectTrigger>
              <SelectValue placeholder="How should we contact you?" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="email">Email</SelectItem>
              <SelectItem value="phone">Phone calls</SelectItem>
              <SelectItem value="text">Text messages</SelectItem>
              <SelectItem value="app">In-app notifications</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Session Preference</Label>
          <Select value={data.sessionPreference} onValueChange={(value) => onChange({ sessionPreference: value })}>
            <SelectTrigger>
              <SelectValue placeholder="How do you prefer to learn?" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="self-paced">Self-paced online modules</SelectItem>
              <SelectItem value="group-sessions">Group webinars and sessions</SelectItem>
              <SelectItem value="one-on-one">One-on-one consultations</SelectItem>
              <SelectItem value="mixed">Mix of all formats</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-base font-medium">Primary Concerns (Select all that apply)</Label>
          <div className="grid md:grid-cols-2 gap-3 mt-3">
            {concerns.map((concern) => (
              <div key={concern} className="flex items-center space-x-2">
                <Checkbox
                  id={concern}
                  checked={data.primaryConcerns.includes(concern)}
                  onCheckedChange={() => toggleConcern(concern)}
                />
                <Label htmlFor={concern} className="text-sm font-normal leading-relaxed">
                  {concern}
                </Label>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </div>
  );
}

function GoalsSlide({ data, onChange }: { data: any; onChange: (data: any) => void }) {
  return (
    <div>
      <CardHeader>
        <CardTitle>Your Goals & Vision</CardTitle>
        <CardDescription>Help us understand what success looks like for you</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label htmlFor="shortTermGoals">Short-term Goals (1-2 years)</Label>
          <Textarea
            id="shortTermGoals"
            value={data.shortTermGoals}
            onChange={(e) => onChange({ shortTermGoals: e.target.value })}
            placeholder="What do you want to achieve in the next 1-2 years?"
            rows={3}
          />
        </div>

        <div>
          <Label htmlFor="longTermVision">Long-term Vision (5+ years)</Label>
          <Textarea
            id="longTermVision"
            value={data.longTermVision}
            onChange={(e) => onChange({ longTermVision: e.target.value })}
            placeholder="What does your ideal future look like?"
            rows={3}
          />
        </div>

        <div>
          <Label>Retirement Timeline</Label>
          <Select value={data.retirementTimeline} onValueChange={(value) => onChange({ retirementTimeline: value })}>
            <SelectTrigger>
              <SelectValue placeholder="When do you plan to retire from your sport?" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1-2-years">1-2 years</SelectItem>
              <SelectItem value="3-5-years">3-5 years</SelectItem>
              <SelectItem value="5-10-years">5-10 years</SelectItem>
              <SelectItem value="10+-years">10+ years</SelectItem>
              <SelectItem value="unsure">Not sure yet</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </div>
  );
}

function MarketplaceSlide() {
  return (
    <div>
      <CardHeader>
        <CardTitle>Marketplace Preview</CardTitle>
        <CardDescription>Connect with trusted advisors in our exclusive network</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="font-semibold">Featured Advisors</h3>
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-4 border rounded-lg space-y-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium">Elite Financial Advisor</h4>
                    <p className="text-sm text-muted-foreground">Athlete Specialist</p>
                  </div>
                </div>
                <Badge variant="outline" className="text-xs">Verified</Badge>
              </div>
            ))}
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold">Your Benefits</h3>
            <div className="space-y-3">
              {[
                'Priority access to top advisors',
                'Reduced consultation fees',
                'Exclusive athlete-focused resources',
                'VIP customer support'
              ].map((benefit, index) => (
                <div key={index} className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm">{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </div>
  );
}

function CompletionSlide({ onComplete }: { onComplete: () => void }) {
  return (
    <CardContent className="pt-8 text-center space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-center">
          <CheckCircle className="h-16 w-16 text-green-500" />
        </div>
        
        <h2 className="text-3xl font-bold">Welcome to the Elite Network!</h2>
        
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          You're now part of an exclusive community of athletes and entertainers committed to 
          protecting and growing their wealth. Your journey to financial excellence starts now.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-4 mt-8">
        <div className="p-4 rounded-lg bg-green-50 space-y-2">
          <Trophy className="h-6 w-6 text-green-600 mx-auto" />
          <h3 className="font-semibold text-green-800">Profile Created</h3>
          <p className="text-sm text-green-700">Your VIP profile is live</p>
        </div>
        
        <div className="p-4 rounded-lg bg-blue-50 space-y-2">
          <Target className="h-6 w-6 text-blue-600 mx-auto" />
          <h3 className="font-semibold text-blue-800">Curriculum Ready</h3>
          <p className="text-sm text-blue-700">Start learning immediately</p>
        </div>
        
        <div className="p-4 rounded-lg bg-purple-50 space-y-2">
          <Users className="h-6 w-6 text-purple-600 mx-auto" />
          <h3 className="font-semibold text-purple-800">Network Access</h3>
          <p className="text-sm text-purple-700">Connect with advisors</p>
        </div>
      </div>

      <div className="pt-6">
        <Button size="lg" onClick={onComplete} className="px-8">
          Start My Journey
        </Button>
      </div>
    </CardContent>
  );
}