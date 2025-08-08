import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Trophy, Users, FileText, Calendar, Download, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface SportsAgentConfirmationStepProps {
  onPrevious: () => void;
}

export const SportsAgentConfirmationStep: React.FC<SportsAgentConfirmationStepProps> = ({ 
  onPrevious 
}) => {
  const navigate = useNavigate();

  const nextSteps = [
    {
      icon: Users,
      title: "Add More Athletes",
      description: "Import your athlete roster or add them individually"
    },
    {
      icon: FileText,
      title: "Upload Contracts",
      description: "Securely store all athlete agreements and NIL deals"
    },
    {
      icon: Calendar,
      title: "Set Up Compliance Calendar",
      description: "Never miss important deadlines and renewals"
    },
    {
      icon: Trophy,
      title: "Track NIL Opportunities",
      description: "Monitor and manage endorsement deals"
    }
  ];

  const handleGoToDashboard = () => {
    navigate('/dashboard');
  };

  const handleDownloadKit = () => {
    // In a real app, this would trigger a download
    console.log('Downloading marketing kit...');
  };

  return (
    <div className="max-w-4xl mx-auto text-center">
      <div className="mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-6">
          <CheckCircle className="h-8 w-8 text-green-600" />
        </div>
        <h2 className="text-3xl font-bold text-foreground mb-4">
          Welcome to Your Sports Agency Platform!
        </h2>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Your account is ready. Start managing athletes, tracking contracts, 
          and growing your sports agency with BFO's comprehensive tools.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <Badge className="w-fit mb-2">Account Setup Complete</Badge>
            <CardTitle>Your Sports Agent Dashboard</CardTitle>
            <CardDescription>
              Everything you need to manage elite athletes in one place
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={handleGoToDashboard}
              className="w-full"
              size="lg"
            >
              Go to Dashboard
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <Badge variant="outline" className="w-fit mb-2">Bonus Resources</Badge>
            <CardTitle>Sports Agent Marketing Kit</CardTitle>
            <CardDescription>
              Professional templates, social media assets, and presentation materials
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={handleDownloadKit}
              variant="outline"
              className="w-full"
              size="lg"
            >
              <Download className="h-4 w-4 mr-2" />
              Download Marketing Kit
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Quick Start Guide</CardTitle>
          <CardDescription>
            Here's what you can do next to maximize your BFO experience
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            {nextSteps.map((step, index) => (
              <div key={index} className="flex items-start gap-4 text-left">
                <div className="p-2 bg-primary/10 rounded-lg flex-shrink-0">
                  <step.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-medium mb-1">{step.title}</h4>
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="bg-gradient-subtle rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-2">Need Help Getting Started?</h3>
        <p className="text-muted-foreground mb-4">
          Our sports industry experts are here to help you maximize your athlete management success.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button variant="outline">
            Schedule Onboarding Call
          </Button>
          <Button variant="outline">
            View Video Tutorials
          </Button>
        </div>
      </div>

      <div className="flex justify-between mt-8">
        <Button 
          variant="outline" 
          onClick={onPrevious}
        >
          Back
        </Button>
        <Button 
          onClick={handleGoToDashboard}
          className="px-8"
        >
          Start Managing Athletes
        </Button>
      </div>
    </div>
  );
};