
import React from "react";
import { Card } from "@/components/ui/card";
import { ArrowRight, TrendingUp, DollarSign, BarChart4, LineChart, Wallet, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScheduleMeetingButton } from "./ScheduleMeetingButton";

export const SecuritiesBasedLoansContent = () => {
  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold mb-2">Securities-Based Lending</h1>
        <p className="text-muted-foreground">
          Use your investment portfolio as collateral for flexible financing.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-xl font-medium mb-3">How It Works</h3>
              <p className="text-muted-foreground mb-4">
                Securities-based loans allow you to borrow against the value of eligible securities in your
                investment portfolio without selling your assets. This provides liquidity while keeping your
                investment strategy intact.
              </p>
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-50 p-2 rounded-full">
                    <TrendingUp className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium">Maintain Market Exposure</p>
                    <p className="text-sm text-muted-foreground">Keep your investments working for you</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-green-50 p-2 rounded-full">
                    <DollarSign className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium">Competitive Rates</p>
                    <p className="text-sm text-muted-foreground">Typically lower than unsecured loans</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-purple-50 p-2 rounded-full">
                    <Clock className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-medium">Quick Access to Funds</p>
                    <p className="text-sm text-muted-foreground">Faster than traditional loans</p>
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
                Securities-based loans can be used for various purposes except purchasing or trading securities.
              </p>
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <div className="bg-amber-50 p-2 rounded-full">
                    <Wallet className="h-5 w-5 text-amber-600" />
                  </div>
                  <div>
                    <p className="font-medium">Major Purchases</p>
                    <p className="text-sm text-muted-foreground">Luxury items, real estate, etc.</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-blue-50 p-2 rounded-full">
                    <BarChart4 className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium">Business Investments</p>
                    <p className="text-sm text-muted-foreground">Capital for business opportunities</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-green-50 p-2 rounded-full">
                    <LineChart className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium">Liquidity Bridge</p>
                    <p className="text-sm text-muted-foreground">Short-term funds for opportunities</p>
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
          Speak with your advisor to learn more about securities-based lending options 
          available to you and how they can support your financial goals.
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <ScheduleMeetingButton offeringName="Securities-Based Lending" />
          <Button variant="outline">Learn More <ArrowRight className="ml-2 h-4 w-4" /></Button>
        </div>
      </Card>
    </div>
  );
};
