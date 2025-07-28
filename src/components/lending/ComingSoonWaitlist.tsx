import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Rocket, Zap, Globe, Brain, Star } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface ComingSoonWaitlistProps {
  productType: 'ai_features' | 'international' | 'partner_signup';
}

const ComingSoonWaitlist: React.FC<ComingSoonWaitlistProps> = ({ productType }) => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [interest, setInterest] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const { toast } = useToast();

  const productConfig = {
    ai_features: {
      title: 'AI-Powered Lending Features',
      subtitle: 'Advanced AI for smarter loan decisions',
      icon: Brain,
      features: [
        'AI-powered credit risk assessment',
        'Automated document processing',
        'Real-time fraud detection',
        'Personalized loan recommendations',
        'Predictive analytics dashboard'
      ],
      badge: 'Coming Q2 2024',
      color: 'bg-gradient-to-r from-purple-500 to-pink-500'
    },
    international: {
      title: 'International Lending',
      subtitle: 'Expand to global markets',
      icon: Globe,
      features: [
        'Multi-currency loan processing',
        'International credit checks',
        'Global compliance management',
        'Cross-border documentation',
        'Regional partner networks'
      ],
      badge: 'Coming Q3 2024',
      color: 'bg-gradient-to-r from-blue-500 to-teal-500'
    },
    partner_signup: {
      title: 'Partner Program',
      subtitle: 'Join our lending network',
      icon: Star,
      features: [
        'Instant loan referral system',
        'Revenue sharing program',
        'Co-branded loan products',
        'Dedicated partner portal',
        'Priority support channel'
      ],
      badge: 'Accepting Applications',
      color: 'bg-gradient-to-r from-orange-500 to-red-500'
    }
  };

  const config = productConfig[productType];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Submit to waitlist
      const { error } = await supabase
        .from('analytics_events')
        .insert({
          event_type: 'waitlist_signup',
          event_category: 'marketing',
          event_data: {
            product_type: productType,
            email,
            name,
            company,
            interest,
            timestamp: new Date().toISOString()
          }
        });

      if (error) throw error;

      // Send confirmation email via edge function
      await supabase.functions.invoke('crm-notification-system', {
        body: {
          action: 'send_notification',
          recipient_type: 'prospect',
          recipient_id: email,
          notification_type: 'waitlist_confirmation',
          data: {
            product_type: productType,
            name,
            features: config.features
          }
        }
      });

      setIsSubmitted(true);
      toast({
        title: "Welcome to the Waitlist!",
        description: "We'll notify you as soon as this feature is available."
      });

    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to join waitlist. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardContent className="pt-6">
          <div className="text-center space-y-6">
            <div className={`w-20 h-20 mx-auto rounded-full ${config.color} flex items-center justify-center`}>
              <CheckCircle className="w-10 h-10 text-white" />
            </div>
            
            <div>
              <h3 className="text-2xl font-bold mb-2">You're on the list!</h3>
              <p className="text-muted-foreground">
                Thanks for your interest in {config.title.toLowerCase()}. 
                We'll send you an email as soon as it's available.
              </p>
            </div>

            <div className="bg-muted p-4 rounded-lg">
              <h4 className="font-semibold mb-2">What happens next?</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• You'll receive a confirmation email shortly</li>
                <li>• We'll send updates on development progress</li>
                <li>• You'll get early access when available</li>
                <li>• Priority customer support</li>
              </ul>
            </div>

            <Button 
              variant="outline" 
              onClick={() => setIsSubmitted(false)}
            >
              Sign up for another feature
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const IconComponent = config.icon;

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className={`w-12 h-12 rounded-full ${config.color} flex items-center justify-center`}>
              <IconComponent className="w-6 h-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-xl">{config.title}</CardTitle>
              <p className="text-muted-foreground">{config.subtitle}</p>
            </div>
          </div>
          <Badge variant="secondary">{config.badge}</Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <div>
          <h4 className="font-semibold mb-3">What's Coming:</h4>
          <div className="grid gap-2">
            {config.features.map((feature, index) => (
              <div key={index} className="flex items-center space-x-2">
                <Zap className="w-4 h-4 text-primary" />
                <span className="text-sm">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                required
              />
            </div>
            <div>
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="john@company.com"
                required
              />
            </div>
          </div>

          {productType === 'partner_signup' && (
            <div>
              <Label htmlFor="company">Company Name</Label>
              <Input
                id="company"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="Your Company"
              />
            </div>
          )}

          <div>
            <Label htmlFor="interest">
              What interests you most about this feature?
            </Label>
            <Input
              id="interest"
              value={interest}
              onChange={(e) => setInterest(e.target.value)}
              placeholder="Tell us what you're looking forward to..."
            />
          </div>

          <Button 
            type="submit" 
            className="w-full" 
            disabled={loading}
          >
            {loading ? (
              <>
                <Rocket className="w-4 h-4 mr-2 animate-spin" />
                Joining Waitlist...
              </>
            ) : (
              <>
                <Rocket className="w-4 h-4 mr-2" />
                Join the Waitlist
              </>
            )}
          </Button>

          <p className="text-xs text-muted-foreground text-center">
            By joining, you agree to receive updates about this feature. 
            Unsubscribe anytime.
          </p>
        </form>

        <div className="bg-muted p-4 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <Star className="w-4 h-4 text-yellow-500" />
            <span className="font-semibold text-sm">Early Access Benefits</span>
          </div>
          <ul className="text-xs text-muted-foreground space-y-1">
            <li>• 30-day free trial when available</li>
            <li>• Priority onboarding support</li>
            <li>• Feedback sessions with our team</li>
            <li>• Special launch pricing</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default ComingSoonWaitlist;