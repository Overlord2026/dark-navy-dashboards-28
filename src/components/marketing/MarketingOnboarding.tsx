import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  CheckCircle, 
  Mail, 
  Users, 
  Target, 
  BarChart3, 
  Upload,
  Calendar,
  Zap,
  TrendingUp
} from "lucide-react";

interface MarketingOnboardingProps {
  onComplete: () => void;
}

export const MarketingOnboarding: React.FC<MarketingOnboardingProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  
  const steps = [
    {
      title: "Welcome to the BFO Marketing Dashboard! 🚀",
      description: "Supercharge your growth—invite, engage, and delight every persona group, all in one place.",
      icon: Mail,
      content: (
        <div className="space-y-6">
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full">
              <Mail className="h-5 w-5 text-primary" />
              <span className="font-medium text-primary">Marketing Command Center</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="border-l-4 border-l-primary">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Core Features</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Multi-channel Campaign Manager
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Contact List Builder & Segmentation
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Bulk VIP Invite System
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Email/SMS Template Library
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-l-4 border-l-accent">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Advanced Tools</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Real-time Analytics Dashboard
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  A/B Testing Module
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Landing Page Builder
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Referral Wallet & VIP Wall
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="bg-muted/50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">What You'll Accomplish:</h4>
            <ul className="space-y-1 text-sm">
              <li>• Create targeted campaigns for each persona group</li>
              <li>• Track engagement and conversion across all channels</li>
              <li>• Build and manage segmented contact lists</li>
              <li>• Optimize campaigns with A/B testing</li>
              <li>• Reward top performers with referral credits</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      title: "Import & Segment Your Contact Lists",
      description: "Import contacts from CSV, LinkedIn, Hunter.io, or enter manually",
      icon: Users,
      content: (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="text-center p-6">
              <Upload className="h-12 w-12 text-blue-500 mx-auto mb-4" />
              <h3 className="font-semibold mb-2">CSV Import</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Upload existing contact lists with persona mapping
              </p>
              <Button variant="outline">Import CSV</Button>
            </Card>
            
            <Card className="text-center p-6">
              <Users className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <h3 className="font-semibold mb-2">LinkedIn Integration</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Connect LinkedIn for professional contact discovery
              </p>
              <Button variant="outline">Connect LinkedIn</Button>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Persona Segmentation</CardTitle>
              <CardDescription>Automatically categorize contacts by persona group</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
                {[
                  "Financial Advisors",
                  "CPAs & Tax Pros", 
                  "Real Estate Agents",
                  "Property Managers",
                  "Athletes & NIL",
                  "Attorneys & Legal"
                ].map((persona) => (
                  <div key={persona} className="p-3 border rounded-lg text-center">
                    <Target className="h-5 w-5 mx-auto mb-1 text-primary" />
                    <div className="font-medium">{persona}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">Pro Tips:</h4>
            <ul className="text-sm space-y-1">
              <li>• Include 'persona_type' column for automatic segmentation</li>
              <li>• Add 'engagement_score' for priority targeting</li>
              <li>• Use tags for custom grouping and filtering</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      title: "Choose Templates & Schedule Campaigns",
      description: "Select persona-specific templates and set up multi-channel campaigns",
      icon: Calendar,
      content: (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Campaign Templates</CardTitle>
                <CardDescription>Pre-built templates for each persona</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { name: "Advisor Welcome Series", type: "Email", personas: "Financial Advisors" },
                  { name: "CPA Compliance Alert", type: "SMS", personas: "CPAs" },
                  { name: "Realtor Listing Boost", type: "Email + Social", personas: "Real Estate" },
                  { name: "NIL Education Launch", type: "Email + In-App", personas: "Athletes" }
                ].map((template, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{template.name}</p>
                      <p className="text-sm text-muted-foreground">{template.personas}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">{template.type}</div>
                      <Button size="sm" variant="outline" className="mt-1">
                        Use Template
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Campaign Scheduler</CardTitle>
                <CardDescription>Set timing and frequency for optimal engagement</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <Button variant="outline" className="h-16 flex-col">
                    <Calendar className="h-5 w-5 mb-1" />
                    Schedule Now
                  </Button>
                  <Button variant="outline" className="h-16 flex-col">
                    <Zap className="h-5 w-5 mb-1" />
                    Send Immediate
                  </Button>
                </div>
                
                <div className="text-center py-4 border rounded-lg">
                  <Calendar className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">
                    Optimal send times automatically calculated per persona
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Multi-Channel Setup</CardTitle>
              <CardDescription>Coordinate campaigns across email, SMS, social, and in-app</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { channel: "Email", icon: Mail, active: true },
                  { channel: "SMS", icon: Zap, active: true },
                  { channel: "Social", icon: Users, active: false },
                  { channel: "In-App", icon: Target, active: true }
                ].map((channel, index) => (
                  <div key={index} className={`p-4 border rounded-lg text-center ${channel.active ? 'bg-primary/5 border-primary' : 'bg-muted/50'}`}>
                    <channel.icon className={`h-6 w-6 mx-auto mb-2 ${channel.active ? 'text-primary' : 'text-muted-foreground'}`} />
                    <div className="font-medium">{channel.channel}</div>
                    <div className={`text-xs mt-1 ${channel.active ? 'text-primary' : 'text-muted-foreground'}`}>
                      {channel.active ? 'Active' : 'Available'}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )
    },
    {
      title: "Monitor Analytics & Referrals",
      description: "Track campaign performance and referral activity in real-time",
      icon: BarChart3,
      content: (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Real-time Analytics</CardTitle>
                <CardDescription>Monitor opens, clicks, and conversions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">24.8%</div>
                      <p className="text-sm text-blue-600">Open Rate</p>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">6.7%</div>
                      <p className="text-sm text-green-600">Click Rate</p>
                    </div>
                  </div>
                  
                  <div className="text-center p-3 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">3.2%</div>
                    <p className="text-sm text-purple-600">Conversion Rate</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Referral Tracking</CardTitle>
                <CardDescription>Monitor viral sharing and reward top performers</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-6">
                  <TrendingUp className="h-12 w-12 text-primary mx-auto mb-4" />
                  <div className="text-2xl font-bold">1,247</div>
                  <p className="text-muted-foreground">Total Referrals</p>
                  <div className="text-sm text-green-600 mt-1">+23% this month</div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>A/B Testing Results</CardTitle>
              <CardDescription>Optimize campaigns with data-driven insights</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { test: "Subject Line Test", winner: "Variant B", improvement: "+12.3%" },
                  { test: "Send Time Optimization", winner: "Variant A", improvement: "+8.7%" },
                  { test: "CTA Button Color", winner: "Variant B", improvement: "+5.2%" }
                ].map((test, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <span className="font-medium">{test.test}</span>
                    <div className="text-right">
                      <div className="font-bold">{test.winner}</div>
                      <div className="text-sm text-green-600">{test.improvement}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )
    },
    {
      title: "Download Reports & Share with Stakeholders",
      description: "Export performance data and share insights with your team",
      icon: CheckCircle,
      content: (
        <div className="text-center space-y-6">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
          <div>
            <h3 className="text-xl font-semibold mb-2">Marketing Dashboard Ready!</h3>
            <p className="text-muted-foreground mb-6">
              Your marketing command center is configured and ready to supercharge growth across all persona groups.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="flex flex-col items-center p-4 bg-muted/50 rounded-lg">
              <Mail className="h-6 w-6 text-primary mb-2" />
              <span className="text-sm font-medium">Create Campaigns</span>
            </div>
            <div className="flex flex-col items-center p-4 bg-muted/50 rounded-lg">
              <Users className="h-6 w-6 text-primary mb-2" />
              <span className="text-sm font-medium">Segment Audiences</span>
            </div>
            <div className="flex flex-col items-center p-4 bg-muted/50 rounded-lg">
              <BarChart3 className="h-6 w-6 text-primary mb-2" />
              <span className="text-sm font-medium">Track Analytics</span>
            </div>
            <div className="flex flex-col items-center p-4 bg-muted/50 rounded-lg">
              <TrendingUp className="h-6 w-6 text-primary mb-2" />
              <span className="text-sm font-medium">Optimize & Scale</span>
            </div>
          </div>

          <div className="bg-muted/50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">Next Steps:</h4>
            <ul className="text-sm space-y-1">
              <li>• Import your first contact list to get started</li>
              <li>• Try the Financial Advisor welcome series template</li>
              <li>• Set up A/B tests for subject line optimization</li>
              <li>• Monitor your referral leaderboard daily</li>
            </ul>
          </div>
        </div>
      )
    }
  ];

  const currentStepData = steps[currentStep];
  const progress = ((currentStep + 1) / steps.length) * 100;

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-6">
        <Progress value={progress} className="mb-4" />
        <p className="text-sm text-muted-foreground text-center">
          Step {currentStep + 1} of {steps.length}
        </p>
      </div>

      <Card className="mb-6">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-primary/10 rounded-full">
              <currentStepData.icon className="h-8 w-8 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl">{currentStepData.title}</CardTitle>
          <CardDescription className="text-lg">{currentStepData.description}</CardDescription>
        </CardHeader>
        <CardContent>
          {currentStepData.content}
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button 
          variant="outline" 
          onClick={handlePrevious}
          disabled={currentStep === 0}
        >
          Previous
        </Button>
        <Button onClick={handleNext}>
          {currentStep === steps.length - 1 ? "Enter Dashboard" : "Continue"}
        </Button>
      </div>
    </div>
  );
};