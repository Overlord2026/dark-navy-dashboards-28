
import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Umbrella } from "lucide-react";
import { useInsuranceStore } from "@/hooks/useInsuranceStore";
import { InsurancePolicyCard } from "./InsurancePolicyCard";
import { useTheme } from "@/context/ThemeContext";
import { cn } from "@/lib/utils";

export const UmbrellaInsuranceTab = () => {
  const { policies, removePolicy } = useInsuranceStore();
  const { theme } = useTheme();
  const isLightTheme = theme === "light";
  
  const umbrellaPolicies = policies.filter(policy => policy.type === "umbrella");
  
  const handleAddPolicy = () => {
    // This would open a form dialog similar to Life Insurance
  };
  
  const handleUploadDocument = (policyId: string) => {
    // This would open a document upload dialog
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className={cn(
            "text-2xl font-semibold",
            isLightTheme ? "text-foreground" : "text-foreground"
          )}>Umbrella Policies</h2>
          <p className="text-muted-foreground">
            Manage your umbrella liability policies
          </p>
        </div>
        <Button onClick={handleAddPolicy}>
          <Plus className="h-4 w-4 mr-2" /> Add Policy
        </Button>
      </div>
      
      {umbrellaPolicies.length === 0 ? (
        <Card className={cn(
          "p-8 flex flex-col items-center justify-center text-center",
          isLightTheme ? "bg-card border-border" : "bg-card border-border"
        )}>
          <Umbrella className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className={cn(
            "text-xl font-medium mb-2",
            isLightTheme ? "text-foreground" : "text-foreground"
          )}>No Umbrella Policies</h3>
          <p className="text-muted-foreground mb-4 max-w-md">
            You haven't added any umbrella liability policies yet. Add your first policy to
            start tracking your additional liability coverage.
          </p>
          <Button onClick={handleAddPolicy}>
            <Plus className="h-4 w-4 mr-2" /> Add Umbrella Policy
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {umbrellaPolicies.map((policy) => (
            <InsurancePolicyCard
              key={policy.id}
              policy={policy}
              onRemove={() => removePolicy(policy.id)}
              onUploadDocument={() => handleUploadDocument(policy.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};
