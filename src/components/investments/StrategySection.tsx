
import React from "react";
import { Target } from "lucide-react";

interface Strategy {
  overview: string;
  approach: string;
  target: string;
  stage: string;
  geography: string;
  sectors: string[];
  expectedReturn: string;
  benchmarks: string[];
}

interface StrategySectionProps {
  strategy: Strategy;
}

export const StrategySection: React.FC<StrategySectionProps> = ({ strategy }) => {
  return (
    <div className="pb-6">
      <h3 className="text-lg font-bold mb-3 flex items-center">
        <span className="mr-2"><Target className="h-4 w-4" /></span>
        Investment Strategy
      </h3>
      <div className="bg-slate-100 dark:bg-slate-800/50 p-5 rounded-md">
        <div className="prose prose-sm dark:prose-invert max-w-none">
          <h4 className="text-sm font-medium text-blue-400 mb-2">Investment Approach</h4>
          <p className="text-gray-300 leading-relaxed mb-4">{strategy.overview}</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 pt-4 border-t border-slate-700/50">
            <div className="bg-slate-800/30 p-3 rounded hover:bg-slate-800/40 transition-colors">
              <h5 className="text-sm font-medium text-blue-400 mb-1">Focus Areas</h5>
              <ul className="list-disc list-inside text-xs text-gray-300 space-y-1">
                <li>{strategy.approach}</li>
                <li>{strategy.target}</li>
              </ul>
            </div>
            <div className="bg-slate-800/30 p-3 rounded hover:bg-slate-800/40 transition-colors">
              <h5 className="text-sm font-medium text-blue-400 mb-1">Key Differentiators</h5>
              <ul className="list-disc list-inside text-xs text-gray-300 space-y-1">
                <li>{strategy.stage}</li>
                <li>{strategy.geography}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
