import React from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, CheckCircle, PlayCircle, BookOpen, Users, CreditCard, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function GettingStartedPage() {
  const navigate = useNavigate();

  const steps = [
    {
      icon: Users,
      title: "Create Your Account",
      description: "Sign up and choose your role (Client, Advisor, or Professional)",
      status: "complete",
      time: "2 minutes"
    },
    {
      icon: Shield,
      title: "Complete Verification",
      description: "Verify your email and set up multi-factor authentication",
      status: "current",
      time: "5 minutes"
    },
    {
      icon: CreditCard,
      title: "Connect Accounts",
      description: "Securely link your financial accounts using Plaid",
      status: "upcoming",
      time: "10 minutes"
    },
    {
      icon: BookOpen,
      title: "Explore Features",
      description: "Take a tour of dashboards and planning tools",
      status: "upcoming",
      time: "15 minutes"
    }
  ];

  const quickActions = [
    {
      title: "Connect Bank Account",
      description: "Link your primary checking or savings account",
      action: "Connect Now",
      variant: "default" as const
    },
    {
      title: "Watch Demo Video",
      description: "5-minute overview of key features",
      action: "Watch",
      variant: "outline" as const
    },
    {
      title: "Schedule Consultation",
      description: "Book a call with our onboarding team",
      action: "Schedule",
      variant: "outline" as const
    }
  ];

  return (
    <MainLayout>
      <div className="container mx-auto py-8 px-4">
        <Button 
          variant="ghost" 
          onClick={() => navigate(-1)}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold">Welcome to Your Family Office Platform</h1>
            <p className="text-xl text-muted-foreground">Let's get you set up in just a few minutes</p>
          </div>

          {/* Progress Steps */}
          <Card>
            <CardHeader>
              <CardTitle>Getting Started Checklist</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {steps.map((step, index) => (
                  <div key={index} className="flex items-center gap-4 p-4 rounded-lg border">
                    <div className={`p-2 rounded-full ${
                      step.status === 'complete' ? 'bg-green-100 text-green-600' :
                      step.status === 'current' ? 'bg-blue-100 text-blue-600' :
                      'bg-gray-100 text-gray-400'
                    }`}>
                      {step.status === 'complete' ? (
                        <CheckCircle className="h-5 w-5" />
                      ) : (
                        <step.icon className="h-5 w-5" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold">{step.title}</h3>
                        <Badge variant={
                          step.status === 'complete' ? 'default' :
                          step.status === 'current' ? 'secondary' :
                          'outline'
                        }>
                          {step.status === 'complete' ? 'Complete' :
                           step.status === 'current' ? 'In Progress' :
                           'Upcoming'}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{step.description}</p>
                    </div>
                    <div className="text-sm text-muted-foreground">{step.time}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <div className="grid gap-4 md:grid-cols-3">
            {quickActions.map((action, index) => (
              <Card key={index}>
                <CardContent className="pt-6">
                  <h3 className="font-semibold mb-2">{action.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{action.description}</p>
                  <Button variant={action.variant} className="w-full">
                    {action.action}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Feature Overview */}
          <Card>
            <CardHeader>
              <CardTitle>What You Can Do</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <div className="space-y-3">
                <h4 className="font-semibold">For Clients</h4>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• View all accounts in one dashboard</li>
                  <li>• Track financial goals and progress</li>
                  <li>• Access tax and estate planning tools</li>
                  <li>• Communicate securely with advisors</li>
                </ul>
              </div>
              <div className="space-y-3">
                <h4 className="font-semibold">For Professionals</h4>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• Manage multiple client relationships</li>
                  <li>• Access advanced planning calculators</li>
                  <li>• Generate reports and proposals</li>
                  <li>• Collaborate with other professionals</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Support */}
          <Card className="text-center">
            <CardContent className="pt-6">
              <h3 className="font-semibold mb-2">Need Help?</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Our support team is here to help you get started
              </p>
              <div className="flex gap-2 justify-center">
                <Button variant="outline" size="sm">
                  <PlayCircle className="h-4 w-4 mr-2" />
                  Watch Tutorials
                </Button>
                <Button variant="outline" size="sm">
                  Contact Support
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}