
import React from "react";
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Clock } from "lucide-react";

/*
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Info, ArrowLeft } from "lucide-react";
import { TaxBudgetWizard } from "@/components/tax-budgets/TaxBudgetWizard";
import { HypotheticalScenarioWizard } from "@/components/tax-budgets/HypotheticalScenarioWizard";
*/

const TaxBudgets = () => {
  /*
  const [showNewBudgetWizard, setShowNewBudgetWizard] = useState(false);
  const [showScenarioWizard, setShowScenarioWizard] = useState(false);
  const navigate = useNavigate();

  // Mock data for current year's capital gains taxes
  const capitalGainsTaxes = {
    current: 0,
    max: 10000,
  };

  // Mock data for realized capital gains
  const realizedGains = {
    shortTerm: 0,
    longTerm: 0,
  };

  const handleNewBudget = () => {
    setShowNewBudgetWizard(true);
  };

  const handleNewScenario = () => {
    setShowScenarioWizard(true);
  };

  const handleCloseWizard = () => {
    setShowNewBudgetWizard(false);
    setShowScenarioWizard(false);
  };

  if (showNewBudgetWizard) {
    return <TaxBudgetWizard onClose={handleCloseWizard} />;
  }

  if (showScenarioWizard) {
    return <HypotheticalScenarioWizard onClose={handleCloseWizard} />;
  }
  */

  return (
    <ThreeColumnLayout title="Tax Budgets" activeMainItem="tax-budgets">
      <div className="flex items-center justify-center min-h-[80vh] px-4 py-6">
        <Card className="max-w-md w-full">
          <CardContent className="flex flex-col items-center justify-center text-center py-12">
            <Clock className="h-16 w-16 text-muted-foreground mb-6" />
            <h2 className="text-2xl font-bold mb-2">Coming Soon</h2>
            <p className="text-muted-foreground">
              Tax Budgets functionality is currently under development and will be available soon.
            </p>
          </CardContent>
        </Card>
      </div>

      {/*
      <div className="max-w-5xl mx-auto w-full space-y-6">
        <h1 className="text-3xl font-bold">Tax Budgets</h1>

        <Card className="bg-[#0D1428] text-white border-none">
          <CardContent className="pt-6">
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-medium">2025 Capital Gains Taxes</h3>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-4 w-4 text-gray-400 cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="w-[200px]">Shows your capital gains tax budget for the current year</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <span className="font-medium">${capitalGainsTaxes.current.toFixed(2)}</span>
            </div>
            <Progress value={(capitalGainsTaxes.current / capitalGainsTaxes.max) * 100} className="h-2 bg-gray-700" />
          </CardContent>
        </Card>

        <Card className="bg-[#0D1428] text-white border-none">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-4">
              <h3 className="text-lg font-medium">Realized Capital Gains</h3>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-4 w-4 text-gray-400 cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="w-[200px]">Your realized capital gains for the current tax year</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-300">Short-Term</span>
                <span>${realizedGains.shortTerm.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Long-Term</span>
                <span>${realizedGains.longTerm.toFixed(2)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#0D1428] text-white border-none">
          <CardContent className="pt-6">
            <div className="flex flex-col">
              <h3 className="text-xl font-semibold mb-2">Set a Tax Budget</h3>
              <p className="text-gray-300 mb-6">Limit your capital gains taxes each year</p>
              <div className="flex justify-end">
                <Button onClick={handleNewBudget} variant="outline" className="bg-transparent text-white border-white hover:bg-white/10">
                  New Tax Budget
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#0D1428] text-white border-none">
          <CardContent className="pt-6">
            <div className="flex flex-col">
              <h3 className="text-xl font-semibold mb-2">Test Hypothetical Scenarios</h3>
              <p className="text-gray-300 mb-6">Test different tax budgets and target model portfolios</p>
              <div className="flex justify-end">
                <Button onClick={handleNewScenario} variant="outline" className="bg-transparent text-white border-white hover:bg-white/10">
                  New Hypothetical Scenario
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      */}
    </ThreeColumnLayout>
  );
};

export default TaxBudgets;
