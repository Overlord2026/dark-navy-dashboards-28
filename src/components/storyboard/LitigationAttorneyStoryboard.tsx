import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Lock, CheckSquare, MessageCircle, Calendar, Zap, Video, Database, Monitor, Smartphone } from 'lucide-react';

export const LitigationAttorneyStoryboard: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 p-4">
      <div className="container mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
            Litigation Attorney Storyboard
          </h1>
          <p className="text-lg text-muted-foreground">
            Visual mockups for the Litigation Attorney persona flow
          </p>
        </div>

        {/* Frame 1 - Hero Section */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Monitor className="w-6 h-6" />
            Frame 1: Hero Section (Desktop + Mobile)
          </h2>
          
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Desktop View */}
            <Card className="border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Monitor className="w-5 h-5" />
                  Desktop View
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Hero mockup */}
                <div className="bg-gradient-to-r from-primary/10 to-accent/10 p-6 rounded-lg">
                  <div className="grid grid-cols-2 gap-6 items-center">
                    <div className="space-y-4">
                      <h3 className="text-2xl font-bold">Litigation Management, Simplified</h3>
                      <p className="text-sm">Organize case files, deadlines, and client communication in one secure hub.</p>
                      <div className="bg-primary text-primary-foreground px-4 py-2 rounded text-center text-sm font-medium">
                        Join as a Litigation Attorney
                      </div>
                    </div>
                    <div className="bg-card border rounded-lg p-4">
                      <div className="text-sm font-medium mb-3">Case Dashboard</div>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center p-2 bg-destructive/10 rounded text-xs">
                          <span>Smith v. Johnson</span>
                          <span>Due: 3 days</span>
                        </div>
                        <div className="flex justify-between items-center p-2 bg-warning/10 rounded text-xs">
                          <span>Estate of Williams</span>
                          <span>Due: 1 week</span>
                        </div>
                        <div className="flex justify-between items-center p-2 bg-primary/10 rounded text-xs">
                          <span>ABC Corp Litigation</span>
                          <span>Due: 2 weeks</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Mobile View */}
            <Card className="border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Smartphone className="w-5 h-5" />
                  Mobile View
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-gradient-to-r from-primary/10 to-accent/10 p-4 rounded-lg max-w-xs mx-auto">
                  <div className="space-y-4 text-center">
                    <h3 className="text-lg font-bold">Litigation Management, Simplified</h3>
                    <div className="bg-card border rounded p-3">
                      <div className="text-xs font-medium mb-2">Recent Cases</div>
                      <div className="space-y-1">
                        <div className="bg-destructive/10 p-1 rounded text-xs">Smith v. Johnson</div>
                        <div className="bg-warning/10 p-1 rounded text-xs">Estate of Williams</div>
                      </div>
                    </div>
                    <div className="bg-primary text-primary-foreground px-3 py-2 rounded text-sm">
                      Join Now
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Frame 2 - Benefits Section */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">Frame 2: Benefits Section</h2>
          
          <Card>
            <CardContent className="p-6">
              <div className="grid md:grid-cols-4 gap-4">
                {[
                  { icon: Clock, title: "Case Timeline Builder", color: "bg-primary/10 text-primary" },
                  { icon: Lock, title: "Secure Evidence Vault", color: "bg-accent/10 text-accent" },
                  { icon: CheckSquare, title: "Task Assignment & Tracking", color: "bg-primary/10 text-primary" },
                  { icon: MessageCircle, title: "Integrated Client Messaging", color: "bg-secondary/10 text-secondary" }
                ].map((benefit, index) => (
                  <div key={index} className="text-center space-y-3 p-4 border rounded-lg">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto ${benefit.color}`}>
                      <benefit.icon className="w-6 h-6" />
                    </div>
                    <h3 className="font-semibold text-sm">{benefit.title}</h3>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Frame 3 - Premium Features */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">Frame 3: Premium Features</h2>
          
          <Card>
            <CardContent className="p-6">
              <div className="grid md:grid-cols-4 gap-4">
                {[
                  { icon: Calendar, title: "Court Deadline Auto-Importer" },
                  { icon: Zap, title: "AI Legal Brief Generator" },
                  { icon: Video, title: "Secure Video Deposition Storage" },
                  { icon: Database, title: "Expert Witness Database Access" }
                ].map((feature, index) => (
                  <div key={index} className="relative text-center space-y-3 p-4 border border-accent/20 rounded-lg">
                    <Badge className="absolute -top-2 -right-2 bg-accent text-accent-foreground">
                      Premium
                    </Badge>
                    <div className="w-12 h-12 bg-accent/10 text-accent rounded-full flex items-center justify-center mx-auto">
                      <feature.icon className="w-6 h-6" />
                    </div>
                    <h3 className="font-semibold text-sm">{feature.title}</h3>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Frame 4 - Onboarding Flow */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">Frame 4: Onboarding Flow</h2>
          
          <Card>
            <CardContent className="p-6">
              <div className="grid md:grid-cols-4 gap-4">
                {[
                  { step: 1, title: "Profile & Bar Admission Upload", icon: Lock },
                  { step: 2, title: "Practice Area Selection", icon: CheckSquare },
                  { step: 3, title: "Case Management Preferences", icon: Clock },
                  { step: 4, title: "Import First Case", icon: MessageCircle }
                ].map((step, index) => (
                  <div key={index} className="text-center space-y-3 p-4 border rounded-lg">
                    <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto text-sm font-bold">
                      {step.step}
                    </div>
                    <step.icon className="w-8 h-8 text-primary mx-auto" />
                    <h3 className="font-semibold text-sm">{step.title}</h3>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Frame 5 - Dashboard Layout */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">Frame 5: Dashboard Layout</h2>
          
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Desktop Dashboard */}
            <Card>
              <CardHeader>
                <CardTitle>Desktop Dashboard</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Navigation */}
                  <div className="flex gap-2 text-xs">
                    <div className="bg-primary text-primary-foreground px-2 py-1 rounded">Cases</div>
                    <div className="bg-muted px-2 py-1 rounded">Calendar</div>
                    <div className="bg-muted px-2 py-1 rounded">Evidence</div>
                    <div className="bg-muted px-2 py-1 rounded">Tasks</div>
                    <div className="bg-muted px-2 py-1 rounded">Clients</div>
                  </div>
                  
                  {/* Main Content */}
                  <div className="grid grid-cols-3 gap-2">
                    <div className="col-span-2 bg-muted/50 p-3 rounded text-xs">
                      <div className="font-medium mb-2">Active Cases</div>
                      <div className="space-y-1">
                        <div className="bg-background p-2 rounded flex justify-between">
                          <span>Smith v. Johnson</span>
                          <Badge className="text-xs bg-destructive">High</Badge>
                        </div>
                        <div className="bg-background p-2 rounded flex justify-between">
                          <span>Estate of Williams</span>
                          <Badge className="text-xs bg-warning">Medium</Badge>
                        </div>
                        <div className="bg-background p-2 rounded flex justify-between">
                          <span>ABC Corp Litigation</span>
                          <Badge className="text-xs bg-primary">High</Badge>
                        </div>
                      </div>
                    </div>
                    <div className="bg-muted/50 p-3 rounded text-xs">
                      <div className="font-medium mb-2">Court Dates</div>
                      <div className="space-y-1">
                        <div className="bg-background p-1 rounded">Dec 12 - Motion</div>
                        <div className="bg-background p-1 rounded">Dec 15 - Hearing</div>
                        <div className="bg-background p-1 rounded">Dec 20 - Trial</div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Mobile Dashboard */}
            <Card>
              <CardHeader>
                <CardTitle>Mobile Dashboard</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="max-w-xs mx-auto space-y-4">
                  {/* Mobile Navigation */}
                  <div className="flex justify-between text-xs bg-muted/50 p-2 rounded">
                    <div className="bg-primary text-primary-foreground px-2 py-1 rounded">Cases</div>
                    <div>Calendar</div>
                    <div>Tasks</div>
                    <div>More</div>
                  </div>
                  
                  {/* Mobile Content */}
                  <div className="bg-muted/50 p-3 rounded text-xs">
                    <div className="font-medium mb-2">Priority Cases</div>
                    <div className="space-y-1">
                      <div className="bg-background p-2 rounded flex justify-between">
                        <span>Smith v. Johnson</span>
                        <span className="text-destructive">3 days</span>
                      </div>
                      <div className="bg-background p-2 rounded flex justify-between">
                        <span>ABC Corp</span>
                        <span className="text-warning">1 week</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};