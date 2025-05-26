
import React from "react";
import { Card } from "@/components/ui/card";
import { ArrowRight, CreditCard, Gem, BadgeCheck, Car, GraduationCap, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScheduleMeetingButton } from "./ScheduleMeetingButton";

export const PersonalLoansContent = () => {
  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold mb-2">Personal Loans</h1>
        <p className="text-muted-foreground">
          Unsecured loans for personal expenses and life goals.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-xl font-medium mb-3">How It Works</h3>
              <p className="text-muted-foreground mb-4">
                Personal loans provide flexible financing for a variety of needs without requiring 
                collateral. Loan approval is based on your creditworthiness, income, and other financial factors.
              </p>
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-50 p-2 rounded-full">
                    <CreditCard className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium">Fixed Payments</p>
                    <p className="text-sm text-muted-foreground">Predictable monthly installments</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-green-50 p-2 rounded-full">
                    <Gem className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium">Competitive Rates</p>
                    <p className="text-sm text-muted-foreground">Based on your financial profile</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-purple-50 p-2 rounded-full">
                    <BadgeCheck className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-medium">Quick Approvals</p>
                    <p className="text-sm text-muted-foreground">Fast decision and funding process</p>
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
                Personal loans can be used to fund a variety of life events and financial needs.
              </p>
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <div className="bg-amber-50 p-2 rounded-full">
                    <Home className="h-5 w-5 text-amber-600" />
                  </div>
                  <div>
                    <p className="font-medium">Home Improvements</p>
                    <p className="text-sm text-muted-foreground">Renovations and upgrades</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-blue-50 p-2 rounded-full">
                    <GraduationCap className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium">Education Expenses</p>
                    <p className="text-sm text-muted-foreground">Tuition and educational costs</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-green-50 p-2 rounded-full">
                    <Car className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium">Vehicle Purchases</p>
                    <p className="text-sm text-muted-foreground">New or used auto financing</p>
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
          Speak with your advisor to explore personal loan options tailored to your 
          financial situation and goals.
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <ScheduleMeetingButton offeringName="Personal Loans" />
          <Button variant="outline">Learn More <ArrowRight className="ml-2 h-4 w-4" /></Button>
        </div>
      </Card>
    </div>
  );
};
