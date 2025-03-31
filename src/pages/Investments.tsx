
import React from "react";
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";

const Investments = () => {
  return (
    <ThreeColumnLayout title="Investment Management" activeMainItem="investments">
      <div className="space-y-6 px-4 py-6 max-w-7xl mx-auto">
        <div className="bg-card rounded-lg border border-border p-6">
          <h2 className="text-2xl font-semibold mb-4">Investment Portfolio</h2>
          <p className="text-muted-foreground mb-6">
            Manage your investment portfolio and track performance across all asset classes.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-muted p-4 rounded-md">
              <h3 className="font-medium mb-2">Equities</h3>
              <p className="text-sm text-muted-foreground">View and manage your stock investments</p>
            </div>
            <div className="bg-muted p-4 rounded-md">
              <h3 className="font-medium mb-2">Fixed Income</h3>
              <p className="text-sm text-muted-foreground">Bonds and other fixed income securities</p>
            </div>
            <div className="bg-muted p-4 rounded-md">
              <h3 className="font-medium mb-2">Alternative Investments</h3>
              <p className="text-sm text-muted-foreground">Private equity, hedge funds, and other alternatives</p>
            </div>
          </div>
        </div>
        
        <div className="bg-card rounded-lg border border-border p-6">
          <h2 className="text-2xl font-semibold mb-4">Performance Dashboard</h2>
          <p className="text-muted-foreground">
            Your investment performance dashboard is being prepared. Check back soon for detailed analytics.
          </p>
        </div>
      </div>
    </ThreeColumnLayout>
  );
};

export default Investments;
