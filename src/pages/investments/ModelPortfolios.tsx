
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const ModelPortfolios = () => {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Model Portfolios</h1>
      
      <div className="grid grid-cols-1 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Strategic Investment Portfolios</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              Explore professionally designed model portfolios tailored to different risk profiles and investment objectives.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ModelPortfolios;
