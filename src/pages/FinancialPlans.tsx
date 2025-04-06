
import React from "react";
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";

export default function FinancialPlans() {
  return (
    <ThreeColumnLayout title="Financial Plans">
      <div className="space-y-4 p-6 max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold">Financial Plans</h1>
        <div className="bg-card rounded-lg shadow-sm p-6 border">
          <p className="text-lg">
            Welcome to your Financial Plans dashboard. Here you can create and manage your financial plans.
          </p>
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-background rounded-md border p-4">
              <h3 className="font-semibold mb-2">Retirement Plan</h3>
              <p className="text-sm text-muted-foreground">
                Plan for a comfortable retirement with our comprehensive tools.
              </p>
            </div>
            <div className="bg-background rounded-md border p-4">
              <h3 className="font-semibold mb-2">College Savings</h3>
              <p className="text-sm text-muted-foreground">
                Save for your children's education with structured planning.
              </p>
            </div>
            <div className="bg-background rounded-md border p-4">
              <h3 className="font-semibold mb-2">Home Purchase</h3>
              <p className="text-sm text-muted-foreground">
                Plan for buying your dream home with our mortgage calculators.
              </p>
            </div>
            <div className="bg-background rounded-md border p-4">
              <h3 className="font-semibold mb-2">Emergency Fund</h3>
              <p className="text-sm text-muted-foreground">
                Build a safety net for unexpected expenses and emergencies.
              </p>
            </div>
          </div>
        </div>
      </div>
    </ThreeColumnLayout>
  );
}
