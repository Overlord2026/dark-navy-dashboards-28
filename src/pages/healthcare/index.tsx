import React from 'react';

export function HealthcareIndex() {
  return (
    <div className="min-h-screen bg-[hsl(var(--bfo-black))] p-8">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">Healthcare Financial Planning</h1>
        <div className="bfo-card">
          <p className="text-white/80">
            Comprehensive healthcare financial planning tools and resources.
          </p>
          <p className="text-white/60 mt-4">Coming soon</p>
        </div>
      </div>
    </div>
  );
}

// 👇 this fixes React.lazy + TypeScript
export default HealthcareIndex;