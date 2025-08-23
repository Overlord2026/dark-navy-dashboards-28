import React, { useState } from 'react';
import { TourStepper } from './TourStepper';
import demoConfig from '@/config/demoConfig.json';

interface SimpleDemoStep {
  h: string;
  p: string;
}

interface SimpleDemo {
  id: string;
  title: string;
  steps: SimpleDemoStep[];
  cta: string;
}

// This matches the old Demo interface that TourStepper expects
interface Demo {
  id: string;
  title: string;
  description: string;
  shareMessage: string;
  steps: Array<{
    title: string;
    content: string;
    image: string;
    duration: number;
  }>;
}

interface DemoLauncherProps {
  demoId: string;
  trigger?: React.ReactNode;
  onDemoStart?: () => void;
  onDemoComplete?: () => void;
}

export const DemoLauncher: React.FC<DemoLauncherProps> = ({ 
  demoId, 
  trigger,
  onDemoStart,
  onDemoComplete
}) => {
  const [isOpen, setIsOpen] = useState(false);

  // Convert simple demo to full demo format
  const simpleDemo = (demoConfig as SimpleDemo[]).find(d => d.id === demoId);
  const demo = simpleDemo ? {
    id: simpleDemo.id,
    title: simpleDemo.title,
    description: `60-second interactive tour: ${simpleDemo.title}`,
    shareMessage: `${simpleDemo.title} - Check this out: a 60-second tour of how this platform works`,
    steps: simpleDemo.steps.map(step => ({
      title: step.h,
      content: step.p,
      image: "/placeholder.svg",
      duration: 12000
    }))
  } : null;

  const handleOpen = () => {
    setIsOpen(true);
    onDemoStart?.();
    
    // Analytics - demo.open
    if (typeof window !== 'undefined' && (window as any).analytics) {
      (window as any).analytics.track('demo.open', { 
        id: demoId,
        title: simpleDemo?.title,
        source: 'demo_launcher'
      });
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    onDemoComplete?.();
    
    // Analytics - demo.complete
    if (typeof window !== 'undefined' && (window as any).analytics) {
      (window as any).analytics.track('demo.complete', { 
        id: demoId,
        title: simpleDemo?.title,
        source: 'demo_launcher'
      });
    }
  };

  if (!demo) {
    console.warn(`Demo with id "${demoId}" not found in demoConfig.json`);
    return null;
  }

  return (
    <>
      {trigger ? (
        <div onClick={handleOpen} style={{ cursor: 'pointer' }}>
          {trigger}
        </div>
      ) : (
        <button onClick={handleOpen}>
          Launch Demo
        </button>
      )}
      
      <TourStepper 
        demo={demo}
        isOpen={isOpen}
        onClose={handleClose}
      />
    </>
  );
};