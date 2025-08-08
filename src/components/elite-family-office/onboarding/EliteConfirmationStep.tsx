import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { 
  CheckCircle,
  Crown,
  Users,
  Building2,
  FileCheck,
  Vault,
  Bot,
  ArrowRight
} from 'lucide-react';

interface EliteConfirmationStepProps {
  onNext: () => void;
}

export const EliteConfirmationStep: React.FC<EliteConfirmationStepProps> = ({ onNext }) => {
  const navigate = useNavigate();

  const tourHighlights = [
    {
      icon: Users,
      title: 'Multi-Client Dashboard',
      description: 'Overview of all your family office clients'
    },
    {
      icon: Building2,
      title: 'Entity Management',
      description: 'Track complex ownership structures'
    },
    {
      icon: FileCheck,
      title: 'Compliance Center',
      description: 'Automated alerts and filing calendars'
    },
    {
      icon: Vault,
      title: 'Document Vault',
      description: 'Secure storage for sensitive documents'
    },
    {
      icon: Bot,
      title: 'AI Concierge',
      description: 'Your intelligent assistant for task automation'
    }
  ];

  const handleStartTour = () => {
    navigate('/elite-family-office-dashboard');
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center mb-4">
          <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
            <CheckCircle className="h-8 w-8 text-white" />
          </div>
        </div>
        <h1 className="text-3xl font-bold mb-4">Welcome to Your Elite Platform!</h1>
        <p className="text-lg text-muted-foreground">
          Your family office command center is ready. Let's take a quick tour.
        </p>
      </div>

      <Card className="mb-8">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center mb-4">
            <Crown className="h-6 w-6 text-primary mr-2" />
            <Badge variant="outline" className="bg-gradient-to-r from-amber-50 to-yellow-50 border-amber-200">
              <span className="text-amber-800 font-medium">Elite Account Activated</span>
            </Badge>
          </div>
          <CardTitle>Account Successfully Created</CardTitle>
          <CardDescription>
            Your elite family office platform is configured and ready for multi-generational wealth management
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-6 text-center">Quick Dashboard Tour</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tourHighlights.map((highlight, index) => (
            <Card key={index} className="border-2 hover:border-primary/20 transition-colors">
              <CardHeader className="pb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary/10 to-accent/10 rounded-lg flex items-center justify-center">
                    <highlight.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-base">{highlight.title}</CardTitle>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm">{highlight.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-xl p-6 mb-8">
        <h3 className="text-lg font-semibold mb-3">What's Next?</h3>
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div className="space-y-2">
            <p className="flex items-center">
              <span className="w-2 h-2 bg-primary rounded-full mr-2"></span>
              Add your first client families
            </p>
            <p className="flex items-center">
              <span className="w-2 h-2 bg-primary rounded-full mr-2"></span>
              Configure compliance settings
            </p>
            <p className="flex items-center">
              <span className="w-2 h-2 bg-primary rounded-full mr-2"></span>
              Upload important documents
            </p>
          </div>
          <div className="space-y-2">
            <p className="flex items-center">
              <span className="w-2 h-2 bg-accent rounded-full mr-2"></span>
              Set up entity relationships
            </p>
            <p className="flex items-center">
              <span className="w-2 h-2 bg-accent rounded-full mr-2"></span>
              Customize your AI Concierge
            </p>
            <p className="flex items-center">
              <span className="w-2 h-2 bg-accent rounded-full mr-2"></span>
              Connect to the marketplace
            </p>
          </div>
        </div>
      </div>

      <div className="text-center">
        <Button 
          onClick={handleStartTour}
          size="lg"
          className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
        >
          Start Interactive Tour
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
        <p className="text-sm text-muted-foreground mt-4">
          Or skip the tour and go directly to your dashboard
        </p>
      </div>
    </div>
  );
};