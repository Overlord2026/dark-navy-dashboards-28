import React from 'react';
import { ValueDrivenSavingsCalculator } from '@/components/ValueDrivenSavingsCalculator';

export default function ValueDrivenSavings() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <ValueDrivenSavingsCalculator />
      </div>
    </div>
  );
}