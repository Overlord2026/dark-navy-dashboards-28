import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Play, ArrowRight } from 'lucide-react';

export const AdvisorBenefitsOverview: React.FC = () => {
  const [showVideo, setShowVideo] = useState(false);

  const handleWatchWalkthrough = () => {
    setShowVideo(true);
    // Here you would typically embed or launch a video player
    setTimeout(() => {
      // Simulate video completion and redirect to dashboard
      window.location.href = '/advisor-dashboard';
    }, 3000);
  };

  const completedSteps = [
    'Account created successfully',
    'Email verification sent',
    'Basic profile setup complete',
    'Platform access granted'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-4xl text-center"
      >
        <Card className="border-2 border-primary bg-gradient-to-br from-primary/5 to-primary/10">
          <CardHeader className="pb-6">
            <div className="mx-auto w-16 h-16 bg-primary rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="h-8 w-8 text-primary-foreground" />
            </div>
            
            <CardTitle className="text-3xl">Welcome to Your Advisor Platform!</CardTitle>
            <CardDescription className="text-lg">
              Your account is ready. Let's show you around your new command center.
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-8">
            {/* Completion Status */}
            <div className="grid md:grid-cols-2 gap-4">
              {completedSteps.map((step, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-background/50 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <span className="text-sm font-medium">{step}</span>
                </div>
              ))}
            </div>

            {/* Next Steps */}
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-3">What's Next?</h3>
                <p className="text-muted-foreground">
                  Watch our 3-minute dashboard walkthrough to see how to:
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-4 text-left">
                <div className="p-4 bg-background/50 rounded-lg">
                  <div className="font-semibold text-sm mb-1">Set Up Your Profile</div>
                  <div className="text-xs text-muted-foreground">
                    Complete your advisor profile and practice details
                  </div>
                </div>
                
                <div className="p-4 bg-background/50 rounded-lg">
                  <div className="font-semibold text-sm mb-1">Import Clients</div>
                  <div className="text-xs text-muted-foreground">
                    Add existing clients to your secure dashboard
                  </div>
                </div>
                
                <div className="p-4 bg-background/50 rounded-lg">
                  <div className="font-semibold text-sm mb-1">Explore Tools</div>
                  <div className="text-xs text-muted-foreground">
                    Discover CRM, messaging, and analytics features
                  </div>
                </div>
              </div>

              {/* Video Section */}
              {!showVideo ? (
                <div className="space-y-4">
                  <Button 
                    onClick={handleWatchWalkthrough}
                    size="lg" 
                    className="w-full md:w-auto text-lg px-8 py-6"
                  >
                    <Play className="mr-2 h-5 w-5" />
                    Watch Dashboard Walkthrough (3 min)
                  </Button>
                  
                  <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                    <span>Or</span>
                    <Button variant="link" className="p-0 h-auto text-sm">
                      skip to dashboard
                      <ArrowRight className="ml-1 h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <Play className="h-16 w-16 text-primary mx-auto mb-4" />
                      <p className="text-lg font-semibold">Dashboard Walkthrough Video</p>
                      <p className="text-sm text-muted-foreground">Loading your personalized tour...</p>
                    </div>
                  </div>
                  
                  <Badge variant="secondary" className="mx-auto">
                    Redirecting to your dashboard...
                  </Badge>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};