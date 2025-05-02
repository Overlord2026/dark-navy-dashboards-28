
import React, { useState } from "react";
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";
import { GoalForm } from "@/components/goals/GoalForm";
import { GoalSuggestionsPanel } from "@/components/goals/GoalSuggestionsPanel";
import { FinancialGoal } from "@/types/goals";
import { notifyAdvisor } from "@/services/advisorNotifier";
import { toast } from "sonner";

const Goals: React.FC = () => {
  const [isNotifying, setIsNotifying] = useState(false);
  
  const handleNotifyAdvisor = async (goals: FinancialGoal[]): Promise<void> => {
    setIsNotifying(true);
    
    try {
      // Format goals data for the notification
      const payload = {
        goals: goals.map(goal => ({
          name: goal.name,
          targetAmount: goal.targetAmount,
          currentAmount: goal.currentAmount,
          targetDate: goal.targetDate.toISOString(),
          priority: goal.priority
        })),
        timestamp: new Date().toISOString()
      };
      
      // Use the shared service to notify the advisor
      await notifyAdvisor('goal_interest', payload);
      
      toast.success("Advisor notified successfully", {
        description: "Your advisor has been notified about your financial goals"
      });
    } catch (error) {
      console.error("Error notifying advisor:", error);
      toast.error("Failed to notify advisor", {
        description: "Please try again later"
      });
    } finally {
      setIsNotifying(false);
    }
  };
  
  return (
    <ThreeColumnLayout title="My Goals">
      <div className="w-full max-w-6xl mx-auto px-4">
        <h1 className="text-2xl font-bold mb-6 text-white">My Goals</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-[#0F1E3A] p-6 rounded-lg border border-[#2A3E5C] mb-6">
              <h2 className="text-xl font-medium mb-4 text-white">Financial Goals</h2>
              <p className="text-gray-400 mb-6">
                Define your financial goals below. Track your progress and get personalized
                advice from your advisor to help you achieve them faster.
              </p>
              
              <GoalForm onNotify={handleNotifyAdvisor} />
            </div>
          </div>
          
          <div className="lg:col-span-1">
            <GoalSuggestionsPanel />
          </div>
        </div>
      </div>
    </ThreeColumnLayout>
  );
};

export default Goals;
