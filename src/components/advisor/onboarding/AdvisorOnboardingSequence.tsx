import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { AdvisorOnboardingWelcome } from './AdvisorOnboardingWelcome';
import { AdvisorToolsInventory } from './AdvisorToolsInventory';
import { AdvisorOnboardingFlow } from './AdvisorOnboardingFlow';
import { PremiumFeatureDemo } from './PremiumFeatureDemo';
import { QuickActionsPanel } from './QuickActionsPanel';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface AdvisorOnboardingSequenceProps {
  onComplete: () => void;
}

type OnboardingPage = 'welcome' | 'tools' | 'flow' | 'premium' | 'support';

export function AdvisorOnboardingSequence({ onComplete }: AdvisorOnboardingSequenceProps) {
  const [currentPage, setCurrentPage] = useState<OnboardingPage>('welcome');

  const pages: OnboardingPage[] = ['welcome', 'tools', 'flow', 'premium', 'support'];
  const currentPageIndex = pages.indexOf(currentPage);

  const handleNext = () => {
    const nextIndex = currentPageIndex + 1;
    if (nextIndex < pages.length) {
      setCurrentPage(pages[nextIndex]);
    } else {
      onComplete();
    }
  };

  const handlePrevious = () => {
    const prevIndex = currentPageIndex - 1;
    if (prevIndex >= 0) {
      setCurrentPage(pages[prevIndex]);
    }
  };

  const handleGetStarted = () => {
    setCurrentPage('flow');
  };

  const handleWatchDemo = () => {
    setCurrentPage('premium');
  };

  const handleUpgradeToPremium = () => {
    setCurrentPage('premium');
  };

  const handleStepComplete = (stepId: string) => {
    console.log('Step completed:', stepId);
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'welcome':
        return (
          <AdvisorOnboardingWelcome 
            onGetStarted={handleGetStarted}
            onWatchDemo={handleWatchDemo}
          />
        );
      
      case 'tools':
        return (
          <AdvisorToolsInventory 
            onUpgradeToPremium={handleUpgradeToPremium}
          />
        );
      
      case 'flow':
        return (
          <AdvisorOnboardingFlow 
            onComplete={() => setCurrentPage('premium')}
            onStepComplete={handleStepComplete}
          />
        );
      
      case 'premium':
        return <PremiumFeatureDemo />;
      
      case 'support':
        return <QuickActionsPanel />;
      
      default:
        return null;
    }
  };

  const getPageTitle = () => {
    const titles: Record<OnboardingPage, string> = {
      welcome: 'Welcome to Your Advisor Suite',
      tools: 'Your Complete Toolkit',
      flow: 'Setup Your Practice',
      premium: 'Premium Features',
      support: 'Support & Resources'
    };
    return titles[currentPage];
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">{getPageTitle()}</h1>
          <div className="flex justify-center space-x-2">
            {pages.map((page, index) => (
              <div
                key={page}
                className={`h-2 w-8 rounded-full transition-colors ${
                  index === currentPageIndex 
                    ? 'bg-primary' 
                    : index < currentPageIndex 
                    ? 'bg-primary/60' 
                    : 'bg-muted'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto">
          {renderCurrentPage()}
        </div>

        {/* Navigation */}
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-card border border-border rounded-lg shadow-lg p-4">
          <div className="flex items-center gap-4">
            <Button 
              variant="outline" 
              onClick={handlePrevious}
              disabled={currentPageIndex === 0}
              className="gap-2"
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>

            <div className="text-sm text-muted-foreground">
              {currentPageIndex + 1} of {pages.length}
            </div>

            <Button 
              onClick={handleNext}
              className="gap-2"
            >
              {currentPageIndex === pages.length - 1 ? 'Complete' : 'Next'}
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}