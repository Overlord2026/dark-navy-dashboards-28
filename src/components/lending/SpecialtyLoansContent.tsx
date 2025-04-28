
import React from "react";
import { Card } from "@/components/ui/card";
import { ArrowRight, Briefcase, Paint, Car, PlaneTakeoff, Award, Wine } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScheduleMeetingButton } from "./ScheduleMeetingButton";

export const SpecialtyLoansContent = () => {
  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold mb-2">Specialty Financing</h1>
        <p className="text-muted-foreground">
          Custom lending solutions for unique assets and opportunities.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-xl font-medium mb-3">How It Works</h3>
              <p className="text-muted-foreground mb-4">
                Specialty financing provides tailored lending solutions for unique assets that 
                traditional lenders may not accommodate. These custom structures allow you to 
                leverage or acquire valuable assets with specialized terms.
              </p>
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-50 p-2 rounded-full">
                    <Briefcase className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium">Custom Structures</p>
                    <p className="text-sm text-muted-foreground">Tailored to your unique needs</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-green-50 p-2 rounded-full">
                    <Award className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium">Specialized Expertise</p>
                    <p className="text-sm text-muted-foreground">Industry knowledge for unique assets</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-purple-50 p-2 rounded-full">
                    <PlaneTakeoff className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-medium">Asset-Specific Financing</p>
                    <p className="text-sm text-muted-foreground">Terms aligned with asset characteristics</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-xl font-medium mb-3">Use Cases</h3>
              <p className="text-muted-foreground mb-4">
                Specialty financing can be used for various unique assets and opportunities.
              </p>
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <div className="bg-amber-50 p-2 rounded-full">
                    <Paint className="h-5 w-5 text-amber-600" />
                  </div>
                  <div>
                    <p className="font-medium">Art & Collectibles</p>
                    <p className="text-sm text-muted-foreground">Leverage your fine art collection</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-blue-50 p-2 rounded-full">
                    <PlaneTakeoff className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium">Aircraft & Yacht Financing</p>
                    <p className="text-sm text-muted-foreground">Specialized terms for luxury assets</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-green-50 p-2 rounded-full">
                    <Wine className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium">Wine Collections</p>
                    <p className="text-sm text-muted-foreground">Finance rare wine acquisitions</p>
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
          Speak with your advisor to explore specialty financing options tailored to 
          your unique asset acquisition or leverage needs.
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <ScheduleMeetingButton offeringName="Specialty Financing" />
          <Button variant="outline">Learn More <ArrowRight className="ml-2 h-4 w-4" /></Button>
        </div>
      </Card>
    </div>
  );
};
