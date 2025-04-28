
import React from "react";
import { Card } from "@/components/ui/card";
import { ArrowRight, CreditCard, DollarSign, CalendarClock, Shield, WalletCards, PiggyBank } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScheduleMeetingButton } from "./ScheduleMeetingButton";

export const PersonalLoansContent = () => {
  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold mb-2">Personal Loans</h1>
        <p className="text-muted-foreground">
          Flexible financing for personal needs and major expenses.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-xl font-medium mb-3">How It Works</h3>
              <p className="text-muted-foreground mb-4">
                Personal loans provide a lump-sum amount that you repay over a fixed term with 
                regular monthly payments. These unsecured loans can be used for various personal 
                expenses and don't require collateral.
              </p>
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-50 p-2 rounded-full">
                    <CreditCard className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium">Fixed Amounts</p>
                    <p className="text-sm text-muted-foreground">Borrow what you need upfront</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-green-50 p-2 rounded-full">
                    <CalendarClock className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium">Set Repayment Terms</p>
                    <p className="text-sm text-muted-foreground">Predictable monthly payments</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-purple-50 p-2 rounded-full">
                    <Shield className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-medium">No Collateral Required</p>
                    <p className="text-sm text-muted-foreground">Typically unsecured financing</p>
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
                Personal loans can be used for various purposes to meet your financial needs.
              </p>
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <div className="bg-amber-50 p-2 rounded-full">
                    <WalletCards className="h-5 w-5 text-amber-600" />
                  </div>
                  <div>
                    <p className="font-medium">Debt Consolidation</p>
                    <p className="text-sm text-muted-foreground">Simplify multiple debts into one payment</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-blue-50 p-2 rounded-full">
                    <PiggyBank className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium">Major Expenses</p>
                    <p className="text-sm text-muted-foreground">Home improvements, weddings, etc.</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-green-50 p-2 rounded-full">
                    <DollarSign className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium">Unexpected Costs</p>
                    <p className="text-sm text-muted-foreground">Medical bills or emergency expenses</p>
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
          financial needs and goals.
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <ScheduleMeetingButton offeringName="Personal Loans" />
          <Button variant="outline">Learn More <ArrowRight className="ml-2 h-4 w-4" /></Button>
        </div>
      </Card>
    </div>
  );
};
