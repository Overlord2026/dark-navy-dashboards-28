import React from 'react';
import { ThreeColumnLayout } from '@/components/layout/ThreeColumnLayout';
import { SmartCadencePanel } from '@/components/automation/SmartCadencePanel';

export default function AutomationSettings() {
  return (
    <ThreeColumnLayout 
      title="Automation Settings" 
      activeMainItem="settings"
      activeSecondaryItem="automation"
      secondaryMenuItems={[]}
    >
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Smart Automation Settings</h1>
          <p className="text-muted-foreground">
            Configure automated follow-up sequences and smart cadence rules
          </p>
        </div>

        <SmartCadencePanel />
      </div>
    </ThreeColumnLayout>
  );
}