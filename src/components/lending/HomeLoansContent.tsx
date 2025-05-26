
import React from "react";
import { Card } from "@/components/ui/card";
import { Home, Shield, Calculator, Clock } from "lucide-react";
import { ScheduleMeetingButton } from "./ScheduleMeetingButton";
import { InterestedButton } from "@/components/investments/InterestedButton";

export const HomeLoansContent = () => {
  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold mb-2">Home Loans</h1>
        <p className="text-muted-foreground">
          Mortgages for buying a home with competitive rates and flexible terms.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-xl font-medium mb-3">How It Works</h3>
              <p className="text-muted-foreground mb-4">
                Home loans provide financing to purchase or refinance residential properties. 
                We work with multiple lenders to find competitive rates and terms that fit 
                your financial situation and homeownership goals.
              </p>
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-50 p-2 rounded-full">
                    <Home className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium">Primary & Secondary Homes</p>
                    <p className="text-sm text-muted-foreground">Financing for all types of residential properties</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-green-50 p-2 rounded-full">
                    <Shield className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium">Competitive Rates</p>
                    <p className="text-sm text-muted-foreground">Access to institutional pricing and terms</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-purple-50 p-2 rounded-full">
                    <Calculator className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-medium">Flexible Terms</p>
                    <p className="text-sm text-muted-foreground">Various loan structures to meet your needs</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-xl font-medium mb-3">Loan Options</h3>
              <p className="text-muted-foreground mb-4">
                Various mortgage products available to suit different financial situations and property types.
              </p>
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <div className="bg-amber-50 p-2 rounded-full">
                    <Home className="h-5 w-5 text-amber-600" />
                  </div>
                  <div>
                    <p className="font-medium">Conventional Mortgages</p>
                    <p className="text-sm text-muted-foreground">Traditional fixed and adjustable rate loans</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-blue-50 p-2 rounded-full">
                    <Shield className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium">Jumbo Loans</p>
                    <p className="text-sm text-muted-foreground">For higher-priced properties above conforming limits</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-green-50 p-2 rounded-full">
                    <Clock className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium">Bridge Loans</p>
                    <p className="text-sm text-muted-foreground">Short-term financing for property transitions</p>
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
          Connect with your advisor to explore home loan options and find the best 
          financing solution for your property purchase or refinancing needs.
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <InterestedButton assetName="Home Loans" />
          <ScheduleMeetingButton offeringName="Home Loans" />
        </div>
      </Card>
    </div>
  );
};
