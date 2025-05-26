
import React from "react";
import { Card } from "@/components/ui/card";
import { CreditCard, Clock, Shield, CheckCircle } from "lucide-react";
import { ScheduleMeetingButton } from "./ScheduleMeetingButton";
import { InterestedButton } from "@/components/investments/InterestedButton";

export const PersonalLoansContent = () => {
  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold mb-2">Personal Loans</h1>
        <p className="text-muted-foreground">
          Unsecured loans for personal expenses with flexible terms.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-xl font-medium mb-3">How It Works</h3>
              <p className="text-muted-foreground mb-4">
                Personal loans provide unsecured financing for various personal needs 
                without requiring collateral. These loans typically offer fixed rates 
                and predictable monthly payments over the loan term.
              </p>
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-50 p-2 rounded-full">
                    <CreditCard className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium">No Collateral Required</p>
                    <p className="text-sm text-muted-foreground">Unsecured financing based on creditworthiness</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-green-50 p-2 rounded-full">
                    <Clock className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium">Quick Processing</p>
                    <p className="text-sm text-muted-foreground">Fast approval and funding process</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-purple-50 p-2 rounded-full">
                    <Shield className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-medium">Fixed Terms</p>
                    <p className="text-sm text-muted-foreground">Predictable monthly payments</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-xl font-medium mb-3">Common Uses</h3>
              <p className="text-muted-foreground mb-4">
                Personal loans can be used for a variety of purposes, from debt 
                consolidation to major purchases and unexpected expenses.
              </p>
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <div className="bg-amber-50 p-2 rounded-full">
                    <CheckCircle className="h-5 w-5 text-amber-600" />
                  </div>
                  <div>
                    <p className="font-medium">Debt Consolidation</p>
                    <p className="text-sm text-muted-foreground">Combine multiple debts into one payment</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-blue-50 p-2 rounded-full">
                    <CreditCard className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium">Major Purchases</p>
                    <p className="text-sm text-muted-foreground">Home improvements, vacations, or large expenses</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-green-50 p-2 rounded-full">
                    <Shield className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium">Emergency Expenses</p>
                    <p className="text-sm text-muted-foreground">Unexpected costs and financial emergencies</p>
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
          Speak with your advisor to explore personal loan options and find the 
          best terms for your specific financial needs and situation.
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <InterestedButton assetName="Personal Loans" />
          <ScheduleMeetingButton offeringName="Personal Loans" />
        </div>
      </Card>
    </div>
  );
};
