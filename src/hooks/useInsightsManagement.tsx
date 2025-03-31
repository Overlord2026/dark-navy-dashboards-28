
import { useState } from "react";
import { Bill, BillOptimizationInsight } from "@/types/bill";

// Sample data for initial insights
const initialInsights: BillOptimizationInsight[] = [
  {
    id: "insight-1",
    billId: "bill-4",
    title: "Consider a cheaper streaming plan",
    description: "Your Netflix subscription could be switched to a lower-tier plan, saving you money each month without losing essential features.",
    potentialSavings: 96.00,
    actionType: "Switch Provider",
    recommended: true,
    relevantProviders: ["Hulu", "Disney+"]
  },
  {
    id: "insight-2",
    billId: "bill-2",
    title: "Energy-saving recommendations",
    description: "Based on your electric bill, we recommend installing a smart thermostat and LED bulbs to reduce your monthly electricity costs.",
    potentialSavings: 220.50,
    actionType: "Review",
    recommended: false
  },
  {
    id: "insight-3",
    billId: "bill-3",
    title: "Insurance bundle discount",
    description: "You could save on your auto insurance by bundling it with your home insurance policy from the same provider.",
    potentialSavings: 310.75,
    actionType: "Negotiate",
    recommended: true
  }
];

export interface InsightsManagementHook {
  insights: BillOptimizationInsight[];
  applyInsight: (id: string) => void;
  getInsightsByBillId: (billId: string) => BillOptimizationInsight[];
  addInsight: (insight: BillOptimizationInsight) => void;
  removeInsight: (id: string) => void;
}

export function useInsightsManagement(bills: Bill[]): InsightsManagementHook {
  const [insights, setInsights] = useState<BillOptimizationInsight[]>(initialInsights);

  const applyInsight = (id: string) => {
    // In a real app, this would apply the insight's recommendations
    // For now, we'll just mark it as applied by removing it
    setInsights((prevInsights) => 
      prevInsights.filter((insight) => insight.id !== id)
    );
  };

  const getInsightsByBillId = (billId: string) => {
    return insights.filter((insight) => insight.billId === billId);
  };

  const addInsight = (insight: BillOptimizationInsight) => {
    setInsights((prevInsights) => [...prevInsights, insight]);
  };

  const removeInsight = (id: string) => {
    setInsights((prevInsights) => 
      prevInsights.filter((insight) => insight.id !== id)
    );
  };

  return {
    insights,
    applyInsight,
    getInsightsByBillId,
    addInsight,
    removeInsight
  };
}
