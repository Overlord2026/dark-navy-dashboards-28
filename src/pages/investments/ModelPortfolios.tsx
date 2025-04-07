
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const ModelPortfolios = () => {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Model Portfolios</h1>
        <Button onClick={() => navigate('/investments/models/all')}>View All Portfolios</Button>
      </div>
      
      <div className="grid grid-cols-1 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Strategic Investment Portfolios</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              Explore professionally designed model portfolios tailored to different risk profiles and investment objectives.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mt-6">
              <Button onClick={() => navigate('/investments/models/all')} className="flex-1">
                Browse Portfolios
              </Button>
              <Button variant="outline" onClick={() => navigate('/investments/builder')} className="flex-1">
                Create Custom Portfolio
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ModelPortfolios;
