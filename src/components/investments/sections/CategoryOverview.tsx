import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, Target, ShieldCheck, Globe } from "lucide-react";

interface CategoryOverviewProps {
  name: string;
  description: string;
}

export const CategoryOverview: React.FC<CategoryOverviewProps> = ({ name, description }) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Overview</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-[#121a2c] rounded-lg">
              <h3 className="text-sm font-medium mb-2">Average Returns</h3>
              <div className="text-2xl font-bold text-green-500">+18.5%</div>
              <p className="text-xs text-muted-foreground mt-1">Past 3 years</p>
            </div>
            <div className="p-4 bg-[#121a2c] rounded-lg">
              <h3 className="text-sm font-medium mb-2">Total AUM</h3>
              <div className="text-2xl font-bold">$2.8B</div>
              <p className="text-xs text-muted-foreground mt-1">Across all offerings</p>
            </div>
            <div className="p-4 bg-[#121a2c] rounded-lg">
              <h3 className="text-sm font-medium mb-2">Active Investments</h3>
              <div className="text-2xl font-bold">24</div>
              <p className="text-xs text-muted-foreground mt-1">Current offerings</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Key Characteristics</CardTitle>
          <CardDescription>Important features of this investment category</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex gap-3">
              <div className="mt-1">
                <Clock className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <h3 className="font-medium mb-1">Long-term Investment Horizon</h3>
                <p className="text-sm text-muted-foreground">
                  Typical investment periods of 5-10 years with limited liquidity
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="mt-1">
                <Target className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <h3 className="font-medium mb-1">Higher Return Potential</h3>
                <p className="text-sm text-muted-foreground">
                  Targeting returns above public market equivalents
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="mt-1">
                <ShieldCheck className="h-5 w-5 text-amber-500" />
              </div>
              <div>
                <h3 className="font-medium mb-1">Investor Requirements</h3>
                <p className="text-sm text-muted-foreground">
                  Limited to accredited and qualified purchasers
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="mt-1">
                <Globe className="h-5 w-5 text-purple-500" />
              </div>
              <div>
                <h3 className="font-medium mb-1">Global Opportunities</h3>
                <p className="text-sm text-muted-foreground">
                  Access to investments across different regions
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
