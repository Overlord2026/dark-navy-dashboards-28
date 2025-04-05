
import React from "react";
import { Save, FileBarChart, Wallet, Calculator } from "lucide-react";

export interface TaxStrategyCardProps {
  title: string;
  description: string;
  impact: string;
  icon: React.ReactNode;
  status: "implemented" | "recommended" | "in-progress";
}

export const TaxStrategyCard = ({ title, description, impact, icon, status }: TaxStrategyCardProps) => {
  const getStatusBadge = () => {
    switch (status) {
      case "implemented":
        return (
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-400">
            Implemented
          </span>
        );
      case "recommended":
        return (
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-400">
            Recommended
          </span>
        );
      case "in-progress":
        return (
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-amber-500/20 text-amber-400">
            In Progress
          </span>
        );
      default:
        return null;
    }
  };
  
  return (
    <div className="bg-[#1a2236] p-4 rounded-lg border border-gray-800">
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center">
          {icon}
          <h3 className="ml-2 font-medium">{title}</h3>
        </div>
        {getStatusBadge()}
      </div>
      <p className="text-sm text-gray-400 mb-3">{description}</p>
      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-400">Potential Savings</span>
        <span className="font-medium text-green-400">{impact}</span>
      </div>
    </div>
  );
};
