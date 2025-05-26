
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const RealAssets = () => {
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
      
      <h1 className="text-3xl font-bold mb-8">Real Assets</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Real Asset Investments</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              Access exclusive real asset investment opportunities including real estate, infrastructure, and natural resources.
            </p>
            <p className="mb-6">
              Real assets provide portfolio diversification and potential inflation protection through 
              investments in tangible assets with intrinsic value.
            </p>
            
            <Button onClick={() => navigate("/investments?tab=private-market")}>
              View All Private Market Offerings
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Real Assets Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              Our real asset investments provide both income potential and capital appreciation.
            </p>
            <ul className="list-disc list-inside space-y-2 mb-6">
              <li>Average income yield: 4-7%</li>
              <li>Total return potential: 8-12%</li>
              <li>Low correlation to traditional markets</li>
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

export default RealAssets;
