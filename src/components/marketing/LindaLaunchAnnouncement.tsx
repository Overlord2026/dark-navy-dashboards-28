import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Phone, 
  MessageSquare, 
  Play, 
  Sparkles, 
  Clock, 
  TrendingUp,
  Users,
  Calendar,
  CheckCircle,
  Star
} from 'lucide-react';

interface LindaLaunchAnnouncementProps {
  onEnableLinda?: () => void;
  onBookDemo?: () => void;
  userPersona?: string;
}

export const LindaLaunchAnnouncement = ({ 
  onEnableLinda, 
  onBookDemo, 
  userPersona = 'advisor' 
}: LindaLaunchAnnouncementProps) => {
  const [showDemo, setShowDemo] = useState(false);

  const personaBenefits = {
    advisor: {
      title: 'Meet Linda - Your AI Meeting Assistant',
      subtitle: 'Save 15+ hours per week on scheduling tasks',
      benefits: [
        'Automatically confirm client appointments',
        'Handle reschedule requests professionally',
        'Send branded reminders and follow-ups',
        'Reduce no-shows by up to 70%'
      ],
      cta: 'Try Linda for Advisors'
    },
    cpa: {
      title: 'Linda: AI Assistant for Tax Season',
      subtitle: 'Never miss an appointment or deadline',
      benefits: [
        'Confirm tax appointment bookings',
        'Remind clients about document deadlines',
        'Handle year-end planning meetings',
        'Reduce administrative workload'
      ],
      cta: 'Enable Linda for CPAs'
    },
    attorney: {
      title: 'Linda: Legal Practice Assistant',
      subtitle: 'Professional client communication, automated',
      benefits: [
        'Confirm consultation appointments',
        'Handle court date preparations',
        'Follow up on document requests',
        'Maintain professional client relationships'
      ],
      cta: 'Activate Linda for Legal'
    }
  };

  const currentPersona = personaBenefits[userPersona] || personaBenefits.advisor;

  const handleTryLinda = () => {
    if (onEnableLinda) {
      onEnableLinda();
    } else {
      // Default action - could navigate to settings
      console.log('Enable Linda clicked');
    }
  };

  const handleBookDemo = () => {
    if (onBookDemo) {
      onBookDemo();
    } else {
      // Default action - could open demo booking modal
      console.log('Book demo clicked');
    }
  };

  return (
    <div className="space-y-6">
      {/* Main Announcement Banner */}
      <Card className="border-2 border-amber-200 bg-gradient-to-br from-amber-50 via-white to-emerald-50 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-amber-200 to-emerald-200 rounded-full -translate-y-16 translate-x-16 opacity-20" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-primary/20 to-accent/20 rounded-full translate-y-12 -translate-x-12" />
        
        <CardHeader className="pb-4 relative">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <Phone className="h-6 w-6 text-white" />
            </div>
            <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0">
              <Sparkles className="h-3 w-3 mr-1" />
              NEW FEATURE
            </Badge>
          </div>
          <CardTitle className="text-2xl text-navy-800">{currentPersona.title}</CardTitle>
          <p className="text-lg text-muted-foreground">{currentPersona.subtitle}</p>
        </CardHeader>
        
        <CardContent className="space-y-6 relative">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-semibold text-navy-800 flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-emerald-600" />
                What Linda Does for You:
              </h3>
              <ul className="space-y-2">
                {currentPersona.benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 mt-2 flex-shrink-0" />
                    {benefit}
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="space-y-4">
              <div className="bg-white/80 backdrop-blur rounded-lg p-4 border border-white/50">
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-emerald-600" />
                  Instant Impact:
                </h4>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold text-emerald-600">70%</p>
                    <p className="text-xs text-muted-foreground">Fewer No-Shows</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-primary">15hrs</p>
                    <p className="text-xs text-muted-foreground">Saved Per Week</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Button 
                  onClick={handleTryLinda}
                  className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 gap-2"
                  size="lg"
                >
                  <Phone className="h-4 w-4" />
                  {currentPersona.cta}
                </Button>
                
                <div className="grid grid-cols-2 gap-2">
                  <Dialog open={showDemo} onOpenChange={setShowDemo}>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="gap-2">
                        <Play className="h-4 w-4" />
                        Watch Demo
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-lg">
                      <DialogHeader>
                        <DialogTitle>Linda in Action - Demo Call</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                          <div className="text-center">
                            <Play className="h-12 w-12 mx-auto mb-2 text-muted-foreground" />
                            <p className="text-sm text-muted-foreground">Demo video placeholder</p>
                            <p className="text-xs text-muted-foreground mt-1">
                              See Linda handling real client interactions
                            </p>
                          </div>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                  
                  <Button 
                    variant="outline" 
                    onClick={handleBookDemo}
                    className="gap-2"
                  >
                    <Calendar className="h-4 w-4" />
                    Book Demo
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Feature Highlights */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card className="text-center">
          <CardContent className="p-6">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
              <Phone className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold mb-2">Natural Voice Calls</h3>
            <p className="text-sm text-muted-foreground">
              Linda speaks naturally and professionally, representing your firm with every call
            </p>
          </CardContent>
        </Card>
        
        <Card className="text-center">
          <CardContent className="p-6">
            <div className="h-12 w-12 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-3">
              <MessageSquare className="h-6 w-6 text-emerald-600" />
            </div>
            <h3 className="font-semibold mb-2">Smart SMS Backup</h3>
            <p className="text-sm text-muted-foreground">
              If clients don't answer, Linda automatically sends a branded SMS message
            </p>
          </CardContent>
        </Card>
        
        <Card className="text-center">
          <CardContent className="p-6">
            <div className="h-12 w-12 rounded-full bg-amber-500/10 flex items-center justify-center mx-auto mb-3">
              <Star className="h-6 w-6 text-amber-600" />
            </div>
            <h3 className="font-semibold mb-2">24/7 Availability</h3>
            <p className="text-sm text-muted-foreground">
              Linda works around the clock, even when your office is closed
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Pricing Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Linda AI Pricing
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <Badge variant="outline" className="mb-2">Basic Plan</Badge>
              <p className="text-lg font-semibold">+$10/month</p>
              <p className="text-sm text-muted-foreground">Add-on for Basic subscribers</p>
            </div>
            <div className="text-center p-4 border rounded-lg bg-primary/5 border-primary/20">
              <Badge className="mb-2">Pro Plan</Badge>
              <p className="text-lg font-semibold text-emerald-600">Included</p>
              <p className="text-sm text-muted-foreground">No additional cost</p>
            </div>
            <div className="text-center p-4 border rounded-lg bg-primary/5 border-primary/20">
              <Badge className="mb-2">Premium Plan</Badge>
              <p className="text-lg font-semibold text-emerald-600">Included</p>
              <p className="text-sm text-muted-foreground">Full feature access</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};