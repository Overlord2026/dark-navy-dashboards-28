
import React from "react";
import { Card } from "@/components/ui/card";
import { ArrowRight, Building, BarChart4, CreditCard, PiggyBank, LineChart, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScheduleMeetingButton } from "./ScheduleMeetingButton";

export const CommercialLoansContent = () => {
  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold mb-2">Commercial Loans</h1>
        <p className="text-muted-foreground">
          Financing for business expenses and growth opportunities.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-xl font-medium mb-3">How It Works</h3>
              <p className="text-muted-foreground mb-4">
                Commercial loans provide businesses with capital for expansion, equipment, 
                working capital, or real estate purchases. These loans are typically structured 
                based on your business needs and repayment capacity.
              </p>
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-50 p-2 rounded-full">
                    <Building className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium">Business Growth</p>
                    <p className="text-sm text-muted-foreground">Fuel expansion and scaling operations</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-green-50 p-2 rounded-full">
                    <CreditCard className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium">Flexible Terms</p>
                    <p className="text-sm text-muted-foreground">Tailored to business cash flow</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-purple-50 p-2 rounded-full">
                    <BarChart4 className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-medium">Strategic Financing</p>
                    <p className="text-sm text-muted-foreground">Optimize your capital structure</p>
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
                Commercial loans can be used in various scenarios to help businesses meet their financial needs.
              </p>
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <div className="bg-amber-50 p-2 rounded-full">
                    <Building className="h-5 w-5 text-amber-600" />
                  </div>
                  <div>
                    <p className="font-medium">Real Estate Acquisition</p>
                    <p className="text-sm text-muted-foreground">Purchase or develop commercial property</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-blue-50 p-2 rounded-full">
                    <TrendingUp className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium">Equipment Financing</p>
                    <p className="text-sm text-muted-foreground">Upgrade machinery and technology</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-green-50 p-2 rounded-full">
                    <LineChart className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium">Working Capital</p>
                    <p className="text-sm text-muted-foreground">Manage cash flow and operations</p>
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
          Speak with your advisor to discuss how commercial loans can support your business 
          goals and learn about specific options available to you.
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <ScheduleMeetingButton offeringName="Commercial Loans" />
          <Button variant="outline">Learn More <ArrowRight className="ml-2 h-4 w-4" /></Button>
        </div>
      </Card>
    </div>
  );
};
