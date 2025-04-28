
import React from "react";
import { DollarSignIcon, BarChart4Icon, UsersIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface MetricsCardProps {
  type: 'aum' | 'fees' | 'clients';
  value: string;
  subtitle: string;
  trend?: {
    value: string;
    isPositive: boolean;
  };
}

export const MetricsCard = ({ type, value, subtitle, trend }: MetricsCardProps) => {
  const getIcon = () => {
    switch (type) {
      case 'aum':
        return <DollarSignIcon className="h-8 w-8 text-green-600" />;
      case 'fees':
        return <BarChart4Icon className="h-8 w-8 text-blue-600" />;
      case 'clients':
        return <UsersIcon className="h-8 w-8 text-purple-600" />;
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-[#DCD8C0]">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-[#222222]">
          {type === 'aum' && 'Total AUM'}
          {type === 'fees' && 'Monthly Fees'}
          {type === 'clients' && 'Active Clients'}
        </h2>
        {getIcon()}
      </div>
      <p className="text-3xl font-bold text-[#222222]">{value}</p>
      <p className="text-sm text-gray-500 mt-2">{subtitle}</p>
      {trend && (
        <div className="text-xs text-green-400">
          {trend.isPositive ? '+' : '-'}{trend.value}
        </div>
      )}
    </div>
  );
};
