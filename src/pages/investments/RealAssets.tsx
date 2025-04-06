
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const RealAssets = () => {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Real Assets</h1>
      
      <div className="grid grid-cols-1 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Real Asset Investments</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              Access exclusive real asset investment opportunities including real estate, infrastructure, and natural resources.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RealAssets;
