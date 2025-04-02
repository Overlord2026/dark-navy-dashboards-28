
import React, { useState } from "react";
import { X, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HypotheticalScenarioWizardProps {
  onClose: () => void;
}

type WizardStep = "accounts" | "portfolio" | "settings" | "confirmation";

export const HypotheticalScenarioWizard: React.FC<HypotheticalScenarioWizardProps> = ({ onClose }) => {
  const [currentStep, setCurrentStep] = useState<WizardStep>("accounts");
  const [selectedAccounts, setSelectedAccounts] = useState<string[]>([]);

  const handleBack = () => {
    switch (currentStep) {
      case "portfolio":
        setCurrentStep("accounts");
        break;
      case "settings":
        setCurrentStep("portfolio");
        break;
      case "confirmation":
        setCurrentStep("settings");
        break;
      default:
        onClose();
    }
  };

  const handleContinue = () => {
    switch (currentStep) {
      case "accounts":
        setCurrentStep("portfolio");
        break;
      case "portfolio":
        setCurrentStep("settings");
        break;
      case "settings":
        setCurrentStep("confirmation");
        break;
      case "confirmation":
        onClose(); // Complete the wizard
        break;
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case "accounts":
        return (
          <div className="px-8 py-12">
            <div className="flex items-center text-sm text-gray-400 mb-2">
              <span>Hypothetical Scenario</span>
              <span className="mx-2">·</span>
              <span>Tom Brady</span>
            </div>
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
        
      case "portfolio":
        return (
          <div className="px-8 py-12">
            <h2 className="text-3xl font-semibold mb-10">Select Portfolio Model</h2>
            
            {/* Portfolio model selection would go here */}
            <div className="space-y-4">
              <div className="p-4 bg-[#0A1024] rounded border border-gray-800">
                <h3 className="font-medium">Growth Portfolio</h3>
                <p className="text-sm text-gray-400">80% stocks, 20% bonds</p>
              </div>
              
              <div className="p-4 bg-[#0A1024] rounded border border-gray-800">
                <h3 className="font-medium">Balanced Portfolio</h3>
                <p className="text-sm text-gray-400">60% stocks, 40% bonds</p>
              </div>
              
              <div className="p-4 bg-[#0A1024] rounded border border-gray-800">
                <h3 className="font-medium">Conservative Portfolio</h3>
                <p className="text-sm text-gray-400">40% stocks, 60% bonds</p>
              </div>
            </div>
          </div>
        );
        
      case "settings":
        return (
          <div className="px-8 py-12">
            <h2 className="text-3xl font-semibold mb-10">Scenario Settings</h2>
            
            {/* Scenario settings would go here */}
            <div className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="scenario-name" className="block text-white">Scenario Name</label>
                <input 
                  id="scenario-name" 
                  type="text" 
                  placeholder="My Scenario"
                  className="bg-[#0A1024] p-2 border border-gray-800 rounded w-full" 
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="tax-horizon" className="block text-white">Tax Planning Horizon</label>
                <select 
                  id="tax-horizon" 
                  className="bg-[#0A1024] p-2 border border-gray-800 rounded w-full"
                >
                  <option>1 Year</option>
                  <option>3 Years</option>
                  <option>5 Years</option>
                  <option>10 Years</option>
                </select>
              </div>
            </div>
          </div>
        );
        
      case "confirmation":
        return (
          <div className="px-8 py-12">
            <h2 className="text-3xl font-semibold mb-10">Confirm Scenario</h2>
            
            <div className="space-y-6">
              <div className="p-4 bg-[#0A1024] rounded border border-gray-800">
                <h3 className="font-medium mb-2">Scenario Name</h3>
                <p>My Scenario</p>
              </div>
              
              <div className="p-4 bg-[#0A1024] rounded border border-gray-800">
                <h3 className="font-medium mb-2">Selected Accounts</h3>
                <p>No accounts selected</p>
              </div>
              
              <div className="p-4 bg-[#0A1024] rounded border border-gray-800">
                <h3 className="font-medium mb-2">Portfolio Model</h3>
                <p>Growth Portfolio</p>
              </div>
              
              <div className="p-4 bg-[#0A1024] rounded border border-gray-800">
                <h3 className="font-medium mb-2">Tax Planning Horizon</h3>
                <p>5 Years</p>
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
        <p className="text-sm">Hypothetical Scenario</p>
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
