
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const PrivateEquity = () => {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Private Equity Investments</h1>
      
      <div className="grid grid-cols-1 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Private Equity Opportunities</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              Explore exclusive private equity investment opportunities across various sectors and stages.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PrivateEquity;
