
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const DigitalAssets = () => {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Digital Assets</h1>
      
      <div className="grid grid-cols-1 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Digital Asset Investments</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              Explore curated digital asset investment opportunities with institutional-grade security and expertise.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DigitalAssets;
