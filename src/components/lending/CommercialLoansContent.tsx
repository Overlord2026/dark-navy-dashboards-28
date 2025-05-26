
import React from "react";
import { Card } from "@/components/ui/card";
import { Building, Briefcase, TrendingUp, Users } from "lucide-react";
import { ScheduleMeetingButton } from "./ScheduleMeetingButton";
import { InterestedButton } from "@/components/investments/InterestedButton";

export const CommercialLoansContent = () => {
  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold mb-2">Commercial Loans</h1>
        <p className="text-muted-foreground">
          Financing for business expenses and commercial real estate.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-xl font-medium mb-3">How It Works</h3>
              <p className="text-muted-foreground mb-4">
                Commercial loans provide financing for business operations, expansion, 
                equipment purchases, and commercial real estate acquisitions. We work 
                with specialized lenders to structure solutions for your business needs.
              </p>
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-50 p-2 rounded-full">
                    <Building className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium">Real Estate Financing</p>
                    <p className="text-sm text-muted-foreground">Commercial property acquisition and refinancing</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-green-50 p-2 rounded-full">
                    <Briefcase className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium">Equipment Loans</p>
                    <p className="text-sm text-muted-foreground">Financing for business equipment and machinery</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-purple-50 p-2 rounded-full">
                    <TrendingUp className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-medium">Working Capital</p>
                    <p className="text-sm text-muted-foreground">Lines of credit for business operations</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-xl font-medium mb-3">Loan Types</h3>
              <p className="text-muted-foreground mb-4">
                Various commercial financing options to support different business needs 
                and growth strategies across industries and business sizes.
              </p>
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <div className="bg-amber-50 p-2 rounded-full">
                    <Building className="h-5 w-5 text-amber-600" />
                  </div>
                  <div>
                    <p className="font-medium">SBA Loans</p>
                    <p className="text-sm text-muted-foreground">Government-backed financing programs</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-blue-50 p-2 rounded-full">
                    <Users className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium">Business Acquisition</p>
                    <p className="text-sm text-muted-foreground">Financing for purchasing existing businesses</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-green-50 p-2 rounded-full">
                    <TrendingUp className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium">Business Expansion</p>
                    <p className="text-sm text-muted-foreground">Growth capital for scaling operations</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
      
      <Card className="p-6">
        <h3 className="text-xl font-medium mb-4">Ready to Get Started?</h3>
        <p className="text-muted-foreground mb-6">
          Connect with your advisor to discuss your commercial financing needs and 
          explore business lending solutions tailored to your industry and goals.
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <InterestedButton assetName="Commercial Loans" />
          <ScheduleMeetingButton offeringName="Commercial Loans" />
        </div>
      </Card>
    </div>
  );
};
