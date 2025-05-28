
import React, { useState } from "react";
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PersonalInsuranceDashboard } from "@/components/insurance/PersonalInsuranceDashboard";
import { LifeInsuranceTab } from "@/components/insurance/LifeInsuranceTab";
import { AnnuitiesTab } from "@/components/insurance/AnnuitiesTab";
import { HealthInsuranceTab } from "@/components/insurance/HealthInsuranceTab";
import { PropertyInsuranceTab } from "@/components/insurance/PropertyInsuranceTab";
import { UmbrellaInsuranceTab } from "@/components/insurance/UmbrellaInsuranceTab";
import { useTheme } from "@/context/ThemeContext";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const PersonalInsurance = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const { theme } = useTheme();
  const isLightTheme = theme === "light";
  
  const handleExport = () => {
    toast.success("Exporting insurance summary...", {
      description: "Your insurance summary will be emailed to you shortly.",
    });
  };

  return (
    <div className={cn(
      "min-h-screen",
      isLightTheme ? "bg-background" : "bg-background"
    )}>
      <ThreeColumnLayout activeMainItem="family-wealth" title="Insurance & Annuities">
        <div className="mx-auto w-full max-w-6xl space-y-4 animate-fade-in p-3">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
            <div>
              <h1 className={cn(
                "text-[24px] font-semibold mb-1",
                isLightTheme ? "text-foreground" : "text-foreground"
              )}>Insurance & Annuities</h1>
              <p className={cn(
                "text-muted-foreground"
              )}>
                Track and manage your personal insurance policies and annuities
              </p>
            </div>
            <div className="mt-3 md:mt-0 flex gap-2">
              <Button variant="outline" onClick={handleExport}>
                Export Summary
              </Button>
            </div>
          </div>
          
          <Card className={cn(
            "p-4",
            isLightTheme ? "bg-card border-border" : "bg-card border-border"
          )}>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className={cn(
                "grid grid-cols-2 md:grid-cols-6 gap-2 mb-4",
                isLightTheme ? "bg-muted" : "bg-muted"
              )}>
                <TabsTrigger 
                  value="dashboard"
                  className={cn(
                    "data-[state=active]:bg-background data-[state=active]:text-foreground"
                  )}
                >
                  Dashboard
                </TabsTrigger>
                <TabsTrigger 
                  value="life"
                  className={cn(
                    "data-[state=active]:bg-background data-[state=active]:text-foreground"
                  )}
                >
                  Life
                </TabsTrigger>
                <TabsTrigger 
                  value="annuities"
                  className={cn(
                    "data-[state=active]:bg-background data-[state=active]:text-foreground"
                  )}
                >
                  Annuities
                </TabsTrigger>
                <TabsTrigger 
                  value="health"
                  className={cn(
                    "data-[state=active]:bg-background data-[state=active]:text-foreground"
                  )}
                >
                  Health
                </TabsTrigger>
                <TabsTrigger 
                  value="property"
                  className={cn(
                    "data-[state=active]:bg-background data-[state=active]:text-foreground"
                  )}
                >
                  Property
                </TabsTrigger>
                <TabsTrigger 
                  value="umbrella"
                  className={cn(
                    "data-[state=active]:bg-background data-[state=active]:text-foreground"
                  )}
                >
                  Umbrella
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="dashboard">
                <PersonalInsuranceDashboard />
              </TabsContent>
              
              <TabsContent value="life">
                <LifeInsuranceTab />
              </TabsContent>
              
              <TabsContent value="annuities">
                <AnnuitiesTab />
              </TabsContent>
              
              <TabsContent value="health">
                <HealthInsuranceTab />
              </TabsContent>
              
              <TabsContent value="property">
                <PropertyInsuranceTab />
              </TabsContent>
              
              <TabsContent value="umbrella">
                <UmbrellaInsuranceTab />
              </TabsContent>
            </Tabs>
          </Card>
        </div>
      </ThreeColumnLayout>
    </div>
  );
};

export default PersonalInsurance;
