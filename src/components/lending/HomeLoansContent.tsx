
import React from "react";
import { Card } from "@/components/ui/card";
import { ArrowRight, Home, Calculator, Clock, Building2, Key, Landmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScheduleMeetingButton } from "./ScheduleMeetingButton";

export const HomeLoansContent = () => {
  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold mb-2">Home Loans</h1>
        <p className="text-muted-foreground">
          Mortgages and financing solutions for residential real estate.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-xl font-medium mb-3">How It Works</h3>
              <p className="text-muted-foreground mb-4">
                Home loans provide financing for purchasing or refinancing residential properties. 
                Loan options vary based on your financial situation, property type, and long-term goals.
              </p>
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-50 p-2 rounded-full">
                    <Home className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium">Property Acquisition</p>
                    <p className="text-sm text-muted-foreground">Financing for your dream home</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-green-50 p-2 rounded-full">
                    <Calculator className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium">Flexible Terms</p>
                    <p className="text-sm text-muted-foreground">Fixed and adjustable rate options</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-purple-50 p-2 rounded-full">
                    <Clock className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-medium">Long-Term Financing</p>
                    <p className="text-sm text-muted-foreground">15, 20, or 30-year terms available</p>
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
                Home loans serve various residential real estate financing needs.
              </p>
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <div className="bg-amber-50 p-2 rounded-full">
                    <Key className="h-5 w-5 text-amber-600" />
                  </div>
                  <div>
                    <p className="font-medium">First-Time Homebuyers</p>
                    <p className="text-sm text-muted-foreground">Special programs and assistance</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-blue-50 p-2 rounded-full">
                    <Building2 className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium">Property Upgrades</p>
                    <p className="text-sm text-muted-foreground">Refinancing for home improvements</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-green-50 p-2 rounded-full">
                    <Landmark className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium">Vacation Properties</p>
                    <p className="text-sm text-muted-foreground">Second home and investment financing</p>
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
          Speak with your advisor to explore home loan options tailored to your 
          financial situation and property goals.
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <ScheduleMeetingButton offeringName="Home Loans" />
          <Button variant="outline">Learn More <ArrowRight className="ml-2 h-4 w-4" /></Button>
        </div>
      </Card>
    </div>
  );
};
