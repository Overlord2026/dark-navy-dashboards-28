
import React from "react";
import { Card } from "@/components/ui/card";
import { ArrowRight, Briefcase, Lightbulb, GraduationCap, Plane, Palette, Ship } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScheduleMeetingButton } from "./ScheduleMeetingButton";

export const SpecialtyLoansContent = () => {
  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold mb-2">Specialty Loans</h1>
        <p className="text-muted-foreground">
          Specialized financing solutions for unique needs.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-xl font-medium mb-3">How It Works</h3>
              <p className="text-muted-foreground mb-4">
                Specialty loans are designed for specific purposes or industries with 
                unique financing needs. These loans often feature customized terms and 
                underwriting criteria tailored to the specific asset or situation.
              </p>
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-50 p-2 rounded-full">
                    <Briefcase className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium">Tailored Solutions</p>
                    <p className="text-sm text-muted-foreground">Financing designed for unique needs</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-green-50 p-2 rounded-full">
                    <Lightbulb className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium">Expert Guidance</p>
                    <p className="text-sm text-muted-foreground">Specialist lenders with industry knowledge</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-purple-50 p-2 rounded-full">
                    <GraduationCap className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-medium">Specialized Terms</p>
                    <p className="text-sm text-muted-foreground">Structured for specific assets or situations</p>
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
                Specialty loans address a wide range of unique financing needs across various industries and assets.
              </p>
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <div className="bg-amber-50 p-2 rounded-full">
                    <Plane className="h-5 w-5 text-amber-600" />
                  </div>
                  <div>
                    <p className="font-medium">Aviation Financing</p>
                    <p className="text-sm text-muted-foreground">Aircraft purchasing and maintenance</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-blue-50 p-2 rounded-full">
                    <Palette className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium">Art & Collectibles</p>
                    <p className="text-sm text-muted-foreground">Financing for high-value collections</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-green-50 p-2 rounded-full">
                    <Ship className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium">Marine Financing</p>
                    <p className="text-sm text-muted-foreground">Yacht and vessel purchases</p>
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
          Speak with your advisor to discuss your specialty financing needs and explore 
          options tailored to your specific situation.
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <ScheduleMeetingButton offeringName="Specialty Loans" />
          <Button variant="outline">Learn More <ArrowRight className="ml-2 h-4 w-4" /></Button>
        </div>
      </Card>
    </div>
  );
};
