
import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PersonalInsuranceDashboard } from "@/components/insurance/PersonalInsuranceDashboard";
import { LifeInsuranceTab } from "@/components/insurance/LifeInsuranceTab";
import { AnnuitiesTab } from "@/components/insurance/AnnuitiesTab";
import { HealthInsuranceTab } from "@/components/insurance/HealthInsuranceTab";
import { PropertyInsuranceTab } from "@/components/insurance/PropertyInsuranceTab";
import { UmbrellaInsuranceTab } from "@/components/insurance/UmbrellaInsuranceTab";
import { toast } from "sonner";

const Insurance = () => {
  const [activeTab, setActiveTab] = React.useState("dashboard");
  
  const handleExport = () => {
    toast.success("Exporting insurance summary...", {
      description: "Your insurance summary will be emailed to you shortly.",
    });
  };

  return (
    <div className="mx-auto w-full max-w-6xl space-y-4 animate-fade-in p-3">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
        <div>
          <h1 className="text-[24px] font-semibold mb-1">Insurance & Annuities</h1>
          <p className="text-muted-foreground">
            Track and manage your personal insurance policies and annuities
          </p>
        </div>
        <div className="mt-3 md:mt-0 flex gap-2">
          <Button variant="outline" onClick={handleExport}>
            Export Summary
          </Button>
        </div>
      </div>
      
      <Card className="p-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 md:grid-cols-6 gap-2 mb-4">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="life">Life</TabsTrigger>
            <TabsTrigger value="annuities">Annuities</TabsTrigger>
            <TabsTrigger value="health">Health</TabsTrigger>
            <TabsTrigger value="property">Property</TabsTrigger>
            <TabsTrigger value="umbrella">Umbrella</TabsTrigger>
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
  );
};

export default Insurance;
