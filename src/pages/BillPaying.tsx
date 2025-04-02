
import React from "react";
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";

export default function BillPaying() {
  return (
    <ThreeColumnLayout title="Bill Paying" activeMainItem="banking">
      <div className="space-y-6 px-4 py-6 max-w-7xl mx-auto">
        <div className="p-6 bg-card rounded-lg border border-border">
          <h2 className="text-2xl font-semibold mb-4">Bill Paying Service</h2>
          <p className="text-muted-foreground mb-6">
            Manage, schedule, and track all your bill payments in one place. Our bill paying service helps you stay organized and never miss a payment.
          </p>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <div className="bg-background p-4 rounded-md border border-border">
              <h3 className="font-medium mb-2">Upcoming Bills</h3>
              <p className="text-sm text-muted-foreground">No upcoming bills available.</p>
            </div>
            
            <div className="bg-background p-4 rounded-md border border-border">
              <h3 className="font-medium mb-2">Payment History</h3>
              <p className="text-sm text-muted-foreground">No payment history available.</p>
            </div>
            
            <div className="bg-background p-4 rounded-md border border-border">
              <h3 className="font-medium mb-2">Bill Payment Settings</h3>
              <p className="text-sm text-muted-foreground">Configure your bill payment preferences.</p>
            </div>
          </div>
        </div>
      </div>
    </ThreeColumnLayout>
  );
}
