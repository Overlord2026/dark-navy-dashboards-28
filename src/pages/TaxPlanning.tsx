
import React from "react";
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";

const TaxPlanning = () => {
  return (
    <ThreeColumnLayout 
      title="Tax Planning" 
      activeMainItem="tax-planning"
    >
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Tax Planning Strategies</h2>
        <p className="text-muted-foreground">
          Explore tax planning strategies to optimize your financial situation and reduce tax liability.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div className="border rounded-lg p-6 bg-card">
            <h3 className="text-xl font-semibold mb-4">Tax Loss Harvesting</h3>
            <p>Learn how to offset capital gains with capital losses to reduce your tax burden.</p>
          </div>
          
          <div className="border rounded-lg p-6 bg-card">
            <h3 className="text-xl font-semibold mb-4">Retirement Account Optimization</h3>
            <p>Strategies for maximizing tax advantages of retirement accounts like 401(k)s and IRAs.</p>
          </div>
          
          <div className="border rounded-lg p-6 bg-card">
            <h3 className="text-xl font-semibold mb-4">Estate Tax Planning</h3>
            <p>Techniques to minimize estate taxes and maximize wealth transfer to heirs.</p>
          </div>
          
          <div className="border rounded-lg p-6 bg-card">
            <h3 className="text-xl font-semibold mb-4">Charitable Giving Strategies</h3>
            <p>How to structure charitable donations for maximum tax benefits.</p>
          </div>
        </div>
      </div>
    </ThreeColumnLayout>
  );
};

export default TaxPlanning;
