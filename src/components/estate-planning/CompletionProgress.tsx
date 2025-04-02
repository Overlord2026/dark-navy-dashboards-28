
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface CompletionProgressProps {
  completedItems: number;
  totalItems: number;
}

export const CompletionProgress: React.FC<CompletionProgressProps> = ({
  completedItems,
  totalItems,
}) => {
  const completionPercentage = (completedItems / totalItems) * 100;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Completion Progress</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="w-full">
          <div className="flex justify-between text-sm mb-2">
            <span>Completion Status</span>
            <span>{completedItems} of {totalItems} completed</span>
          </div>
          <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
            <div 
              className="bg-green-500 h-full rounded-full transition-all duration-300 ease-in-out" 
              style={{ width: `${completionPercentage}%` }}
            ></div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
