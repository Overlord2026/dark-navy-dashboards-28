
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const PrivateDebt = () => {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Private Debt Investments</h1>
      
      <div className="grid grid-cols-1 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Private Debt Opportunities</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              Access exclusive private debt investments across various sectors and risk profiles.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PrivateDebt;
