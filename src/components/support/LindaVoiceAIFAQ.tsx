import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Phone, MessageSquare, Play, Volume2, Shield, Settings, Clock } from 'lucide-react';

interface LindaVoiceAIFAQProps {
  userPersona?: string;
}

export const LindaVoiceAIFAQ = ({ userPersona = 'advisor' }: LindaVoiceAIFAQProps) => {
  const [showDemo, setShowDemo] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const lindaFAQs = [
    {
      id: 'linda-what-is',
      question: 'What is Linda, the Voice AI Meeting Assistant?',
      answer: 'Linda is your intelligent AI assistant who handles meeting confirmations, reminders, and follow-ups through voice calls and SMS. She speaks naturally and represents your firm with a professional, branded experience for your clients.',
      category: 'Overview'
    },
    {
      id: 'linda-features',
      question: 'What can Linda do for my practice?',
      answer: `
        <ul class="list-disc ml-4 space-y-1">
          <li><strong>Meeting Confirmations:</strong> Automatically calls clients to confirm appointments</li>
          <li><strong>Reschedule Requests:</strong> Handles scheduling conflicts and offers alternative times</li>
          <li><strong>Appointment Reminders:</strong> Sends personalized reminders via voice or SMS</li>
          <li><strong>Follow-up Calls:</strong> Post-meeting check-ins and next steps</li>
          <li><strong>No-Show Follow-up:</strong> Reaches out when clients miss appointments</li>
          <li><strong>Branded Communication:</strong> Uses your firm's name and professional tone</li>
        </ul>
      `,
      category: 'Features'
    },
    {
      id: 'linda-pricing',
      question: 'How much does Linda cost?',
      answer: `
        <div class="space-y-2">
          <p><strong>Pro & Premium Plans:</strong> Linda is included at no extra cost</p>
          <p><strong>Basic Plan:</strong> Available as an add-on for +$10/month per user</p>
          <p class="text-sm text-green-600">🎯 Save 15+ hours per week on scheduling tasks</p>
        </div>
      `,
      category: 'Pricing'
    },
    {
      id: 'linda-privacy',
      question: 'Is Linda secure and compliant?',
      answer: `
        <div class="space-y-2">
          <p><strong>Privacy & Security:</strong></p>
          <ul class="list-disc ml-4 space-y-1">
            <li>All conversations are encrypted and HIPAA-compliant</li>
            <li>Client data is protected and never shared</li>
            <li>Call recordings available for compliance (optional)</li>
            <li>SOC 2 Type II certified infrastructure</li>
            <li>Data retention policies customizable per firm</li>
          </ul>
        </div>
      `,
      category: 'Security'
    },
    {
      id: 'linda-setup',
      question: 'How do I enable Linda for my practice?',
      answer: `
        <div class="space-y-2">
          <p><strong>Quick Setup Process:</strong></p>
          <ol class="list-decimal ml-4 space-y-1">
            <li>Navigate to Settings → Voice AI Assistant</li>
            <li>Configure your firm's branding and greeting</li>
            <li>Set your preferred call/SMS templates</li>
            <li>Choose confirmation timing and follow-up schedules</li>
            <li>Test Linda's voice and adjust settings</li>
            <li>Activate for all upcoming appointments</li>
          </ol>
          <p class="text-sm text-blue-600">💡 Setup takes less than 5 minutes!</p>
        </div>
      `,
      category: 'Setup'
    },
    {
      id: 'linda-customization',
      question: 'Can I customize how Linda represents my firm?',
      answer: `
        <div class="space-y-2">
          <p><strong>Full Branding Control:</strong></p>
          <ul class="list-disc ml-4 space-y-1">
            <li>Custom greeting with your firm name</li>
            <li>Personalized hold music and messaging</li>
            <li>Professional voice tone and speaking style</li>
            <li>Your business phone number as caller ID</li>
            <li>Branded SMS messages with your logo</li>
            <li>Custom scheduling logic and availability</li>
          </ul>
        </div>
      `,
      category: 'Customization'
    },
    {
      id: 'linda-languages',
      question: 'What languages does Linda support?',
      answer: `
        <div class="space-y-2">
          <p><strong>Multi-Language Support:</strong></p>
          <ul class="list-disc ml-4 space-y-1">
            <li>English (US, UK, AU)</li>
            <li>Spanish (US, Mexico)</li>
            <li>French (US, Canada)</li>
            <li>Portuguese (Brazil)</li>
            <li>Mandarin Chinese</li>
            <li>Custom language packs available</li>
          </ul>
          <p class="text-sm text-blue-600">🌍 Auto-detects client preferred language</p>
        </div>
      `,
      category: 'Features'
    },
    {
      id: 'linda-analytics',
      question: 'Can I track Linda\'s performance?',
      answer: `
        <div class="space-y-2">
          <p><strong>Comprehensive Analytics Dashboard:</strong></p>
          <ul class="list-disc ml-4 space-y-1">
            <li>Call success and connection rates</li>
            <li>Meeting confirmation percentages</li>
            <li>No-show reduction metrics</li>
            <li>Client satisfaction scores</li>
            <li>Time saved calculations</li>
            <li>ROI reports and cost analysis</li>
          </ul>
        </div>
      `,
      category: 'Analytics'
    }
  ];

  const personaSpecificContent = {
    advisor: {
      title: 'Linda for Financial Advisors',
      examples: [
        'Confirming client consultation appointments',
        'Following up on investment review meetings',
        'Reminding clients about quarterly check-ins',
        'Scheduling annual planning sessions'
      ]
    },
    cpa: {
      title: 'Linda for CPAs & Accountants',
      examples: [
        'Tax appointment confirmations',
        'Year-end planning meeting reminders',
        'Quarterly business review scheduling',
        'Document collection follow-ups'
      ]
    },
    attorney: {
      title: 'Linda for Attorneys',
      examples: [
        'Client consultation confirmations',
        'Court date preparation calls',
        'Estate planning appointment reminders',
        'Contract review meeting scheduling'
      ]
    }
  };

  const currentPersona = personaSpecificContent[userPersona] || personaSpecificContent.advisor;

  const playDemoCall = () => {
    setIsPlaying(true);
    // Simulate playing demo audio
    setTimeout(() => setIsPlaying(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header with Demo */}
      <Card className="border-2 border-primary/20 bg-gradient-to-r from-primary/5 to-accent/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Phone className="h-5 w-5 text-primary" />
            </div>
            {currentPersona.title}
          </CardTitle>
          <div className="flex flex-wrap gap-2 mt-3">
            <Badge variant="secondary" className="gap-1">
              <Volume2 className="h-3 w-3" />
              Voice Calls
            </Badge>
            <Badge variant="secondary" className="gap-1">
              <MessageSquare className="h-3 w-3" />
              SMS Messages
            </Badge>
            <Badge variant="secondary" className="gap-1">
              <Shield className="h-3 w-3" />
              HIPAA Compliant
            </Badge>
            <Badge variant="secondary" className="gap-1">
              <Clock className="h-3 w-3" />
              24/7 Available
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Linda handles all your meeting confirmations, reminders, and follow-ups with professional, 
            AI-powered voice calls and SMS—fully branded for your {userPersona} practice.
          </p>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium mb-2">Perfect for:</h4>
              <ul className="text-sm space-y-1">
                {currentPersona.examples.map((example, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                    {example}
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="space-y-3">
              <Dialog open={showDemo} onOpenChange={setShowDemo}>
                <DialogTrigger asChild>
                  <Button className="w-full gap-2">
                    <Play className="h-4 w-4" />
                    Try Linda Demo Call
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Linda Demo Call Preview</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="bg-muted/50 rounded-lg p-4">
                      <p className="text-sm mb-3">
                        <strong>Linda:</strong> "Hi, this is Linda calling from [Your Firm Name]. 
                        I'm calling to confirm your appointment with [Advisor Name] tomorrow at 2:00 PM. 
                        Will you be able to attend, or would you like to reschedule?"
                      </p>
                      <div className="flex items-center gap-2">
                        <Button 
                          variant={isPlaying ? "secondary" : "default"}
                          size="sm" 
                          onClick={playDemoCall}
                          disabled={isPlaying}
                          className="gap-2"
                        >
                          {isPlaying ? (
                            <>
                              <Volume2 className="h-4 w-4 animate-pulse" />
                              Playing...
                            </>
                          ) : (
                            <>
                              <Play className="h-4 w-4" />
                              Play Sample
                            </>
                          )}
                        </Button>
                        <span className="text-xs text-muted-foreground">Natural AI Voice</span>
                      </div>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
              
              <Button variant="outline" className="w-full gap-2">
                <Settings className="h-4 w-4" />
                Enable Linda AI
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* FAQ Section */}
      <Card>
        <CardHeader>
          <CardTitle>Linda Voice AI Assistant - Frequently Asked Questions</CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="space-y-2">
            {lindaFAQs.map((faq) => (
              <AccordionItem key={faq.id} value={faq.id} className="border rounded-lg px-4">
                <AccordionTrigger className="text-left">
                  <div className="flex justify-between items-center w-full mr-4">
                    <span className="font-medium">{faq.question}</span>
                    <Badge variant="outline" className="text-xs">
                      {faq.category}
                    </Badge>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div 
                    className="prose prose-sm max-w-none text-muted-foreground"
                    dangerouslySetInnerHTML={{ __html: faq.answer }}
                  />
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>

      {/* Training Video Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Play className="h-5 w-5" />
            Training & Resources
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <Button variant="outline" className="h-auto p-4 flex-col items-start space-y-2">
              <div className="flex items-center gap-2 w-full">
                <Play className="h-4 w-4" />
                <span className="font-medium">Watch: Linda AI in Action</span>
              </div>
              <p className="text-xs text-muted-foreground text-left">
                5-minute video showing Linda handling real client interactions
              </p>
            </Button>
            
            <Button variant="outline" className="h-auto p-4 flex-col items-start space-y-2">
              <div className="flex items-center gap-2 w-full">
                <Settings className="h-4 w-4" />
                <span className="font-medium">Setup Guide</span>
              </div>
              <p className="text-xs text-muted-foreground text-left">
                Step-by-step instructions to configure Linda for your practice
              </p>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};