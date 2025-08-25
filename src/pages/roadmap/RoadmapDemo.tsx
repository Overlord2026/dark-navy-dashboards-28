import React from 'react';
import { K401Panel } from './K401Panel';

// Demo page showing Monte Carlo integration
const RoadmapDemo = () => {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">401(k) Monte Carlo Roadmap</h1>
        <p className="text-muted-foreground">
          Interactive 401(k) planning with 10,000 simulation Monte Carlo analysis
        </p>
      </div>

      <K401Panel
        currentAge={35}
        retireAge={65}
        currentBalance={25000}
        income={75000}
        initialDeferralPct={6}
        employerMatch={{ kind: 'simple', pct: 50, limitPct: 6 }}
        expectedExpenses={60000}
      />
    </div>
  );
};

export default RoadmapDemo;