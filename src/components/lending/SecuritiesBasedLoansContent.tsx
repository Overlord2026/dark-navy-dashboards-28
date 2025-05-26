
import React from "react";
import { Card } from "@/components/ui/card";
import { BarChart, DollarSign, Shield, TrendingUp } from "lucide-react";
import { ScheduleMeetingButton } from "./ScheduleMeetingButton";
import { InterestedButton } from "@/components/investments/InterestedButton";

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
                Securities-based loans allow you to borrow against your eligible investment 
                portfolio without selling your holdings. This provides liquidity while 
                maintaining your investment strategy and potential for market growth.
              </p>
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-50 p-2 rounded-full">
                    <BarChart className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium">Portfolio Collateral</p>
                    <p className="text-sm text-muted-foreground">Use eligible securities as loan collateral</p>
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
                    <Shield className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-medium">No Asset Sales</p>
                    <p className="text-sm text-muted-foreground">Maintain your investment positions</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-xl font-medium mb-3">Benefits</h3>
              <p className="text-muted-foreground mb-4">
                Securities-based lending offers unique advantages for investors who need 
                liquidity but want to preserve their long-term investment strategy.
              </p>
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <div className="bg-amber-50 p-2 rounded-full">
                    <TrendingUp className="h-5 w-5 text-amber-600" />
                  </div>
                  <div>
                    <p className="font-medium">Market Participation</p>
                    <p className="text-sm text-muted-foreground">Continue to benefit from portfolio growth</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-blue-50 p-2 rounded-full">
                    <DollarSign className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium">Flexible Access</p>
                    <p className="text-sm text-muted-foreground">Draw funds as needed up to your limit</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-green-50 p-2 rounded-full">
                    <Shield className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium">Tax Efficiency</p>
                    <p className="text-sm text-muted-foreground">Avoid potential capital gains from sales</p>
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
          Speak with your advisor to explore securities-based lending options and 
          determine how much liquidity your portfolio can provide.
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <InterestedButton assetName="Securities-Based Loans" />
          <ScheduleMeetingButton offeringName="Securities-Based Loans" />
        </div>
      </Card>
    </div>
  );
};
