
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const DigitalAssets = () => {
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
      
      <h1 className="text-3xl font-bold mb-8">Digital Assets</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Digital Asset Investments</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              Explore curated digital asset investment opportunities with institutional-grade security and expertise.
            </p>
            <p className="mb-6">
              Our digital asset offerings provide exposure to blockchain technology, cryptocurrencies, 
              and next-generation digital infrastructure with professional management.
            </p>
            
            <Button onClick={() => navigate("/investments?tab=private-market")}>
              View All Private Market Offerings
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Digital Assets Approach</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              Our approach to digital assets focuses on quality protocols with strong fundamentals.
            </p>
            <ul className="list-disc list-inside space-y-2 mb-6">
              <li>Professional risk management</li>
              <li>Institutional-grade custody solutions</li>
              <li>Focus on blue-chip cryptocurrencies and protocols</li>
              <li>Strategic allocation within broader portfolio</li>
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

export default DigitalAssets;
