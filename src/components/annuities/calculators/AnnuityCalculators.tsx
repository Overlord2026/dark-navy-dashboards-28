import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Share2, Calculator, DollarSign, TrendingDown, Shield } from "lucide-react";
import { IncomeCalculator } from "./IncomeCalculator";
import { WithdrawalCalculator } from "./WithdrawalCalculator";
import { DeathBenefitCalculator } from "./DeathBenefitCalculator";

export const AnnuityCalculators = () => {
  const [activeCalculator, setActiveCalculator] = useState("income");

  const calculatorTabs = [
    {
      id: "income",
      label: "Income",
      icon: DollarSign,
      description: "Calculate guaranteed income potential"
    },
    {
      id: "withdrawal",
      label: "Withdrawal",
      icon: TrendingDown,
      description: "Optimize withdrawal strategies"
    },
    {
      id: "death-benefit",
      label: "Death Benefit",
      icon: Shield,
      description: "Estimate beneficiary payouts"
    }
  ];

  const handleShareResults = () => {
    // Implement share functionality
    console.log("Sharing calculator results...");
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Annuity Calculators</h1>
          <p className="text-muted-foreground">
            Calculate income potential, withdrawal strategies, and death benefits with our comprehensive tools
          </p>
        </div>
        <Button variant="outline" onClick={handleShareResults} className="flex items-center gap-2">
          <Share2 className="h-4 w-4" />
          Share Results
        </Button>
      </div>

      <Tabs value={activeCalculator} onValueChange={setActiveCalculator} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          {calculatorTabs.map((tab) => {
            const IconComponent = tab.icon;
            return (
              <TabsTrigger 
                key={tab.id} 
                value={tab.id}
                className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <IconComponent className="h-4 w-4" />
                <div className="text-center">
                  <div className="font-medium">{tab.label}</div>
                  <div className="text-xs opacity-70 hidden sm:block">{tab.description}</div>
                </div>
              </TabsTrigger>
            );
          })}
        </TabsList>

        <TabsContent value="income" className="space-y-6">
          <IncomeCalculator />
        </TabsContent>

        <TabsContent value="withdrawal" className="space-y-6">
          <WithdrawalCalculator />
        </TabsContent>

        <TabsContent value="death-benefit" className="space-y-6">
          <DeathBenefitCalculator />
        </TabsContent>
      </Tabs>

      {/* Professional Guidance Card */}
      <Card className="bg-gradient-to-r from-primary/5 via-background to-secondary/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Need Professional Guidance?
          </CardTitle>
          <CardDescription>
            These calculators provide estimates. For personalized advice, consider a fiduciary review.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button>
            Schedule Fiduciary Review
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};