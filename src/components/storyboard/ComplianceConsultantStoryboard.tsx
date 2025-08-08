import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Shield, GraduationCap, AlertTriangle, FileText, Users, Zap, Database, Monitor, Smartphone } from 'lucide-react';

export const ComplianceConsultantStoryboard: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 p-4">
      <div className="container mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
            Compliance Consultant Storyboard
          </h1>
          <p className="text-lg text-muted-foreground">
            Visual mockups for the Compliance Consultant persona flow
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
                      <h3 className="text-2xl font-bold">Your Compliance Command Center</h3>
                      <p className="text-lg text-muted-foreground">Built for the Modern Advisor</p>
                      <p className="text-sm">Track, audit, and document compliance activities seamlessly across clients, teams, and jurisdictions.</p>
                      <div className="bg-primary text-primary-foreground px-4 py-2 rounded text-center text-sm font-medium">
                        Join as a Compliance Consultant
                      </div>
                    </div>
                    <div className="bg-card border rounded-lg p-4">
                      <div className="text-sm font-medium mb-3">Dashboard Mockup</div>
                      <div className="grid grid-cols-3 gap-2">
                        <div className="bg-primary/10 p-2 rounded text-xs text-center">
                          <Calendar className="w-4 h-4 mx-auto mb-1" />
                          Calendar
                        </div>
                        <div className="bg-accent/10 p-2 rounded text-xs text-center">
                          <AlertTriangle className="w-4 h-4 mx-auto mb-1" />
                          Alerts
                        </div>
                        <div className="bg-primary/10 p-2 rounded text-xs text-center">
                          <Shield className="w-4 h-4 mx-auto mb-1" />
                          Audits
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
                    <h3 className="text-lg font-bold">Your Compliance Command Center</h3>
                    <p className="text-sm text-muted-foreground">Built for the Modern Advisor</p>
                    <div className="bg-card border rounded p-3">
                      <div className="text-xs font-medium mb-2">Dashboard Preview</div>
                      <div className="grid grid-cols-2 gap-1">
                        <div className="bg-primary/10 p-1 rounded text-xs">Calendar</div>
                        <div className="bg-accent/10 p-1 rounded text-xs">Alerts</div>
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
                  { icon: Calendar, title: "Automated Filing Calendar", color: "bg-primary/10 text-primary" },
                  { icon: Shield, title: "Advisor & Firm Audit Trails", color: "bg-accent/10 text-accent" },
                  { icon: GraduationCap, title: "CE / License Tracking", color: "bg-primary/10 text-primary" },
                  { icon: AlertTriangle, title: "Risk Flag Alerts", color: "bg-destructive/10 text-destructive" }
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
                  { icon: FileText, title: "Jurisdiction-specific Filing Templates" },
                  { icon: Zap, title: "AI-powered Document Review" },
                  { icon: Database, title: "Bulk Compliance Report Generation" },
                  { icon: Users, title: "Multi-Tenant Client Portals" }
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
                  { step: 1, title: "Profile & Certifications Upload", icon: FileText },
                  { step: 2, title: "Jurisdiction Specialties Selection", icon: Shield },
                  { step: 3, title: "Set Calendar Integrations", icon: Calendar },
                  { step: 4, title: "Invite First Client", icon: Users }
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
                    <div className="bg-primary text-primary-foreground px-2 py-1 rounded">Calendar</div>
                    <div className="bg-muted px-2 py-1 rounded">Clients</div>
                    <div className="bg-muted px-2 py-1 rounded">Filings</div>
                    <div className="bg-muted px-2 py-1 rounded">Reports</div>
                    <div className="bg-muted px-2 py-1 rounded">Templates</div>
                  </div>
                  
                  {/* Main Content */}
                  <div className="grid grid-cols-3 gap-2">
                    <div className="col-span-2 bg-muted/50 p-3 rounded text-xs">
                      <div className="font-medium mb-2">Compliance Calendar</div>
                      <div className="grid grid-cols-7 gap-1">
                        {Array.from({ length: 21 }, (_, i) => (
                          <div key={i} className="aspect-square bg-background rounded flex items-center justify-center text-xs">
                            {i + 1}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="bg-muted/50 p-3 rounded text-xs">
                      <div className="font-medium mb-2">Alerts</div>
                      <div className="space-y-1">
                        <div className="bg-destructive/10 p-1 rounded">High Priority</div>
                        <div className="bg-warning/10 p-1 rounded">Medium</div>
                        <div className="bg-primary/10 p-1 rounded">Low</div>
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
                    <div className="bg-primary text-primary-foreground px-2 py-1 rounded">Calendar</div>
                    <div>Clients</div>
                    <div>Filings</div>
                    <div>More</div>
                  </div>
                  
                  {/* Mobile Content */}
                  <div className="bg-muted/50 p-3 rounded text-xs">
                    <div className="font-medium mb-2">Today's Tasks</div>
                    <div className="space-y-1">
                      <div className="bg-background p-2 rounded">Form ADV Review</div>
                      <div className="bg-background p-2 rounded">License Renewal</div>
                      <div className="bg-background p-2 rounded">Audit Meeting</div>
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