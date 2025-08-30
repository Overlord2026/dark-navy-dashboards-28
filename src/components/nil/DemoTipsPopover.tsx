import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { X, Lightbulb, Users, CheckCircle2, FileText } from 'lucide-react';
import { getNilSnapshot } from '@/fixtures/fixtures.nil';

export function DemoTipsPopover() {
  const [isVisible, setIsVisible] = useState(false);
  const [hasBeenShown, setHasBeenShown] = useState(false);

  useEffect(() => {
    // Check if demo was just loaded and we haven't shown tips yet
    const snapshot = getNilSnapshot();
    const shownKey = 'nil_demo_tips_shown';
    const hasShown = localStorage.getItem(shownKey);
    
    if (snapshot && !hasShown && !hasBeenShown) {
      // Show after a brief delay
      const timer = setTimeout(() => {
        setIsVisible(true);
        setHasBeenShown(true);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [hasBeenShown]);

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem('nil_demo_tips_shown', 'true');
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="max-w-md w-full">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-yellow-500" />
              <CardTitle className="text-lg">Demo Tips</CardTitle>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDismiss}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <CardDescription>
            Your NIL demo is ready! Here's what you can showcase:
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <Users className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-sm">Send an invite</p>
                <p className="text-xs text-muted-foreground">
                  Invite becomes "pending" status
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-sm">Education</p>
                <p className="text-xs text-muted-foreground">
                  Already complete (3/3 modules)
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <FileText className="h-5 w-5 text-purple-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-sm">Create/preview offer</p>
                <p className="text-xs text-muted-foreground">
                  Generates a receipt (🔒 content-free)
                </p>
              </div>
            </div>
          </div>
          
          <Button onClick={handleDismiss} className="w-full" size="sm">
            Got it!
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}