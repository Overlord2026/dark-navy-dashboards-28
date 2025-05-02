
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DatePicker } from "@/components/ui/date-picker";
import { Investment } from "@/types/investments";
import { Trash2 } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface InvestmentFormProps {
  onNotify: (investments: Investment[]) => Promise<void>;
}

export const InvestmentForm: React.FC<InvestmentFormProps> = ({ onNotify }) => {
  const [investments, setInvestments] = useState<Investment[]>([
    { id: uuidv4(), name: "", currentValue: 0, purchaseDate: new Date() }
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddInvestment = () => {
    setInvestments([
      ...investments,
      { id: uuidv4(), name: "", currentValue: 0, purchaseDate: new Date() }
    ]);
  };

  const handleRemoveInvestment = (id: string) => {
    if (investments.length === 1) {
      toast.error("You must have at least one investment");
      return;
    }
    setInvestments(investments.filter(investment => investment.id !== id));
  };

  const handleInvestmentChange = (
    id: string,
    field: keyof Investment,
    value: string | number | Date
  ) => {
    setInvestments(
      investments.map(investment =>
        investment.id === id
          ? { ...investment, [field]: value }
          : investment
      )
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate investments
    const hasEmptyFields = investments.some(inv => !inv.name || inv.currentValue <= 0);
    if (hasEmptyFields) {
      toast.error("Please fill in all investment details");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await onNotify(investments);
      toast.success("Your investment interests have been shared with your advisor");
      
      // Reset the form after successful submission
      setInvestments([
        { id: uuidv4(), name: "", currentValue: 0, purchaseDate: new Date() }
      ]);
    } catch (error) {
      console.error("Error notifying advisor:", error);
      toast.error("Failed to notify your advisor. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        {investments.map((investment, index) => (
          <div 
            key={investment.id} 
            className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border border-[#2A3E5C] rounded-md bg-[#1B2A47]"
          >
            <div>
              <Label htmlFor={`name-${investment.id}`} className="text-white mb-2 block">
                Investment Name
              </Label>
              <Input
                id={`name-${investment.id}`}
                value={investment.name}
                onChange={e => handleInvestmentChange(investment.id, "name", e.target.value)}
                placeholder="e.g., Apple Stock, ETF"
                className="bg-[#0F1E3A] border-[#2A3E5C] text-white"
              />
            </div>
            
            <div>
              <Label htmlFor={`value-${investment.id}`} className="text-white mb-2 block">
                Current Value ($)
              </Label>
              <Input
                id={`value-${investment.id}`}
                type="number"
                min="0"
                step="0.01"
                value={investment.currentValue}
                onChange={e => handleInvestmentChange(
                  investment.id, 
                  "currentValue", 
                  parseFloat(e.target.value) || 0
                )}
                className="bg-[#0F1E3A] border-[#2A3E5C] text-white"
              />
            </div>
            
            <div>
              <Label className="text-white mb-2 block">
                Purchase Date
              </Label>
              <DatePicker 
                date={investment.purchaseDate}
                onSelect={(date) => {
                  if (date) {
                    handleInvestmentChange(investment.id, "purchaseDate", date);
                  }
                }}
                className="bg-[#0F1E3A] border-[#2A3E5C] text-white w-full"
              />
            </div>
            
            <div className="flex items-end">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => handleRemoveInvestment(investment.id)}
                className="text-red-500 hover:text-red-400 hover:bg-red-950/20"
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Remove
              </Button>
            </div>
          </div>
        ))}
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <Button
          type="button"
          onClick={handleAddInvestment}
          variant="outline"
          className="border-[#2A3E5C] text-white hover:bg-[#2A3E5C]"
        >
          + Add Another Investment
        </Button>
        
        <Button
          type="submit"
          disabled={isSubmitting}
          className="bg-[#9b87f5] hover:bg-[#7E69AB] text-white"
        >
          {isSubmitting ? "Notifying..." : "Notify My Advisor"}
        </Button>
      </div>
    </form>
  );
};
