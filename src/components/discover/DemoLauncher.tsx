import React, { useState } from 'react';
import { TourStepper } from './TourStepper';
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

  // Find the demo from config
  const demo = (demoConfig as Demo[]).find(d => d.id === demoId);

  const handleOpen = () => {
    setIsOpen(true);
    onDemoStart?.();
    
    // Analytics
    if (typeof window !== 'undefined' && (window as any).analytics) {
      (window as any).analytics.track('lp.persona.demo.launch', { 
        demoId,
        source: 'demo_launcher'
      });
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    onDemoComplete?.();
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