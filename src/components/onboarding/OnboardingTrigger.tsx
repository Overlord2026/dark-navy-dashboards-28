import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AdvisorOnboardingSlides } from './AdvisorOnboardingSlides';
import { 
  Play, 
  Star, 
  Users, 
  BarChart3, 
  Target,
  Sparkles,
  BookOpen,
  Video
} from 'lucide-react';

export const OnboardingTrigger: React.FC = () => {
  const [showOnboarding, setShowOnboarding] = useState(false);

  return (
    <>
      <Card className="border-primary bg-gradient-to-r from-primary/5 to-accent/5">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            <CardTitle>New to the Lead Engine?</CardTitle>
            <Badge variant="default" className="ml-auto">5 min tour</Badge>
          </div>
          <CardDescription>
            Master your Lead-to-Sales Engine with our interactive walkthrough. 
            Learn to track prospects, automate campaigns, and grow your practice.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="flex items-center gap-2 text-sm">
              <Users className="h-4 w-4 text-primary" />
              <span>Prospect Management</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <BarChart3 className="h-4 w-4 text-primary" />
              <span>ROI Analytics</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Target className="h-4 w-4 text-primary" />
              <span>Campaign Automation</span>
            </div>
          </div>
          
          <div className="flex gap-3">
            <Button 
              onClick={() => setShowOnboarding(true)}
              className="flex-1 gap-2"
            >
              <Play className="h-4 w-4" />
              Start Interactive Tour
            </Button>
            <Button 
              variant="outline" 
              className="gap-2"
              onClick={() => setShowOnboarding(true)}
            >
              <BookOpen className="h-4 w-4" />
              Quick Start
            </Button>
          </div>
          
          <div className="mt-4 p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Star className="h-4 w-4 text-yellow-500" />
              <span>Learn about Premium features: SWAG Lead Score™, Tax Scanning, Estate Planning Tools</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <AdvisorOnboardingSlides 
        isOpen={showOnboarding}
        onClose={() => setShowOnboarding(false)}
      />
    </>
  );
};