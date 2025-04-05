
import React from "react";
import { Card } from "@/components/ui/card";
import { ArrowRight, BarChart, PiggyBank, Briefcase, LineChart, TrendingUp, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScheduleMeetingButton } from "./ScheduleMeetingButton";

export const SecuritiesBasedLoansContent = () => {
  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold mb-2">Securities-Based Loans</h1>
        <p className="text-muted-foreground">
          Using your investment portfolio as collateral for a line of credit.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-xl font-medium mb-3">How It Works</h3>
              <p className="text-muted-foreground mb-4">
                Securities-based loans allow you to borrow against the value of your investment 
                portfolio without selling your investments. This can provide liquidity while 
                maintaining your market position.
              </p>
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-50 p-2 rounded-full">
                    <BarChart className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium">Maintain Market Exposure</p>
                    <p className="text-sm text-muted-foreground">Keep your investments working for you</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-green-50 p-2 rounded-full">
                    <PiggyBank className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium">Competitive Rates</p>
                    <p className="text-sm text-muted-foreground">Often lower than traditional loans</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-purple-50 p-2 rounded-full">
                    <LineChart className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-medium">Flexible Repayment</p>
                    <p className="text-sm text-muted-foreground">Pay interest only or principal + interest</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-xl font-medium mb-3">Use Cases</h3>
              <p className="text-muted-foreground mb-4">
                Securities-based loans offer liquidity for various needs without disrupting your investment strategy.
              </p>
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <div className="bg-amber-50 p-2 rounded-full">
                    <Briefcase className="h-5 w-5 text-amber-600" />
                  </div>
                  <div>
                    <p className="font-medium">Bridge Financing</p>
                    <p className="text-sm text-muted-foreground">Short-term needs with timing flexibility</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-blue-50 p-2 rounded-full">
                    <TrendingUp className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium">Investment Opportunities</p>
                    <p className="text-sm text-muted-foreground">Leverage your portfolio for new investments</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-green-50 p-2 rounded-full">
                    <Home className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium">Real Estate Purchases</p>
                    <p className="text-sm text-muted-foreground">Down payments or full purchases</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
      
      <Card className="p-6">
        <h3 className="text-xl font-medium mb-4">Ready to Get Started?</h3>
        <p className="text-muted-foreground mb-6">
          Speak with your advisor to discuss whether a securities-based loan is right for your 
          financial situation and learn about specific options available to you.
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <ScheduleMeetingButton offeringName="Securities-Based Loans" />
          <Button variant="outline">Learn More <ArrowRight className="ml-2 h-4 w-4" /></Button>
        </div>
      </Card>
    </div>
  );
};
