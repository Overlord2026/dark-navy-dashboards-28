import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useNavigate } from 'react-router-dom';
import { 
  Trophy, 
  Star, 
  Shield, 
  CheckCircle, 
  Clock,
  Archive,
  Timer,
  Play,
  Users,
  Building2,
  GraduationCap,
  ArrowRight,
  Zap,
  Lock,
  FileCheck
} from 'lucide-react';
import { toast } from 'sonner';
import DemoLauncher from '@/components/demos/DemoLauncher';

const NILHub: React.FC = () => {
  const navigate = useNavigate();

  const handleDemoClick = (persona: string) => {
    toast.success(`Loading ${persona} demo...`);
    navigate(`/demos/nil-${persona}`);
  };

  const handleStartWorkspace = (persona: string) => {
    toast.success(`Starting ${persona} workspace...`);
    navigate(`/start/nil?persona=${persona}`);
  };

  const trustFeatures = [
    {
      icon: CheckCircle,
      title: "Smart Checks",
      description: "Automated compliance verification for NIL rules and requirements",
      color: "text-green-600"
    },
    {
      icon: FileCheck,
      title: "Proof Slips",
      description: "Tamper-proof records of training, disclosures, and approvals",
      color: "text-blue-600"
    },
    {
      icon: Lock,
      title: "Secure Vault",
      description: "Keep-Safe legal hold for contracts and sensitive documents",
      color: "text-purple-600"
    },
    {
      icon: Timer,
      title: "Time-Stamp",
      description: "Optional blockchain anchoring for maximum verification",
      color: "text-orange-600"
    }
  ];

  const personaCards = [
    {
      id: 'athlete',
      title: 'Athlete/Parent',
      icon: Trophy,
      benefit: 'Training → Disclosures → Offers → Payments—done right and kept on record.',
      features: [
        'NIL training & certification',
        'Offer management & disclosure',
        'Contract templates & e-signing',
        'Payment tracking & tax forms',
        'Brand partnership tools'
      ],
      cta: 'Start Athlete workspace',
      gradient: 'from-yellow-500 to-orange-600'
    },
    {
      id: 'agent',
      title: 'Agents & Representatives',
      icon: Users,
      benefit: 'Manage multiple athletes with compliance built-in—streamline deals without legal risks.',
      features: [
        'Multi-athlete dashboard',
        'Deal pipeline management',
        'Compliance automation',
        'Contract negotiation tools',
        'Revenue tracking & reporting'
      ],
      cta: 'Start Agent workspace',
      gradient: 'from-blue-500 to-indigo-600'
    },
    {
      id: 'school',
      title: 'School/Brand',
      icon: Building2,
      benefit: 'Publish rules once; verify automatically—fewer disputes, faster launches.',
      features: [
        'Rule publication & updates',
        'Automated compliance checking',
        'Campaign management',
        'Athlete discovery & outreach',
        'Performance analytics'
      ],
      cta: 'Start School/Brand workspace',
      gradient: 'from-green-500 to-emerald-600'
    }
  ];

  return (
    <>
      <Helmet>
        <title>NIL Platform - Athlete as Hero</title>
        <meta 
          name="description" 
          content="Build your image, prove your story, work with fans & brands in one place. NIL platform with compliance built-in." 
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="canonical" href="/nil" />
      </Helmet>

      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="relative py-20 px-4 text-center bg-gradient-to-br from-primary/10 via-background to-secondary/10">
          <div className="container mx-auto max-w-4xl">
            <div className="flex items-center justify-center gap-2 mb-6">
              <Trophy className="w-8 h-8 text-primary" />
              <Badge variant="secondary" className="text-sm font-semibold">
                NIL Platform
              </Badge>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Athlete as Hero
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Build your image, prove your story, work with fans & brands in one place.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button 
                size="lg" 
                onClick={() => navigate('/nil/index')}
                className="min-h-[48px]"
              >
                <Star className="w-5 h-5 mr-2" />
                Browse Athletes
              </Button>
              <DemoLauncher demoId="nil-athlete">
                <Button variant="outline" size="lg" className="min-h-[48px]">
                  <Play className="w-5 h-5 mr-2" />
                  See 60-sec demo
                </Button>
              </DemoLauncher>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">2,500+</div>
                <div className="text-sm text-muted-foreground">Athletes</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">95%</div>
                <div className="text-sm text-muted-foreground">Compliance Rate</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">$2.5M+</div>
                <div className="text-sm text-muted-foreground">Deals Processed</div>
              </div>
            </div>
          </div>
        </section>

        {/* Persona Tabs */}
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-6xl">
            <h2 className="text-3xl font-bold text-center mb-12">
              Choose Your Role
            </h2>
            
            <Tabs defaultValue="athlete" className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-8">
                {personaCards.map(persona => (
                  <TabsTrigger key={persona.id} value={persona.id} className="flex items-center gap-2">
                    <persona.icon className="w-4 h-4" />
                    {persona.title}
                  </TabsTrigger>
                ))}
              </TabsList>

              {personaCards.map(persona => (
                <TabsContent key={persona.id} value={persona.id}>
                  <Card className="border-2">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`p-3 rounded-lg bg-gradient-to-r ${persona.gradient}`}>
                            <persona.icon className="w-8 h-8 text-white" />
                          </div>
                          <div>
                            <CardTitle className="text-2xl mb-2">{persona.title}</CardTitle>
                            <p className="text-muted-foreground">{persona.benefit}</p>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid md:grid-cols-2 gap-8">
                        <div>
                          <h4 className="font-semibold mb-4">Key Features:</h4>
                          <ul className="space-y-2">
                            {persona.features.map((feature, index) => (
                              <li key={index} className="flex items-center gap-2">
                                <CheckCircle className="w-4 h-4 text-green-600" />
                                <span className="text-sm">{feature}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="flex flex-col gap-4">
                          <DemoLauncher demoId={persona.id === 'school' ? 'nil-school' : `nil-${persona.id}`}>
                            <Button size="lg" className="w-full">
                              <Play className="w-4 h-4 mr-2" />
                              See 60-sec demo
                            </Button>
                          </DemoLauncher>
                          <Button 
                            variant="outline" 
                            size="lg"
                            onClick={() => handleStartWorkspace(persona.id)}
                            className="w-full"
                          >
                            <ArrowRight className="w-4 h-4 mr-2" />
                            {persona.cta}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              ))}
            </Tabs>
          </div>
        </section>

        {/* Trust Rails Section */}
        <section className="py-16 px-4 bg-muted/30">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">How Trust Works</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Built-in compliance and verification tools ensure every deal meets NIL requirements
              </p>
            </div>

            <div className="grid md:grid-cols-4 gap-6">
              {trustFeatures.map((feature, index) => (
                <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex justify-center mb-4">
                      <div className={`p-3 rounded-full bg-background ${feature.color}`}>
                        <feature.icon className="w-6 h-6" />
                      </div>
                    </div>
                    <h3 className="font-semibold mb-2">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="mt-8 text-center">
              <Badge variant="outline" className="px-4 py-2">
                <Shield className="w-4 h-4 mr-2" />
                FTC Compliant • NCAA Approved • State Law Compatible
              </Badge>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 px-4 text-center">
          <div className="container mx-auto max-w-4xl">
            <h2 className="text-3xl font-bold mb-6">Ready to Get Started?</h2>
            <p className="text-lg text-muted-foreground mb-8">
              Join thousands of athletes, agents, and brands building the future of NIL
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                onClick={() => navigate('/nil/index')}
                className="min-h-[48px]"
              >
                <Trophy className="w-5 h-5 mr-2" />
                Explore Athletes
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => handleStartWorkspace('athlete')}
                className="min-h-[48px]"
              >
                <Users className="w-5 h-5 mr-2" />
                Create Account
              </Button>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default NILHub;