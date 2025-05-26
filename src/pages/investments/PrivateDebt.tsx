
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const PrivateDebt = () => {
  const navigate = useNavigate();
  
  return (
    <div className="container mx-auto py-8">
      <div className="mb-6">
        <Button 
          variant="ghost" 
          onClick={() => navigate("/investments")}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Investments
        </Button>
      </div>
      
      <h1 className="text-3xl font-bold mb-8">Private Debt Investments</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Private Debt Opportunities</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              Access exclusive private debt investments across various sectors and risk profiles.
            </p>
            <p className="mb-6">
              Our private debt offerings provide steady income potential with lower volatility 
              compared to traditional equity investments.
            </p>
            
            <Button onClick={() => navigate("/investments?tab=private-market")}>
              View All Private Market Offerings
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Private Debt Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              Our private debt investments focus on capital preservation while delivering consistent income.
            </p>
            <ul className="list-disc list-inside space-y-2 mb-6">
              <li>Average yield: 7.5-9.5%</li>
              <li>Typical credit quality: Senior secured</li>
              <li>Average duration: 3-5 years</li>
            </ul>
            <Button variant="outline" onClick={() => navigate("/investments")}>
              Explore Investment Options
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PrivateDebt;
