
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PracticeDetailsForm } from "@/components/advisor/PracticeDetailsForm";
import { ModuleSelectionForm } from "@/components/advisor/ModuleSelectionForm";
import { PortalBrandingForm } from "@/components/advisor/PortalBrandingForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

export function AdvisorSetupFlow() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("practice-details");
  const [setupComplete, setSetupComplete] = useState(false);
  
  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };
  
  const handleNext = () => {
    if (activeTab === "practice-details") {
      setActiveTab("modules");
      toast.success("Practice details saved!");
    } else if (activeTab === "modules") {
      setActiveTab("branding");
      toast.success("Module selections saved!");
    }
  };
  
  const handleComplete = () => {
    toast.success("Setup completed successfully!");
    setSetupComplete(true);
    // Wait for toast to show before navigating
    setTimeout(() => {
      navigate("/advisor-dashboard");
    }, 2000);
  };
  
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <Card className="bg-[#0F0F2D] text-white border-gray-700">
        <CardHeader>
          <CardTitle>Advisor Setup</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={handleTabChange}>
            <TabsList className="grid grid-cols-3 mb-8">
              <TabsTrigger value="practice-details">Practice Details</TabsTrigger>
              <TabsTrigger value="modules">Modules</TabsTrigger>
              <TabsTrigger value="branding">Branding</TabsTrigger>
            </TabsList>
            
            <TabsContent value="practice-details">
              <PracticeDetailsForm />
              <div className="flex justify-end mt-6">
                <Button onClick={handleNext}>Next</Button>
              </div>
            </TabsContent>
            
            <TabsContent value="modules">
              <ModuleSelectionForm />
              <div className="flex justify-end mt-6">
                <Button onClick={handleNext}>Next</Button>
              </div>
            </TabsContent>
            
            <TabsContent value="branding">
              <PortalBrandingForm />
              <div className="flex justify-end mt-6">
                <Button onClick={handleComplete}>Complete Setup</Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      {setupComplete && (
        <div className="bg-green-500/20 border border-green-500/50 rounded-lg p-4 text-center">
          <h3 className="font-semibold text-green-500">Setup Complete!</h3>
          <p className="text-sm">Redirecting to your dashboard...</p>
        </div>
      )}
    </div>
  );
}
