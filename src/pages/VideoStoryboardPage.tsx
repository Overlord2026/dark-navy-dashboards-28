import React from 'react';
import { ThreeColumnLayout } from '@/components/layout/ThreeColumnLayout';
import { ComplianceVideoStoryboard } from '@/components/insurance/ComplianceVideoStoryboard';

export default function VideoStoryboardPage() {
  return (
    <ThreeColumnLayout 
      title="Video Storyboard" 
      activeMainItem="insurance"
      activeSecondaryItem="video-storyboard"
      secondaryMenuItems={[]}
    >
      <ComplianceVideoStoryboard />
    </ThreeColumnLayout>
  );
}