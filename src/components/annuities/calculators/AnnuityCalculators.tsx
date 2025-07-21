import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calculator, TrendingUp, Shield, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { IncomeCalculator } from "./IncomeCalculator";
import { WithdrawalCalculator } from "./WithdrawalCalculator";
import { DeathBenefitCalculator } from "./DeathBenefitCalculator";

export const AnnuityCalculators = () => {
  const [activeTab, setActiveTab] = useState("income");

  const calculatorTabs = [
    {
      id: "income",
      label: "Income Calculator",
      icon: TrendingUp,
      description: "Calculate guaranteed lifetime income projections"
    },
    {
      id: "withdrawal",
      label: "Withdrawal Calculator", 
      icon: Calculator,
      description: "Plan systematic withdrawal strategies"
    },
    {
      id: "death-benefit",
      label: "Death Benefit Calculator",
      icon: Shield,
      description: "Estimate legacy protection benefits"
    }
  ];

  const handleShareResults = () => {
    // Implementation for sharing calculator results
    console.log("Sharing calculator results...");
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold mb-2">Annuity Calculators</h2>
          <p className="text-muted-foreground">
            Interactive tools to help you understand potential outcomes and make informed decisions.
          </p>
        </div>
        <Button variant="outline" onClick={handleShareResults} className="flex items-center gap-2">
          <Share2 className="h-4 w-4" />
          Share Results
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
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
                <span className="hidden sm:inline">{tab.label}</span>
                <span className="sm:hidden">{tab.label.split(' ')[0]}</span>
              </TabsTrigger>
            );
          })}
        </TabsList>

        <div className="grid gap-4">
          {calculatorTabs.map((tab) => (
            <Card key={tab.id} className={`transition-all ${activeTab === tab.id ? 'ring-2 ring-primary' : ''}`}>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <tab.icon className="h-5 w-5 text-primary" />
                  <CardTitle>{tab.label}</CardTitle>
                </div>
                <CardDescription>{tab.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>

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

      <Card className="bg-gradient-to-r from-primary/5 to-secondary/5 border-primary/20">
        <CardContent className="pt-6">
          <div className="text-center space-y-3">
            <h3 className="font-semibold text-lg">Need Professional Guidance?</h3>
            <p className="text-muted-foreground">
              These calculators provide estimates. For personalized advice and fiduciary review, 
              connect with a qualified advisor.
            </p>
            <Button variant="outline" className="mt-4">
              Schedule Fiduciary Review
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};