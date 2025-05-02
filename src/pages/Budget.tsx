
import React, { useState } from "react";
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";
import { BudgetForm } from "@/components/budget/BudgetForm";
import { BudgetSuggestionsPanel } from "@/components/budget/BudgetSuggestionsPanel";
import { BudgetCategory } from "@/types/budget";
import { notifyAdvisor } from "@/services/advisorNotifier";
import { toast } from "sonner";

const Budget: React.FC = () => {
  const [isNotifying, setIsNotifying] = useState(false);
  
  const handleNotifyAdvisor = async (categories: BudgetCategory[]): Promise<void> => {
    setIsNotifying(true);
    
    try {
      // Format budget data for the notification
      const payload = {
        categories: categories.map(category => ({
          name: category.name,
          amount: category.amount,
          timeframe: category.timeframe
        })),
        timestamp: new Date().toISOString()
      };
      
      // Use the shared service to notify the advisor
      await notifyAdvisor('budget_interest', payload);
      
      toast.success("Advisor notified successfully", {
        description: "Your advisor has been notified about your budget interests"
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
    <ThreeColumnLayout title="My Budget">
      <div className="w-full max-w-6xl mx-auto px-4">
        <h1 className="text-2xl font-bold mb-6 text-white">My Budget</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-[#0F1E3A] p-6 rounded-lg border border-[#2A3E5C] mb-6">
              <h2 className="text-xl font-medium mb-4 text-white">Budget Categories</h2>
              <p className="text-gray-400 mb-6">
                Enter your budget categories and amounts below. This will help your advisor
                create a personalized financial plan for you.
              </p>
              
              <BudgetForm onNotify={handleNotifyAdvisor} />
            </div>
          </div>
          
          <div className="lg:col-span-1">
            <BudgetSuggestionsPanel />
          </div>
        </div>
      </div>
    </ThreeColumnLayout>
  );
};

export default Budget;
