import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, DollarSign, Percent, BarChart3 } from "lucide-react";

export const PremiumAnalytics = () => {
  const portfolioMetrics = [
    {
      label: "Total Annuity Value",
      value: "$1.2M",
      change: "+5.2%",
      trend: "up",
      icon: DollarSign,
      color: "text-emerald-600"
    },
    {
      label: "Monthly Income",
      value: "$8,400",
      change: "+2.1%",
      trend: "up",
      icon: TrendingUp,
      color: "text-blue-600"
    },
    {
      label: "Yield Average",
      value: "6.8%",
      change: "-0.3%",
      trend: "down",
      icon: Percent,
      color: "text-amber-600"
    }
  ];

  const allocations = [
    { type: "Fixed Immediate", percentage: 45, value: "$540K", color: "bg-emerald-500" },
    { type: "Fixed Indexed", percentage: 30, value: "$360K", color: "bg-blue-500" },
    { type: "Variable", percentage: 25, value: "$300K", color: "bg-amber-500" }
  ];

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 gap-4">
        {portfolioMetrics.map((metric, index) => {
          const Icon = metric.icon;
          const TrendIcon = metric.trend === 'up' ? TrendingUp : TrendingDown;
          
          return (
            <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-white border border-amber-100">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg bg-gradient-to-br from-slate-100 to-slate-200`}>
                  <Icon className={`h-4 w-4 ${metric.color}`} />
                </div>
                <div>
                  <div className="text-xs text-slate-600">{metric.label}</div>
                  <div className="font-bold text-slate-800">{metric.value}</div>
                </div>
              </div>
              <div className="text-right">
                <div className={`flex items-center gap-1 text-xs ${
                  metric.trend === 'up' ? 'text-emerald-600' : 'text-red-500'
                }`}>
                  <TrendIcon className="h-3 w-3" />
                  {metric.change}
                </div>
                <div className="text-xs text-slate-500">30 days</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Allocation Breakdown */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <BarChart3 className="h-4 w-4 text-slate-600" />
          <span className="text-sm font-medium text-slate-700">Asset Allocation</span>
        </div>
        
        <div className="space-y-2">
          {allocations.map((allocation, index) => (
            <div key={index} className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-600">{allocation.type}</span>
                <span className="font-medium text-slate-800">{allocation.percentage}%</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${allocation.color} transition-all duration-500`}
                  style={{ width: `${allocation.percentage}%` }}
                ></div>
              </div>
              <div className="text-xs text-slate-500">{allocation.value}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Performance Badge */}
      <div className="text-center">
        <Badge className="bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-700 border-emerald-200">
          ✓ Portfolio performing above benchmark
        </Badge>
      </div>
    </div>
  );
};