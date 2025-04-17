
import { useState } from "react";
import { DashboardMetric } from "@/types/dashboard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Pencil, TrendingUp, TrendingDown } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Progress } from "@/components/ui/progress";

interface DashboardMetricCardProps {
  metric: DashboardMetric;
  onUpdate: (value: number) => void;
  onTargetUpdate: (target: number) => void;
}

const tooltipContent = {
  income: "Your total monthly income from all sources",
  expenses: "Your total monthly expenses across all categories",
  cashflow: "The difference between your income and expenses",
  savings: "Percentage of income saved monthly"
};

export function DashboardMetricCard({ metric, onUpdate, onTargetUpdate }: DashboardMetricCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isEditingTarget, setIsEditingTarget] = useState(false);
  const [inputValue, setInputValue] = useState(metric.value?.toString() || "");
  const [targetValue, setTargetValue] = useState(metric.target?.toString() || "");

  const handleValueSubmit = () => {
    const newValue = parseFloat(inputValue);
    if (!isNaN(newValue)) {
      onUpdate(newValue);
    }
    setIsEditing(false);
  };

  const handleTargetSubmit = () => {
    const newTarget = parseFloat(targetValue);
    if (!isNaN(newTarget)) {
      onTargetUpdate(newTarget);
    }
    setIsEditingTarget(false);
  };

  const getPercentageChange = () => {
    if (!metric.value || !metric.previousValue) return null;
    return ((metric.value - metric.previousValue) / metric.previousValue) * 100;
  };

  const percentChange = getPercentageChange();
  const progressValue = metric.value && metric.target ? (metric.value / metric.target) * 100 : 0;

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-md font-medium">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  {metric.label}
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-sm">{tooltipContent[metric.type]}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={() => setIsEditing(!isEditing)}
          >
            <Pencil className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {isEditing ? (
            <div className="flex gap-2">
              <Input
                type="number"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="bg-background/50"
                placeholder={`Enter ${metric.label.toLowerCase()}`}
              />
              <Button size="sm" onClick={handleValueSubmit}>Save</Button>
            </div>
          ) : (
            <div className="text-2xl font-semibold">
              {metric.type === 'savings' ? 
                `${metric.value?.toFixed(1)}%` :
                metric.value ? 
                  `$${metric.value.toLocaleString()}` : 
                  'Not set'
              }
            </div>
          )}

          {percentChange !== null && (
            <div className="flex items-center text-sm">
              {percentChange > 0 ? (
                <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
              )}
              <span className={percentChange > 0 ? "text-green-500" : "text-red-500"}>
                {Math.abs(percentChange).toFixed(1)}%
              </span>
              <span className="text-muted-foreground ml-1">vs last month</span>
            </div>
          )}

          <div className="mt-4">
            {isEditingTarget ? (
              <div className="flex gap-2">
                <Input
                  type="number"
                  value={targetValue}
                  onChange={(e) => setTargetValue(e.target.value)}
                  className="bg-background/50"
                  placeholder="Set target"
                />
                <Button size="sm" onClick={handleTargetSubmit}>Save</Button>
              </div>
            ) : (
              <div className="flex items-center justify-between text-sm mb-1" onClick={() => setIsEditingTarget(true)}>
                <span>Target</span>
                <span className="font-medium">
                  {metric.type === 'savings' ? 
                    `${metric.target}%` :
                    `$${metric.target.toLocaleString()}`
                  }
                </span>
              </div>
            )}
            <Progress value={progressValue} className="h-2" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
