import { useState, useEffect } from 'react';
import { BillOptimizationInsight, Bill } from '@/types/bill';

// Sample insights
const initialInsights: BillOptimizationInsight[] = [
  {
    id: 'insight-1',
    billId: 'bill-3',
    title: 'Auto Insurance Review',
    description: 'Your auto insurance premium is 15% higher than average. Consider shopping around for better rates.',
    potentialSavings: 420,
    actionType: 'Review',
    recommended: true,
    relevantProviders: ['Geico', 'Progressive', 'Liberty Mutual'],
  },
  {
    id: 'insight-2',
    billId: 'bill-2',
    title: 'Energy Audit Recommended',
    description: 'Your electric bill is consistently higher than similar households. An energy audit could identify savings opportunities.',
    potentialSavings: 250,
    actionType: 'Switch Provider',
    recommended: true,
    relevantProviders: ['Green Energy Solutions', 'SolarCity'],
  },
  {
    id: 'insight-3',
    billId: 'bill-5',
    title: 'Home Insurance Annual Review',
    description: 'It\'s time for your annual home insurance review. Bundling with your auto insurance could save up to 20%.',
    potentialSavings: 240,
    actionType: 'Negotiate',
    recommended: true,
    relevantProviders: ['AllState Insurance', 'State Farm Insurance'],
  },
  {
    id: 'insight-4',
    billId: 'bill-4',
    title: 'Subscription Optimization',
    description: 'You could save by switching to an annual plan or the ad-supported tier.',
    potentialSavings: 48,
    actionType: 'Switch Provider',
    recommended: false,
  }
];

export interface InsightsManagementHook {
  insights: BillOptimizationInsight[];
  applyInsight: (insightId: string) => void;
  getBillInsights: (billId: string) => BillOptimizationInsight[];
  refreshInsights: (bills: Bill[]) => void;
}

export function useInsightsManagement(bills: Bill[]): InsightsManagementHook {
  const [insights, setInsights] = useState<BillOptimizationInsight[]>(initialInsights);

  // When a bill is removed, remove related insights
  useEffect(() => {
    const billIds = bills.map(bill => bill.id);
    setInsights(prev => prev.filter(insight => billIds.includes(insight.billId)));
  }, [bills]);

  const applyInsight = (insightId: string) => {
    // In a real app, this would implement the recommended action
    // For now, we'll just mark the insight as applied by removing it
    setInsights((prevInsights) => 
      prevInsights.filter((insight) => insight.id !== insightId)
    );
  };

  const getBillInsights = (billId: string) => {
    return insights.filter(insight => insight.billId === billId);
  };

  const refreshInsights = (bills: Bill[]) => {
    // This would be connected to a real insights generation algorithm
    // For now, we'll just keep the existing insights
    // In a real implementation, this could analyze bills and generate new insights
    console.log('Refreshing insights based on', bills.length, 'bills');
  };

  return {
    insights,
    applyInsight,
    getBillInsights,
    refreshInsights,
  };
}
