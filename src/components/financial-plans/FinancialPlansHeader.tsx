
import React from "react";
import { Target } from "lucide-react";

export const FinancialPlansHeader = () => {
  return (
    <section className="text-center space-y-4 mb-12">
      <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-4">
        <Target className="h-8 w-8 text-white" />
      </div>
      <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
        Financial Plans
      </h1>
      <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
        Create comprehensive financial plans to achieve your goals. Track progress, manage assets, and build your financial future.
      </p>
    </section>
  );
};
