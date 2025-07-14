import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calculator } from "lucide-react";

export default function HSACalculator() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">HSA Savings Calculator</h1>
        <p className="text-muted-foreground">
          Calculate potential savings and tax benefits from your HSA contributions
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            HSA Savings Calculator
          </CardTitle>
          <CardDescription>
            Plan your HSA contributions and see potential tax savings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Calculator className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-4">HSA calculator coming soon</p>
            <p className="text-sm text-muted-foreground">
              Calculate tax savings, contribution limits, and long-term growth projections
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}