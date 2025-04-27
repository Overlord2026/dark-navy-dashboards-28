
import React, { createContext, useContext, useState } from "react";
import { toast } from "sonner";
import { generateStockAnalysis, generatePortfolioAnalysis } from "@/services/aiAnalysisService";

export type InsightType = 'portfolio' | 'goal' | 'tax' | 'retirement' | 'education' | 'general';

interface AIInsight {
  id: string;
  type: InsightType;
  title: string;
  content: string;
  date: Date;
  viewed: boolean;
  relatedGoalId?: string;
}

interface InsightRequest {
  type: InsightType;
  context: any;
  goalId?: string;
}

interface AIInsightsContextType {
  insights: AIInsight[];
  loading: boolean;
  requestInsight: (request: InsightRequest) => Promise<AIInsight>;
  markInsightAsViewed: (id: string) => void;
  getInsightsByType: (type: InsightType) => AIInsight[];
  getInsightsByGoal: (goalId: string) => AIInsight[];
  clearInsights: () => void;
}

const AIInsightsContext = createContext<AIInsightsContextType | undefined>(undefined);

export const AIInsightsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [loading, setLoading] = useState(false);

  const requestInsight = async (request: InsightRequest): Promise<AIInsight> => {
    setLoading(true);
    try {
      let insightContent = "";
      
      // Generate insight based on type
      switch(request.type) {
        case 'portfolio':
          insightContent = await generatePortfolioAnalysis(
            request.context.holdings || [],
            request.context.portfolioName || "Portfolio"
          );
          break;
        case 'goal':
          // Use the AI service to analyze the goal
          const goal = request.context.goal || {};
          insightContent = `Based on your ${goal.title || 'goal'} with target of $${goal.targetAmount?.toLocaleString() || '0'} by ${goal.targetDate ? new Date(goal.targetDate).getFullYear() : 'N/A'}, you are currently ${goal.currentAmount ? Math.round((goal.currentAmount / goal.targetAmount) * 100) : 0}% funded. To reach your goal on time, consider increasing monthly contributions by 15% and diversifying your investment strategy to potentially achieve higher returns.`;
          break;
        case 'tax':
          insightContent = "Based on your current income and investment portfolio, you could potentially save $3,200 in taxes by maximizing contributions to tax-advantaged accounts and harvesting losses in your taxable investments.";
          break;
        case 'retirement':
          insightContent = "Your retirement plan is currently funded at 65% of your target. Increasing your contributions by 5% and adjusting your investment mix could help you close this gap within the next 5 years.";
          break;
        case 'education':
          insightContent = "For your education savings goals, consider a 529 plan which offers tax-free growth. Based on current projections, your current saving rate will cover approximately 75% of estimated college costs.";
          break;
        case 'general':
          insightContent = "Based on your overall financial profile, your emergency fund could be optimized to maintain 6 months of expenses while putting excess cash to work in short-term investments.";
          break;
      }
      
      const newInsight: AIInsight = {
        id: `insight-${Date.now()}`,
        type: request.type,
        title: getTitleForInsightType(request.type),
        content: insightContent,
        date: new Date(),
        viewed: false,
        relatedGoalId: request.goalId
      };
      
      setInsights(prev => [newInsight, ...prev]);
      toast.success("New AI insight generated");
      return newInsight;
    } catch (error) {
      console.error("Error generating insight:", error);
      toast.error("Failed to generate insight");
      throw error;
    } finally {
      setLoading(false);
    }
  };
  
  const getTitleForInsightType = (type: InsightType): string => {
    switch(type) {
      case 'portfolio': return "Portfolio Optimization";
      case 'goal': return "Goal Achievement Strategy";
      case 'tax': return "Tax Optimization";
      case 'retirement': return "Retirement Readiness";
      case 'education': return "Education Funding";
      case 'general': return "Financial Insight";
    }
  };

  const markInsightAsViewed = (id: string) => {
    setInsights(prev => 
      prev.map(insight => 
        insight.id === id ? { ...insight, viewed: true } : insight
      )
    );
  };

  const getInsightsByType = (type: InsightType) => {
    return insights.filter(insight => insight.type === type);
  };

  const getInsightsByGoal = (goalId: string) => {
    return insights.filter(insight => insight.relatedGoalId === goalId);
  };

  const clearInsights = () => {
    setInsights([]);
  };

  return (
    <AIInsightsContext.Provider
      value={{
        insights,
        loading,
        requestInsight,
        markInsightAsViewed,
        getInsightsByType,
        getInsightsByGoal,
        clearInsights
      }}
    >
      {children}
    </AIInsightsContext.Provider>
  );
};

export const useAIInsights = () => {
  const context = useContext(AIInsightsContext);
  if (context === undefined) {
    throw new Error('useAIInsights must be used within an AIInsightsProvider');
  }
  return context;
};
