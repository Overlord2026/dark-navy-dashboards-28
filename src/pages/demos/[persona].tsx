import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { TourStepper } from '@/components/discover/TourStepper';
import { ShareButton } from '@/components/discover/ShareButton';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import demoConfig from '@/config/demoConfig.json';

interface Demo {
  id: string;
  title: string;
  persona?: string;
  segment?: string;
  category?: string;
  description: string;
  shareMessage: string;
  steps: Array<{
    title: string;
    content: string;
    image: string;
    duration: number;
  }>;
}

const DemoPage: React.FC = () => {
  const { persona } = useParams<{ persona: string }>();
  const [isOpen, setIsOpen] = useState(true);
  
  // Find demo by persona ID from config
  const demo = (demoConfig as Demo[]).find(d => d.id === persona);

  useEffect(() => {
    // Analytics
    if (typeof window !== 'undefined' && (window as any).analytics) {
      (window as any).analytics.track('demo.page.visit', { persona, demoId: demo?.id });
    }
  }, [persona, demo?.id]);

  const handleClose = () => {
    setIsOpen(false);
    // Redirect back to discover
    window.location.href = '/discover';
  };

  const handleStartWorkspace = () => {
    // Analytics
    if (typeof window !== 'undefined' && (window as any).analytics) {
      (window as any).analytics.track('lp.hero.cta', { persona, source: 'demo_page' });
    }
    
    window.location.href = `/onboarding?persona=${demo?.persona}&segment=${demo?.segment}`;
  };

  if (!persona || !demo) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold">Demo not found</h1>
          <p className="text-muted-foreground">The requested demo could not be found.</p>
          <Button asChild>
            <a href="/discover">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Discover
            </a>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" asChild>
                <a href="/discover">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Discover
                </a>
              </Button>
              <div>
                <h1 className="text-lg font-semibold">{demo.title}</h1>
                <p className="text-sm text-muted-foreground">
                  {demo.description}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <ShareButton 
                text={demo.shareMessage.replace('{url}', window.location.href)}
                url={window.location.href}
                variant="outline"
                size="sm"
              />
              <Button size="sm" className="bg-gold hover:bg-gold-hover text-navy" onClick={handleStartWorkspace}>
                <ArrowRight className="mr-2 h-4 w-4" />
                Start workspace
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Demo Content */}
      <main className="container mx-auto px-6 py-8">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h2 className="text-3xl font-bold">
            {demo.title}
          </h2>
          <p className="text-xl text-muted-foreground">
            This 60-second demo shows how the platform works specifically for your needs.
          </p>
        </div>
      </main>

      {/* Tour Stepper */}
      <TourStepper
        demo={demo}
        isOpen={isOpen}
        onClose={handleClose}
      />
    </div>
  );
};

export default DemoPage;
