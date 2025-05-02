
import React from "react";

export const VaultSuggestionsPanel: React.FC = () => {
  const suggestions = [
    "Upload Beneficiary Designations to your Vault",
    "Add your Living Will and Health Care Directives",
    "Store digital copies of property deeds and titles",
    "Include investment account statements for complete records",
    "Add life insurance policies for easy family access"
  ];

  return (
    <div className="bg-[#0F1E3A] p-6 rounded-lg border border-[#2A3E5C] h-fit">
      <h3 className="text-lg font-medium mb-4 text-white">Document Suggestions</h3>
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
          These documents are recommended based on common estate planning best practices.
          Consult with your advisor for personalized recommendations.
        </p>
      </div>
    </div>
  );
};
