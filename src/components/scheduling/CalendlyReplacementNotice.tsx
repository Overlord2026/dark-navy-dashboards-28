import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Calendar, ArrowRight, Star, CheckCircle } from 'lucide-react';

interface CalendlyReplacementNoticeProps {
  onUseBFOScheduling: () => void;
  onContinueWithCalendly?: () => void;
  showCalendlyOption?: boolean;
}

export function CalendlyReplacementNotice({ 
  onUseBFOScheduling, 
  onContinueWithCalendly,
  showCalendlyOption = false 
}: CalendlyReplacementNoticeProps) {
  return (
    <div className="space-y-4">
      <Alert className="border-primary/20 bg-primary/5">
        <Calendar className="h-4 w-4" />
        <AlertDescription>
          <div className="space-y-3">
            <div>
              <strong>BFO Platform Minimization Update:</strong> We're transitioning from external scheduling platforms to our integrated BFO Scheduling Engine.
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* BFO Scheduling Option */}
              <Card className="border-primary/20">
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="flex items-center gap-1">
                        <Star className="h-3 w-3" />
                        Recommended
                      </Badge>
                      <span className="font-medium">BFO Scheduling</span>
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-3 w-3 text-green-500" />
                        <span>Integrated with Google Calendar</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-3 w-3 text-green-500" />
                        <span>Automatic Google Meet creation</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-3 w-3 text-green-500" />
                        <span>BFO-branded experience</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-3 w-3 text-green-500" />
                        <span>Built-in follow-up workflows</span>
                      </div>
                    </div>
                    
                    <Button 
                      onClick={onUseBFOScheduling}
                      className="w-full"
                    >
                      Use BFO Scheduling
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Legacy Calendly Option */}
              {showCalendlyOption && (
                <Card className="border-muted">
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">Legacy</Badge>
                        <span className="font-medium">Continue with Calendly</span>
                      </div>
                      
                      <div className="text-sm text-muted-foreground">
                        <p>Continue using the external Calendly platform. This option will be phased out as we complete the migration to BFO's integrated scheduling.</p>
                      </div>
                      
                      <Button 
                        variant="outline" 
                        onClick={onContinueWithCalendly}
                        className="w-full"
                      >
                        Continue with Calendly
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </AlertDescription>
      </Alert>
    </div>
  );
}