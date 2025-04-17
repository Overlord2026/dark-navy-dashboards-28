
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowUpIcon, ArrowDownIcon, PencilIcon } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { DashboardMetric } from "@/types/dashboard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface DashboardMetricCardProps {
  metric: DashboardMetric;
  onUpdate: (value: number) => void;
  onTargetUpdate: (target: number) => void;
}

export const DashboardMetricCard = ({ 
  metric, 
  onUpdate, 
  onTargetUpdate 
}: DashboardMetricCardProps) => {
  const [editing, setEditing] = useState(false);
  const [editingTarget, setEditingTarget] = useState(false);
  const [inputValue, setInputValue] = useState(metric.value !== null ? String(metric.value) : '');
  const [targetValue, setTargetValue] = useState(String(metric.target));

  // Format the value as currency unless it's savings rate (percentage)
  const formatValue = (value: number | null) => {
    if (value === null) return "Not set";
    
    if (metric.type === 'savings') {
      return `${value}%`;
    }
    
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(value);
  };

  // Calculate the percentage of target achieved, ensuring we don't divide by zero
  const getPercentageOfTarget = () => {
    if (metric.value === null || metric.target === 0) return 0;
    return Math.min(100, (metric.value / metric.target) * 100);
  };

  // Calculate the change percentage if previous value exists
  const getChangePercentage = () => {
    if (metric.value === null || metric.previousValue === null || metric.previousValue === 0) return null;
    return ((metric.value - metric.previousValue) / Math.abs(metric.previousValue)) * 100;
  };

  const changePercentage = getChangePercentage();
  const percentOfTarget = getPercentageOfTarget();

  // Get background color based on metric type
  const getBgColor = () => {
    switch (metric.type) {
      case 'income':
        return 'bg-blue-500/10';
      case 'expenses':
        return 'bg-red-500/10';
      case 'cashflow':
        return 'bg-green-500/10';
      case 'savings':
        return 'bg-purple-500/10';
      default:
        return 'bg-gray-500/10';
    }
  };

  // Get text color based on metric type
  const getTextColor = () => {
    switch (metric.type) {
      case 'income':
        return 'text-blue-500';
      case 'expenses':
        return 'text-red-500';
      case 'cashflow':
        return 'text-green-500';
      case 'savings':
        return 'text-purple-500';
      default:
        return 'text-gray-500';
    }
  };

  // Handle saving the edited value
  const handleSaveValue = () => {
    const parsedValue = parseFloat(inputValue);
    if (!isNaN(parsedValue)) {
      onUpdate(parsedValue);
    }
    setEditing(false);
  };

  // Handle saving the edited target
  const handleSaveTarget = () => {
    const parsedTarget = parseFloat(targetValue);
    if (!isNaN(parsedTarget)) {
      onTargetUpdate(parsedTarget);
    }
    setEditingTarget(false);
  };

  // Handle key press events for inputs
  const handleKeyPress = (e: React.KeyboardEvent, saveFunction: () => void) => {
    if (e.key === 'Enter') {
      saveFunction();
    } else if (e.key === 'Escape') {
      setEditing(false);
      setEditingTarget(false);
      setInputValue(metric.value !== null ? String(metric.value) : '');
      setTargetValue(String(metric.target));
    }
  };

  return (
    <Card className={`${getBgColor()} border-none hover:shadow-md transition-shadow`}>
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-3">
          <div className="space-y-1">
            <h3 className={`text-sm font-medium ${getTextColor()}`}>{metric.label}</h3>
            <div className="flex items-center">
              {editing ? (
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={(e) => handleKeyPress(e, handleSaveValue)}
                    autoFocus
                    className="w-[120px] h-8 text-lg font-bold"
                    step={metric.type === 'savings' ? "0.1" : "100"}
                  />
                  <Button size="sm" onClick={handleSaveValue} variant="secondary">
                    Save
                  </Button>
                </div>
              ) : (
                <div 
                  className="flex items-center cursor-pointer" 
                  onClick={() => {
                    setEditing(true);
                    setInputValue(metric.value !== null ? String(metric.value) : '');
                  }}
                >
                  <span className="text-2xl font-bold">{formatValue(metric.value)}</span>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-6 w-6 ml-1">
                        <PencilIcon className="h-3 w-3" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Edit value</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              )}
            </div>
          </div>
          
          {/* Show change indicator if previous value exists and we're not editing */}
          {changePercentage !== null && !editing && (
            <div 
              className={`flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                changePercentage > 0 
                  ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                  : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
              }`}
            >
              {changePercentage > 0 ? (
                <ArrowUpIcon className="h-3 w-3 mr-1" />
              ) : (
                <ArrowDownIcon className="h-3 w-3 mr-1" />
              )}
              {Math.abs(changePercentage).toFixed(1)}%
            </div>
          )}
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400">
            <span>Progress</span>
            <div className="flex items-center">
              {editingTarget ? (
                <div className="flex items-center gap-1">
                  <span className="text-xs mr-1">Target:</span>
                  <Input
                    type="number"
                    value={targetValue}
                    onChange={(e) => setTargetValue(e.target.value)}
                    onKeyDown={(e) => handleKeyPress(e, handleSaveTarget)}
                    autoFocus
                    className="w-[80px] h-6 text-xs"
                    step={metric.type === 'savings' ? "0.1" : "100"}
                  />
                  <Button size="sm" onClick={handleSaveTarget} variant="secondary" className="h-6 text-xs">
                    Set
                  </Button>
                </div>
              ) : (
                <div 
                  className="flex items-center cursor-pointer" 
                  onClick={() => {
                    setEditingTarget(true);
                    setTargetValue(String(metric.target));
                  }}
                >
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span>Target: {metric.type === 'savings' ? `${metric.target}%` : formatValue(metric.target)}</span>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Edit target</p>
                    </TooltipContent>
                  </Tooltip>
                  <PencilIcon className="h-3 w-3 ml-1" />
                </div>
              )}
            </div>
          </div>
          <Progress value={percentOfTarget} className="h-2" />
        </div>
      </CardContent>
    </Card>
  );
};
