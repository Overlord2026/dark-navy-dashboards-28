import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Calendar, Mail, Phone, Target } from 'lucide-react';
import { motion } from 'framer-motion';

interface CallToActionSlideProps {
  liveDemoMode?: boolean;
  whiteLabelEnabled?: boolean;
  presentationMode?: boolean;
}

export const CallToActionSlide: React.FC<CallToActionSlideProps> = ({
  liveDemoMode,
  whiteLabelEnabled,
  presentationMode
}) => {
  const nextSteps = [
    {
      step: '1',
      title: 'Schedule Your Demo',
      description: 'See the SWAG™ GPS™ in action with your own client scenarios',
      action: 'Book 30-min demo',
      icon: Calendar
    },
    {
      step: '2',
      title: 'Custom Implementation',
      description: 'We\'ll configure the platform with your branding and workflows',
      action: 'Start onboarding',
      icon: Target
    },
    {
      step: '3',
      title: 'Launch & Support',
      description: 'Go live with full training and ongoing support',
      action: 'Begin transformation',
      icon: ArrowRight
    }
  ];

  const benefits = [
    'Elevate client conversations with data-driven insights',
    'Differentiate your practice with cutting-edge technology',
    'Increase client engagement and satisfaction',
    'Scale your planning process efficiently',
    'White-label solution maintains your brand authority'
  ];

  return (
    <div className="min-h-[600px] p-8 md:p-16 bg-gradient-to-br from-primary/5 via-background to-accent/5">
      <div className="max-w-6xl mx-auto">
        {/* Main CTA Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          {/* Path Graphic */}
          <div className="relative mb-8">
            <svg
              className="w-full h-32 max-w-md mx-auto"
              viewBox="0 0 400 120"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <motion.path
                d="M50 60 Q 200 20, 350 60"
                stroke="url(#gradient)"
                strokeWidth="6"
                fill="none"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 2, delay: 0.5 }}
              />
              <motion.circle
                cx="350"
                cy="60"
                r="8"
                fill="hsl(var(--primary))"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 2.5 }}
              />
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="hsl(var(--primary))" />
                  <stop offset="100%" stopColor="hsl(var(--accent))" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Badge variant="outline" className="mb-6 text-lg px-4 py-2">
              Ready to Transform Your Practice?
            </Badge>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Retire Once.
              </span>
              <br />
              <span className="text-foreground">Stay Retired.™</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
              It's time to elevate your client conversations. With the SWAG™ GPS™ Retirement Roadmap, 
              you'll offer more than advice — you'll give clients the tools, confidence, and clarity they deserve.
            </p>
          </motion.div>

          {/* Primary CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
          >
            <Button size="lg" className="text-lg px-8 py-6 h-auto">
              <Calendar className="h-5 w-5 mr-3" />
              Schedule Demo
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 py-6 h-auto">
              <Mail className="h-5 w-5 mr-3" />
              Request Information
            </Button>
          </motion.div>
        </motion.div>

        {/* Next Steps Process */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-center mb-12">Your Journey to Success</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {nextSteps.map((step, index) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1 + index * 0.2 }}
              >
                <Card className="relative overflow-hidden border-2 border-primary/20 hover:border-primary/40 transition-all duration-300 hover:shadow-lg">
                  <CardContent className="p-8 text-center">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                      <step.icon className="h-8 w-8 text-primary" />
                    </div>
                    
                    <div className="absolute top-4 right-4">
                      <Badge variant="default" className="w-8 h-8 rounded-full p-0 flex items-center justify-center">
                        {step.step}
                      </Badge>
                    </div>
                    
                    <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                    <p className="text-muted-foreground mb-6">{step.description}</p>
                    
                    <Button variant="outline" className="w-full">
                      {step.action}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Benefits Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.2 }}
          className="mb-16"
        >
          <Card className="bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20">
            <CardContent className="p-8">
              <h3 className="text-2xl font-semibold text-center mb-8">
                Transform Your Practice Today
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {benefits.map((benefit, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 1.4 + index * 0.1 }}
                    className="flex items-center space-x-3"
                  >
                    <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0" />
                    <span className="text-sm font-medium">{benefit}</span>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Contact Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.6 }}
          className="text-center"
        >
          <Card className="bg-muted/30">
            <CardContent className="p-8">
              <h3 className="text-xl font-semibold mb-6">Ready to Get Started?</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                <div className="flex flex-col items-center space-y-2">
                  <Phone className="h-6 w-6 text-primary" />
                  <div className="font-medium">(555) 123-4567</div>
                  <div className="text-sm text-muted-foreground">Call for immediate assistance</div>
                </div>
                
                <div className="flex flex-col items-center space-y-2">
                  <Mail className="h-6 w-6 text-primary" />
                  <div className="font-medium">sales@swagretirement.com</div>
                  <div className="text-sm text-muted-foreground">Email for detailed information</div>
                </div>
                
                <div className="flex flex-col items-center space-y-2">
                  <Calendar className="h-6 w-6 text-primary" />
                  <div className="font-medium">calendly.com/swag-demo</div>
                  <div className="text-sm text-muted-foreground">Book your demo online</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Script Box */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.8 }}
          className="mt-8"
        >
          <Card className="bg-muted/30">
            <CardContent className="p-6">
              <h4 className="font-semibold mb-3">Advisor Script:</h4>
              <p className="text-sm leading-relaxed italic">
                "It's time to elevate your client conversations. With the SWAG™ GPS™ Retirement Roadmap, 
                you'll offer more than advice — you'll give clients the tools, confidence, and clarity they deserve. 
                Your career is short. Your legacy is forever. Let's build something extraordinary together."
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};