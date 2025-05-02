
import React, { useState } from "react";
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";
import { InvestmentForm } from "@/components/investments/InvestmentForm";
import { SuggestionsPanel } from "@/components/investments/SuggestionsPanel";
import { Investment } from "@/types/investments";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Investments: React.FC = () => {
  const [isNotifying, setIsNotifying] = useState(false);
  
  const handleNotifyAdvisor = async (investments: Investment[]) => {
    setIsNotifying(true);
    
    try {
      // Format investments data for the notification
      const payload = {
        investments: investments.map(inv => ({
          name: inv.name,
          value: inv.currentValue,
          purchaseDate: inv.purchaseDate.toISOString()
        })),
        timestamp: new Date().toISOString()
      };
      
      // Call the RPC function to notify the advisor
      const { data, error } = await supabase.rpc(
        'notify_advisor', 
        { 
          type: 'investment_interest', 
          data: payload 
        }
      );
      
      if (error) {
        throw error;
      }
      
      console.log("Advisor notification success, ID:", data);
      return data;
    } catch (error) {
      console.error("Error notifying advisor:", error);
      throw error;
    } finally {
      setIsNotifying(false);
    }
  };
  
  return (
    <ThreeColumnLayout title="My Investments">
      <div className="w-full max-w-6xl mx-auto px-4">
        <h1 className="text-2xl font-bold mb-6 text-white">My Investments</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-[#0F1E3A] p-6 rounded-lg border border-[#2A3E5C] mb-6">
              <h2 className="text-xl font-medium mb-4 text-white">Investment Details</h2>
              <p className="text-gray-400 mb-6">
                Enter the details of investments you're interested in, and we'll notify your advisor
                to discuss these options with you.
              </p>
              
              <InvestmentForm onNotify={handleNotifyAdvisor} />
            </div>
          </div>
          
          <div className="lg:col-span-1">
            <SuggestionsPanel />
          </div>
        </div>
      </div>
    </ThreeColumnLayout>
  );
};

export default Investments;
