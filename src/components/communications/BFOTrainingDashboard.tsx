import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { 
  Phone, 
  MessageSquare, 
  Mail, 
  Video, 
  Shield, 
  Users, 
  TrendingUp,
  Zap,
  CheckCircle,
  ArrowRight,
  PlayCircle,
  Star,
  Sparkles,
  HeadphonesIcon,
  Database,
  Target,
  Globe
} from 'lucide-react';

interface FeatureStatus {
  implemented: boolean;
  priority: 'high' | 'medium' | 'low';
  phase: 1 | 2 | 3;
}

interface TwilioFeature {
  id: string;
  name: string;
  twilioProduct: string;
  description: string;
  useCase: string;
  icon: React.ComponentType<any>;
  status: FeatureStatus;
  benefits: string[];
}

interface BFOTrainingDashboardProps {
  onStartTraining: (featureId: string) => void;
}

export function BFOTrainingDashboard({ onStartTraining }: BFOTrainingDashboardProps) {
  const [selectedFeature, setSelectedFeature] = useState<string | null>(null);

  const twilioFeatures: TwilioFeature[] = [
    {
      id: 'messaging',
      name: 'SMS & WhatsApp',
      twilioProduct: 'MessagingX',
      description: 'Professional messaging with secure channels',
      useCase: 'Reminders, alerts, prospect invites, client updates',
      icon: MessageSquare,
      status: { implemented: true, priority: 'high', phase: 1 },
      benefits: [
        'Never miss a client with instant SMS notifications',
        'Secure WhatsApp business messaging',
        'Automated appointment reminders',
        'Bulk messaging for announcements'
      ]
    },
    {
      id: 'voice',
      name: 'Voice & VoIP',
      twilioProduct: 'Programmable Voice',
      description: 'Professional phone system with AI integration',
      useCase: 'Linda AI calls, confirmations, client consultations',
      icon: Phone,
      status: { implemented: true, priority: 'high', phase: 1 },
      benefits: [
        'Dedicated business line separate from personal',
        'AI-powered call summaries and transcriptions',
        'Click-to-call from any client record',
        'Professional voicemail with transcription'
      ]
    },
    {
      id: 'email',
      name: 'Email Communications',
      twilioProduct: 'SendGrid',
      description: 'Transactional and marketing email automation',
      useCase: 'Welcome emails, onboarding, billing, legal notices',
      icon: Mail,
      status: { implemented: true, priority: 'high', phase: 1 },
      benefits: [
        'Professional branded email templates',
        'Automated welcome and onboarding sequences',
        'Compliance-ready email archiving',
        'Delivery tracking and analytics'
      ]
    },
    {
      id: 'mfa',
      name: 'Security & MFA',
      twilioProduct: 'Trusted Activation',
      description: 'Multi-factor authentication for sensitive actions',
      useCase: 'Account opening, password resets, wire transfers',
      icon: Shield,
      status: { implemented: false, priority: 'high', phase: 1 },
      benefits: [
        'Secure onboarding with verified identity',
        'MFA for wire transfers and sensitive actions',
        'Fraud prevention with risk scoring',
        'Compliance with security regulations'
      ]
    },
    {
      id: 'support',
      name: 'Support Center',
      twilioProduct: 'Flex',
      description: 'Omnichannel support and call center',
      useCase: 'In-app chat, call center, VIP hotline',
      icon: HeadphonesIcon,
      status: { implemented: false, priority: 'medium', phase: 2 },
      benefits: [
        '24/7 multi-lingual support center',
        'Smart routing by client tier and persona',
        'Call recording for compliance',
        'Real-time analytics and reporting'
      ]
    },
    {
      id: 'analytics',
      name: 'Data & Analytics',
      twilioProduct: 'Segment CDP',
      description: 'Unified customer data platform',
      useCase: 'Persona dashboards, automation triggers',
      icon: Database,
      status: { implemented: false, priority: 'medium', phase: 2 },
      benefits: [
        'Single view of all client interactions',
        'Automated workflows based on behavior',
        'Predictive analytics for client needs',
        'Real-time engagement scoring'
      ]
    },
    {
      id: 'campaigns',
      name: 'Marketing Campaigns',
      twilioProduct: 'Engage',
      description: 'Automated marketing and nurture campaigns',
      useCase: 'Drip campaigns, nurture flows, referral programs',
      icon: Target,
      status: { implemented: false, priority: 'medium', phase: 2 },
      benefits: [
        'Automated lead nurturing sequences',
        'Personalized content by persona',
        'A/B testing for optimization',
        'ROI tracking and attribution'
      ]
    },
    {
      id: 'video',
      name: 'Secure Video',
      twilioProduct: 'Twilio Video',
      description: 'Encrypted video meetings and consultations',
      useCase: 'Advisor meetings, client consultations, team calls',
      icon: Video,
      status: { implemented: false, priority: 'low', phase: 3 },
      benefits: [
        'Bank-grade encryption for sensitive discussions',
        'Screen sharing for document review',
        'Recording for compliance and notes',
        'Calendar integration and scheduling'
      ]
    }
  ];

  const keyMessages = [
    {
      title: "Never Miss Anything",
      message: "With BFO's Twilio-powered suite, you'll never miss a client, deadline, or opportunity—whether by text, call, email, or video.",
      icon: Zap
    },
    {
      title: "Professional Separation",
      message: "No more juggling personal phones—use your secure BFO number for all communications.",
      icon: Shield
    },
    {
      title: "Instant Onboarding",
      message: "Onboarding is instant—no codes, no delays, no missed invites.",
      icon: Sparkles
    },
    {
      title: "All-in-One Platform",
      message: "Support, compliance, and sales all live in your app, with full audit logs and recordings.",
      icon: CheckCircle
    }
  ];

  const getPhaseProgress = (phase: number) => {
    const phaseFeatures = twilioFeatures.filter(f => f.status.phase === phase);
    const implementedInPhase = phaseFeatures.filter(f => f.status.implemented).length;
    return (implementedInPhase / phaseFeatures.length) * 100;
  };

  const getStatusColor = (status: FeatureStatus) => {
    if (status.implemented) return 'bg-green-500';
    if (status.priority === 'high') return 'bg-orange-500';
    if (status.priority === 'medium') return 'bg-blue-500';
    return 'bg-gray-400';
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Globe className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">Boutique Family Office™ Communications Suite</h1>
        </div>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          World-class communications powered by Twilio. Train your team on the elite platform that never misses a beat.
        </p>
      </div>

      {/* Key Messages */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {keyMessages.map((msg, index) => (
          <Card key={index} className="border-primary/20 bg-gradient-to-br from-primary/5 to-secondary/5">
            <CardContent className="p-6 text-center">
              <msg.icon className="h-8 w-8 text-primary mx-auto mb-3" />
              <h3 className="font-semibold mb-2">{msg.title}</h3>
              <p className="text-sm text-muted-foreground">{msg.message}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Implementation Roadmap */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Implementation Roadmap
          </CardTitle>
          <CardDescription>Track progress across all Twilio integrations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map(phase => (
              <div key={phase} className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">Phase {phase}</h3>
                  <Badge variant={phase === 1 ? "default" : phase === 2 ? "secondary" : "outline"}>
                    {Math.round(getPhaseProgress(phase))}% Complete
                  </Badge>
                </div>
                <Progress value={getPhaseProgress(phase)} className="h-2" />
                <div className="space-y-2">
                  {twilioFeatures
                    .filter(f => f.status.phase === phase)
                    .map(feature => (
                      <div key={feature.id} className="flex items-center gap-2 text-sm">
                        <div className={`w-2 h-2 rounded-full ${getStatusColor(feature.status)}`} />
                        <span>{feature.name}</span>
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {twilioFeatures.map((feature) => (
          <Card 
            key={feature.id} 
            className={`cursor-pointer transition-all duration-200 hover:shadow-lg hover-scale ${
              feature.status.implemented ? 'border-green-200 bg-green-50/50' : 'border-gray-200'
            }`}
            onClick={() => setSelectedFeature(feature.id)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <feature.icon className={`h-8 w-8 ${
                  feature.status.implemented ? 'text-green-600' : 'text-muted-foreground'
                }`} />
                <div className="flex gap-1">
                  {feature.status.implemented && (
                    <Badge variant="default" className="text-xs">Live</Badge>
                  )}
                  <Badge 
                    variant={feature.status.priority === 'high' ? 'destructive' : 
                            feature.status.priority === 'medium' ? 'secondary' : 'outline'}
                    className="text-xs"
                  >
                    P{feature.status.phase}
                  </Badge>
                </div>
              </div>
              <div>
                <CardTitle className="text-lg">{feature.name}</CardTitle>
                <CardDescription className="text-sm">{feature.twilioProduct}</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-sm text-muted-foreground mb-3">{feature.description}</p>
              <div className="bg-blue-50 p-2 rounded text-xs text-blue-800 mb-3">
                <strong>Use Case:</strong> {feature.useCase}
              </div>
              <Button 
                size="sm" 
                variant={feature.status.implemented ? "default" : "outline"}
                className="w-full"
                onClick={(e) => {
                  e.stopPropagation();
                  onStartTraining(feature.id);
                }}
              >
                {feature.status.implemented ? (
                  <>
                    <PlayCircle className="h-4 w-4 mr-2" />
                    Start Training
                  </>
                ) : (
                  <>
                    <Star className="h-4 w-4 mr-2" />
                    Coming Soon
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Feature Detail Modal */}
      <Dialog open={!!selectedFeature} onOpenChange={() => setSelectedFeature(null)}>
        <DialogContent className="max-w-2xl">
          {selectedFeature && (() => {
            const feature = twilioFeatures.find(f => f.id === selectedFeature);
            if (!feature) return null;

            return (
              <>
                <DialogHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <feature.icon className="h-8 w-8 text-primary" />
                    <div>
                      <DialogTitle className="text-xl">{feature.name}</DialogTitle>
                      <DialogDescription>
                        Powered by {feature.twilioProduct}
                      </DialogDescription>
                    </div>
                  </div>
                </DialogHeader>

                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold mb-2">Key Benefits</h3>
                    <ul className="space-y-2">
                      {feature.benefits.map((benefit, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-medium text-blue-900 mb-2">Real-World Use Case</h4>
                    <p className="text-sm text-blue-800">{feature.useCase}</p>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t">
                    <div className="flex items-center gap-2">
                      <Badge variant={feature.status.implemented ? "default" : "outline"}>
                        {feature.status.implemented ? "Available Now" : "In Development"}
                      </Badge>
                      <Badge variant="secondary">Phase {feature.status.phase}</Badge>
                    </div>
                    <Button onClick={() => onStartTraining(feature.id)}>
                      {feature.status.implemented ? "Start Training" : "Get Notified"}
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                </div>
              </>
            );
          })()}
        </DialogContent>
      </Dialog>
    </div>
  );
}