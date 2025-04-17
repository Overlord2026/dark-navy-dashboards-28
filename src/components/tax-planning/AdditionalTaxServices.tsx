
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Calendar, BarChart, Building, ArrowRight } from "lucide-react";

export const AdditionalTaxServices: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <BookOpen className="mr-2 h-5 w-5 text-primary" />
          Additional Tax Planning Services
        </CardTitle>
        <CardDescription>
          Specialized tax planning services to optimize your financial strategy
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 md:grid-cols-3">
          <div className="border rounded-lg p-4">
            <h4 className="font-medium flex items-center">
              <Calendar className="h-4 w-4 mr-2 text-primary" />
              Annual Tax Updates
            </h4>
            <p className="text-sm text-muted-foreground mt-2">
              Stay informed about tax law changes and receive personalized annual tax planning recommendations.
            </p>
            <Button variant="link" className="p-0 h-auto mt-3 text-primary text-sm">
              Learn More <ArrowRight className="h-3 w-3 ml-1" />
            </Button>
          </div>
          
          <div className="border rounded-lg p-4">
            <h4 className="font-medium flex items-center">
              <BarChart className="h-4 w-4 mr-2 text-primary" />
              Multi-Year Projection
            </h4>
            <p className="text-sm text-muted-foreground mt-2">
              Long-term tax planning with multi-year projections to optimize your tax situation over time.
            </p>
            <Button variant="link" className="p-0 h-auto mt-3 text-primary text-sm">
              Learn More <ArrowRight className="h-3 w-3 ml-1" />
            </Button>
          </div>
          
          <div className="border rounded-lg p-4">
            <h4 className="font-medium flex items-center">
              <Building className="h-4 w-4 mr-2 text-primary" />
              State Residency Planning
            </h4>
            <p className="text-sm text-muted-foreground mt-2">
              Strategic planning for state tax optimization, including residency changes and domicile considerations.
            </p>
            <Button variant="link" className="p-0 h-auto mt-3 text-primary text-sm">
              Learn More <ArrowRight className="h-3 w-3 ml-1" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
