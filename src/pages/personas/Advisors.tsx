import React from 'react';
import { Button } from '@/components/ui/button';
import { GoldButton, GoldOutlineButton } from '@/components/ui/brandButtons';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { VoiceDrawer } from '@/components/voice/VoiceDrawer';
import { PersonaSubHeader } from '@/components/layout/PersonaSubHeader';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

export default function Advisors() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleOpenCatalog = () => {
    navigate('/catalog');
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
      <PersonaSubHeader>
        <div className="flex items-center justify-between w-full">
          <div>
            <h2 className="text-lg font-semibold text-bfo-gold">Advisor Control Center</h2>
            <p className="opacity-90 text-sm text-white">Streamline your practice with advanced tools and client management</p>
          </div>
          <VoiceDrawer triggerLabel="Voice AI" persona="advisor" />
        </div>
      </PersonaSubHeader>
      <div className="container mx-auto px-4 py-8">

        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight mb-4">
            For Financial Advisors
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
              <GoldOutlineButton 
                type="button"
                onClick={handleOpenCatalog}
                className="h-auto p-6 flex flex-col items-center gap-2"
              >
                <span className="text-lg font-semibold">Open Catalog</span>
                <span className="text-sm opacity-80">Browse all tools</span>
              </GoldOutlineButton>
              
              <GoldButton 
                type="button"
                onClick={handleRunDemo}
                className="h-auto p-6 flex flex-col items-center gap-2"
              >
                <span className="text-lg font-semibold">Run 90s Demo</span>
                <span className="text-sm opacity-80">Quick preview</span>
              </GoldButton>
              
              <GoldOutlineButton 
                onClick={handleBookMeeting}
                className="h-auto p-6 flex flex-col items-center gap-2"
              >
                <span className="text-lg font-semibold">Book 15-min</span>
                <span className="text-sm opacity-80">Personal walkthrough</span>
              </GoldOutlineButton>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}