
import React, { useState } from "react";
import { X, ArrowLeft, Info, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface TaxBudgetWizardProps {
  onClose: () => void;
}

type WizardStep = "year" | "accounts" | "limits" | "confirmation";

export const TaxBudgetWizard: React.FC<TaxBudgetWizardProps> = ({ onClose }) => {
  const [currentStep, setCurrentStep] = useState<WizardStep>("year");
  const [selectedYear, setSelectedYear] = useState("2025");
  const [selectedAccounts, setSelectedAccounts] = useState<string[]>([]);

  const handleBack = () => {
    switch (currentStep) {
      case "accounts":
        setCurrentStep("year");
        break;
      case "limits":
        setCurrentStep("accounts");
        break;
      case "confirmation":
        setCurrentStep("limits");
        break;
      default:
        onClose();
    }
  };

  const handleContinue = () => {
    switch (currentStep) {
      case "year":
        setCurrentStep("accounts");
        break;
      case "accounts":
        setCurrentStep("limits");
        break;
      case "limits":
        setCurrentStep("confirmation");
        break;
      case "confirmation":
        onClose(); // Complete the wizard
        break;
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case "year":
        return (
          <div className="px-8 py-12">
            <h2 className="text-3xl font-semibold mb-10">Select Year</h2>
            
            <div className="mt-8">
              <h3 className="text-xl mb-4">Tax Year</h3>
              
              <RadioGroup value={selectedYear} onValueChange={setSelectedYear} className="space-y-4">
                <div className="flex items-center space-x-2 p-4 rounded bg-[#0A1024] border border-gray-800">
                  <RadioGroupItem value="2025" id="year-2025" className="text-white" />
                  <div className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-2" />
                    <Label htmlFor="year-2025" className="text-white">2025 (Current Year)</Label>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 p-4 rounded bg-[#0A1024] border border-gray-800">
                  <RadioGroupItem value="2026" id="year-2026" className="text-white" />
                  <Label htmlFor="year-2026" className="text-white">2026</Label>
                </div>
                
                <div className="flex items-center space-x-2 p-4 rounded bg-[#0A1024] border border-gray-800">
                  <RadioGroupItem value="2027" id="year-2027" className="text-white" />
                  <Label htmlFor="year-2027" className="text-white">2027</Label>
                </div>
              </RadioGroup>
            </div>
          </div>
        );
        
      case "accounts":
        return (
          <div className="px-8 py-12">
            <h2 className="text-3xl font-semibold mb-10">Select Accounts</h2>
            
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl">Available Accounts (0)</h3>
              <p>0 Accounts selected</p>
            </div>
            
            <div className="p-4 border-t border-gray-800">
              <p className="font-medium">Tom's Accounts</p>
              {/* Empty state or would show accounts here */}
            </div>
          </div>
        );
        
      case "limits":
        return (
          <div className="px-8 py-12">
            <h2 className="text-3xl font-semibold mb-10">Set Tax Limits</h2>
            
            {/* Tax limit settings would go here */}
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="capital-gains" className="text-white">Capital Gains Tax Limit</Label>
                <div className="flex items-center">
                  <span className="bg-[#0A1024] p-2 border border-r-0 border-gray-800 rounded-l">$</span>
                  <input 
                    id="capital-gains" 
                    type="number" 
                    placeholder="5,000"
                    className="bg-[#0A1024] p-2 border border-gray-800 rounded-r w-full" 
                  />
                </div>
              </div>
            </div>
          </div>
        );
        
      case "confirmation":
        return (
          <div className="px-8 py-12">
            <h2 className="text-3xl font-semibold mb-10">Confirm Tax Budget</h2>
            
            <div className="space-y-6">
              <div className="p-4 bg-[#0A1024] rounded border border-gray-800">
                <h3 className="font-medium mb-2">Tax Year</h3>
                <p>2025</p>
              </div>
              
              <div className="p-4 bg-[#0A1024] rounded border border-gray-800">
                <h3 className="font-medium mb-2">Selected Accounts</h3>
                <p>No accounts selected</p>
              </div>
              
              <div className="p-4 bg-[#0A1024] rounded border border-gray-800">
                <h3 className="font-medium mb-2">Capital Gains Tax Limit</h3>
                <p>$5,000</p>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 bg-[#0D1428] text-white overflow-auto z-50">
      <div className="flex justify-between items-center p-4 border-b border-gray-800">
        <div className="flex items-center">
          <Button variant="ghost" onClick={handleBack} className="text-white">
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back
          </Button>
        </div>
        <p className="text-sm">Set a Tax Budget</p>
        <Button variant="ghost" onClick={onClose} className="text-white">
          <X className="h-5 w-5" />
        </Button>
      </div>
      
      <div className="flex min-h-[calc(100vh-4rem)]">
        <div className="flex-1">
          {renderStepContent()}
        </div>
        
        <div className="w-80 p-6 border-l border-gray-800">
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-2">Disclosure</h3>
            {currentStep === "year" && (
              <p className="text-sm text-gray-400">
                Taxes that have already been accrued will count towards the current year's budget.
              </p>
            )}
            
            {currentStep === "accounts" && (
              <p className="text-sm text-gray-400">
                If a new account is opened it will automatically be included in this tax budget.
              </p>
            )}
          </div>
          
          <div className="mt-auto">
            <Button 
              onClick={handleContinue} 
              className="w-full bg-white text-black hover:bg-gray-200"
            >
              Continue
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
