
import React, { useState } from "react";
import { useTheme } from "@/context/ThemeContext";
import { BillOptimizationInsight } from "@/types/bill";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRightIcon, TrendingDownIcon, ListChecksIcon, ArrowUpDownIcon, SwitchCameraIcon } from "lucide-react";
import { useBills } from "@/hooks/useBills";
import { InsightDetailsDialog } from "./InsightDetailsDialog";

interface BillsInsightsProps {
  insights: BillOptimizationInsight[];
}

export function BillsInsights({ insights }: BillsInsightsProps) {
  const { theme } = useTheme();
  const isLightTheme = theme === "light";
  const { applyInsight, bills } = useBills();
  const [selectedInsight, setSelectedInsight] = useState<BillOptimizationInsight | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const getActionIcon = (actionType: string) => {
    switch (actionType) {
      case "Review":
        return <ListChecksIcon className="h-5 w-5 text-blue-500" />;
      case "Switch Provider":
        return <SwitchCameraIcon className="h-5 w-5 text-purple-500" />;
      case "Negotiate":
        return <ArrowUpDownIcon className="h-5 w-5 text-orange-500" />;
      case "Eliminate":
        return <TrendingDownIcon className="h-5 w-5 text-red-500" />;
      default:
        return <ListChecksIcon className="h-5 w-5 text-blue-500" />;
    }
  };

  const getBillName = (billId: string) => {
    const bill = bills.find(b => b.id === billId);
    return bill ? bill.name : "Unknown Bill";
  };

  const handleOpenDetails = (insight: BillOptimizationInsight) => {
    setSelectedInsight(insight);
    setIsDetailsOpen(true);
  };

  if (insights.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500">No optimization insights available at this time</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {insights.map((insight) => (
        <Card 
          key={insight.id}
          className={`p-4 ${
            isLightTheme 
              ? "bg-[#F2F0E1] border-[#DCD8C0]" 
              : insight.recommended 
                ? "bg-[#121a2c] border-blue-800" 
                : "bg-[#121a2c] border-gray-800"
          }`}
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className={`p-2 rounded-full ${isLightTheme ? "bg-[#E9E7D8]" : "bg-gray-800"} mt-1`}>
                {getActionIcon(insight.actionType)}
              </div>
              <div>
                <h3 className="font-medium">{insight.title}</h3>
                <p className="text-sm text-gray-500">
                  For: {getBillName(insight.billId)}
                </p>
                <p className="text-sm mt-1 max-w-md line-clamp-2">
                  {insight.description}
                </p>
              </div>
            </div>
            
            <div className="flex flex-col items-end gap-2">
              <div className="text-right">
                <p className="text-sm text-gray-500">Potential Savings</p>
                <p className="font-semibold text-green-500">
                  ${insight.potentialSavings.toFixed(2)}
                </p>
              </div>
              
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1"
                  onClick={() => handleOpenDetails(insight)}
                >
                  Details
                </Button>
                <Button
                  variant={insight.recommended ? "default" : "outline"}
                  size="sm"
                  className="flex items-center gap-1"
                  onClick={() => applyInsight(insight.id)}
                >
                  Apply <ArrowRightIcon className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </Card>
      ))}

      {selectedInsight && (
        <InsightDetailsDialog
          insight={selectedInsight}
          isOpen={isDetailsOpen}
          onOpenChange={setIsDetailsOpen}
        />
      )}
    </div>
  );
}
