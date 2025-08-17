import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BookOpen, 
  Users, 
  Shield, 
  TrendingUp, 
  Award, 
  Zap,
  Clock,
  CheckCircle
} from 'lucide-react';

const NILFrontDoor: React.FC = () => {
  const [activeSegment, setActiveSegment] = useState<'athletes' | 'agents'>('athletes');

  const athleteFeatures = [
    { icon: BookOpen, title: 'NIL Education Hub', description: 'Comprehensive learning modules' },
    { icon: Shield, title: 'Compliance Tracker', description: 'Stay compliant with regulations' },
    { icon: TrendingUp, title: 'Deal Analytics', description: 'Track your NIL performance' },
    { icon: Award, title: 'Achievement System', description: 'Earn badges and certificates' }
  ];

  const agentFeatures = [
    { icon: Users, title: 'Client Management', description: 'Manage athlete portfolios' },
    { icon: Shield, title: 'Compliance Dashboard', description: 'Monitor all compliance requirements' },
    { icon: Zap, title: 'AI Contract Review', description: 'Automated contract analysis' },
    { icon: TrendingUp, title: 'Advanced Analytics', description: 'Performance insights and reporting' }
  ];

  const testimonials = [
    { name: 'Jordan Thompson', role: 'College Basketball Player', text: 'This platform helped me understand NIL better than any other resource.' },
    { name: 'Sarah Martinez', role: 'Sports Agent', text: 'The compliance tools save me hours every week.' },
    { name: 'Coach Williams', role: 'University Coach', text: 'Essential for keeping our program compliant.' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center max-w-4xl mx-auto mb-16">
          <Badge variant="outline" className="mb-4 text-sm">
            <Zap className="w-3 h-3 mr-1" />
            NIL Education Platform
          </Badge>
          
          <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6">
            Master Your <span className="text-primary">NIL Journey</span>
          </h1>
          
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            The comprehensive platform for athletes and agents to navigate Name, Image, and Likeness 
            opportunities with confidence and compliance.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
              Get Started for Free
            </Button>
            <Button variant="outline" size="lg">
              Watch Demo
            </Button>
          </div>
        </div>

        {/* Segment Selector */}
        <Tabs value={activeSegment} onValueChange={(value) => setActiveSegment(value as 'athletes' | 'agents')} className="w-full">
          <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto mb-12">
            <TabsTrigger value="athletes">For Athletes</TabsTrigger>
            <TabsTrigger value="agents">For Agents</TabsTrigger>
          </TabsList>

          <TabsContent value="athletes" className="space-y-12">
            {/* Athlete Features */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {athleteFeatures.map((feature, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow duration-200">
                  <CardHeader className="text-center">
                    <div className="w-12 h-12 mx-auto mb-4 rounded-lg bg-primary/10 flex items-center justify-center">
                      <feature.icon className="w-6 h-6 text-primary" />
                    </div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground text-center">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Athlete Learning Path */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  Your NIL Learning Path
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
                      <CheckCircle className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold">NIL Fundamentals</h4>
                      <p className="text-sm text-muted-foreground">
                        Understand your rights and opportunities
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
                      <Clock className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold">Compliance & Contracts</h4>
                      <p className="text-sm text-muted-foreground">
                        Learn to navigate legal requirements
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center">
                      <Award className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold">Advanced Strategies</h4>
                      <p className="text-sm text-muted-foreground">
                        Maximize your NIL potential
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="agents" className="space-y-12">
            {/* Agent Features */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {agentFeatures.map((feature, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow duration-200">
                  <CardHeader className="text-center">
                    <div className="w-12 h-12 mx-auto mb-4 rounded-lg bg-primary/10 flex items-center justify-center">
                      <feature.icon className="w-6 h-6 text-primary" />
                    </div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground text-center">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Agent Tools Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Complete Agent Toolkit
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h4 className="font-semibold mb-3">Compliance Management</h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>• Automated disclosure tracking</li>
                      <li>• Real-time compliance alerts</li>
                      <li>• Template library</li>
                      <li>• Audit trail management</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-3">Client Management</h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>• Athlete portfolio tracking</li>
                      <li>• Deal pipeline management</li>
                      <li>• Performance analytics</li>
                      <li>• Communication tools</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Testimonials */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-center mb-8">Trusted by Industry Leaders</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <p className="text-muted-foreground mb-4">"{testimonial.text}"</p>
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16 p-8 bg-primary/5 rounded-lg">
          <h2 className="text-2xl font-bold mb-4">Ready to Master Your NIL Journey?</h2>
          <p className="text-muted-foreground mb-6">
            Join thousands of athletes and agents who trust our platform for NIL success.
          </p>
          <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
            Start Your Free Trial
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NILFrontDoor;