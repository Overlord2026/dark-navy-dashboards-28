
import React from "react";

export const AccountSuggestionsPanel: React.FC = () => {
  const suggestions = [
    "Consider linking your 401(k) for automatic balance updates",
    "Adding your mortgage accounts will provide a complete financial picture",
    "Link your credit cards to track spending in real-time",
    "Consider adding investment accounts to monitor portfolio performance",
    "Add bank accounts to enable automated transfers and bill payments"
  ];

  return (
    <div className="bg-[#0F1E3A] p-6 rounded-lg border border-[#2A3E5C] h-fit">
      <h3 className="text-lg font-medium mb-4 text-white">Suggestions</h3>
      <ul className="space-y-3">
        {suggestions.map((suggestion, index) => (
          <li key={index} className="flex items-start">
            <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-[#1EAEDB]/20 text-[#1EAEDB] mr-2 text-xs">
              {index + 1}
            </span>
            <span className="text-gray-300 text-sm">{suggestion}</span>
          </li>
        ))}
      </ul>
      
      <div className="mt-4 pt-4 border-t border-[#2A3E5C]">
        <p className="text-xs text-gray-400">
          These suggestions are based on common financial optimization strategies.
          Consult with your advisor for personalized recommendations.
        </p>
      </div>
    </div>
  );
};
