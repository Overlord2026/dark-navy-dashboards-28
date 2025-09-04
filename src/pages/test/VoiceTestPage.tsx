import React from 'react';
import { LindaVoiceTest } from '@/components/test/LindaVoiceTest';

export const VoiceTestPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-12">
      <div className="container mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-4">
            Linda Voice Configuration Test
          </h1>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Test Linda's new voice settings with AriaNeural, warmer pitch (1.3), and softer rate (0.95) for the perfect family-friendly tone.
          </p>
        </div>
        <LindaVoiceTest />
      </div>
    </div>
  );
};