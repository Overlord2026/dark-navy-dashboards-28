
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const StockScreener = () => {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Stock Screener</h1>
      
      <div className="grid grid-cols-1 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Advanced Stock Screening Tools</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              Use our powerful stock screening tools to filter and analyze potential investments based on your criteria.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StockScreener;
