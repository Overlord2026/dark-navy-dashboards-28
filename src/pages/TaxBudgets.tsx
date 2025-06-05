
import React from "react";
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Clock } from "lucide-react";

const TaxBudgets = () => {
  return (
    <ThreeColumnLayout title="Tax Budgets" activeMainItem="tax-budgets">
      <div className="flex items-center justify-center min-h-[80vh] px-4 py-6">
        <Card className="max-w-md w-full bg-[#0D1426] border border-blue-900">
          <CardContent className="flex flex-col items-center justify-center text-center py-12">
            <Clock className="h-16 w-16 text-blue-400 mb-6" />
            <h2 className="text-2xl font-bold mb-2 text-blue-300">Coming Soon</h2>
            <p className="text-blue-200/80">
              Tax Budgets functionality is currently under development and will be available soon.
            </p>
          </CardContent>
        </Card>
      </div>
    </ThreeColumnLayout>
  );
};

export default TaxBudgets;
