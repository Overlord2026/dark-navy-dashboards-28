
import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Umbrella } from "lucide-react";
import { useInsuranceStore } from "@/hooks/useInsuranceStore";
import { InsurancePolicyCard } from "./InsurancePolicyCard";
import { useTheme } from "@/context/ThemeContext";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

export const UmbrellaInsuranceTab = () => {
  const { policies, removePolicy } = useInsuranceStore();
  const { theme } = useTheme();
  const isLightTheme = theme === "light";
  const isMobile = useIsMobile();
  
  const umbrellaPolicies = policies.filter(policy => policy.type === "umbrella");
  
  const handleAddPolicy = () => {
    // This would open a form dialog similar to Life Insurance
  };
  
  const handleUploadDocument = (policyId: string) => {
    // This would open a document upload dialog
  };
  
  return (
    <div className="space-y-6">
      <div className={cn(
        "flex items-center justify-between",
        isMobile ? "flex-col gap-3 items-start" : "flex-row"
      )}>
        <div>
          <h2 className={cn(
            "font-semibold",
            isMobile ? "text-xl" : "text-2xl",
            isLightTheme ? "text-foreground" : "text-foreground"
          )}>Umbrella Policies</h2>
          <p className={cn(
            "text-muted-foreground",
            isMobile ? "text-sm" : ""
          )}>
            Manage your umbrella liability policies
          </p>
        </div>
        <Button 
          onClick={handleAddPolicy}
          className={isMobile ? "w-full text-sm" : ""}
        >
          <Plus className={cn("mr-2", isMobile ? "h-3 w-3" : "h-4 w-4")} /> 
          Add Policy
        </Button>
      </div>
      
      {umbrellaPolicies.length === 0 ? (
        <Card className={cn(
          "flex flex-col items-center justify-center text-center",
          isMobile ? "p-6" : "p-8",
          isLightTheme ? "bg-card border-border" : "bg-card border-border"
        )}>
          <Umbrella className={cn(
            "text-muted-foreground mb-4",
            isMobile ? "h-10 w-10" : "h-12 w-12"
          )} />
          <h3 className={cn(
            "font-medium mb-2",
            isMobile ? "text-lg" : "text-xl",
            isLightTheme ? "text-foreground" : "text-foreground"
          )}>No Umbrella Policies</h3>
          <p className={cn(
            "text-muted-foreground mb-4 max-w-md",
            isMobile ? "text-sm" : ""
          )}>
            You haven't added any umbrella liability policies yet. Add your first policy to
            start tracking your additional liability coverage.
          </p>
          <Button 
            onClick={handleAddPolicy}
            className={isMobile ? "w-full text-sm" : ""}
          >
            <Plus className={cn("mr-2", isMobile ? "h-3 w-3" : "h-4 w-4")} /> 
            Add Umbrella Policy
          </Button>
        </Card>
      ) : (
        <div className={cn(
          "grid gap-4",
          isMobile ? "grid-cols-1" : "grid-cols-1 md:grid-cols-2"
        )}>
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
