
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
import { useIsMobile } from "@/hooks/use-mobile";

const PersonalInsurance = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const { theme } = useTheme();
  const isLightTheme = theme === "light";
  const isMobile = useIsMobile();
  
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
        <div className={cn(
          "mx-auto w-full max-w-6xl space-y-4 animate-fade-in",
          isMobile ? "p-2" : "p-3"
        )}>
          <div className={cn(
            "flex items-center justify-between mb-4",
            isMobile ? "flex-col gap-3" : "flex-row"
          )}>
            <div className={isMobile ? "text-center" : ""}>
              <h1 className={cn(
                "font-semibold mb-1",
                isMobile ? "text-xl" : "text-[24px]",
                isLightTheme ? "text-foreground" : "text-foreground"
              )}>Insurance & Annuities</h1>
              <p className={cn(
                "text-muted-foreground",
                isMobile ? "text-sm" : ""
              )}>
                Track and manage your personal insurance policies and annuities
              </p>
            </div>
            <div className={cn(
              "flex gap-2",
              isMobile ? "w-full" : "mt-0"
            )}>
              <Button 
                variant="outline" 
                onClick={handleExport}
                className={isMobile ? "flex-1 text-sm" : ""}
              >
                Export Summary
              </Button>
            </div>
          </div>
          
          <Card className={cn(
            isMobile ? "p-3" : "p-4",
            isLightTheme ? "bg-card border-border" : "bg-card border-border"
          )}>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className={cn(
                "mb-4 w-full",
                isMobile ? "grid grid-cols-2 gap-1 h-auto p-1" : "grid grid-cols-6 gap-2",
                isLightTheme ? "bg-muted" : "bg-muted"
              )}>
                <TabsTrigger 
                  value="dashboard"
                  className={cn(
                    "data-[state=active]:bg-background data-[state=active]:text-foreground",
                    isMobile ? "text-sm py-2 px-2" : ""
                  )}
                >
                  Dashboard
                </TabsTrigger>
                <TabsTrigger 
                  value="life"
                  className={cn(
                    "data-[state=active]:bg-background data-[state=active]:text-foreground",
                    isMobile ? "text-sm py-2 px-2" : ""
                  )}
                >
                  Life
                </TabsTrigger>
                <TabsTrigger 
                  value="annuities"
                  className={cn(
                    "data-[state=active]:bg-background data-[state=active]:text-foreground",
                    isMobile ? "text-sm py-2 px-2" : ""
                  )}
                >
                  Annuities
                </TabsTrigger>
                <TabsTrigger 
                  value="health"
                  className={cn(
                    "data-[state=active]:bg-background data-[state=active]:text-foreground",
                    isMobile ? "text-sm py-2 px-2" : ""
                  )}
                >
                  Health
                </TabsTrigger>
                <TabsTrigger 
                  value="property"
                  className={cn(
                    "data-[state=active]:bg-background data-[state=active]:text-foreground",
                    isMobile ? "text-sm py-2 px-2" : ""
                  )}
                >
                  Property
                </TabsTrigger>
                <TabsTrigger 
                  value="umbrella"
                  className={cn(
                    "data-[state=active]:bg-background data-[state=active]:text-foreground",
                    isMobile ? "text-sm py-2 px-2" : ""
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
