import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import VoiceDrawer from '@/components/voice/VoiceDrawer';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

export default function Advisors() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleOpenCatalog = () => {
    navigate('/discover?persona=advisors');
  };

  const handleRunDemo = () => {
    // TODO: Open DemoLauncher if present
    toast({
      title: "Demo Coming Soon",
      description: "90-second demo will be available here",
    });
  };

  const handleBookMeeting = () => {
    navigate('/learn/demo/advisors');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
      <div className="container mx-auto px-4 py-8">
        {/* Header with Voice Drawer */}
        <div className="relative mb-8">
          <div className="absolute top-0 right-0">
            <VoiceDrawer triggerLabel="Voice AI" persona="advisor" />
          </div>
        </div>

        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight mb-4">
            Financial Advisory Platform
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Streamline client management, automate compliance workflows, and deliver personalized 
            financial planning with our comprehensive advisor toolkit.
          </p>
        </div>

        {/* CTAs */}
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle>Get Started</CardTitle>
            <CardDescription>
              Explore our platform and see how it can transform your advisory practice
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button 
                onClick={handleOpenCatalog}
                className="h-auto p-6 flex flex-col items-center gap-2"
              >
                <span className="text-lg font-semibold">Open Catalog</span>
                <span className="text-sm opacity-80">Browse all tools</span>
              </Button>
              
              <Button 
                onClick={handleRunDemo}
                variant="outline"
                className="h-auto p-6 flex flex-col items-center gap-2"
              >
                <span className="text-lg font-semibold">Run 90s Demo</span>
                <span className="text-sm opacity-80">Quick preview</span>
              </Button>
              
              <Button 
                onClick={handleBookMeeting}
                variant="secondary"
                className="h-auto p-6 flex flex-col items-center gap-2"
              >
                <span className="text-lg font-semibold">Book 15-min</span>
                <span className="text-sm opacity-80">Personal walkthrough</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}