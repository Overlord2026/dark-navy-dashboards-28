import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Home, Car } from "lucide-react";
import { useInsuranceStore } from "@/hooks/useInsuranceStore";
import { InsurancePolicyCard } from "../cards/InsurancePolicyCard";

export const PropertyInsuranceTab = () => {
  const { policies, removePolicy } = useInsuranceStore();
  
  const propertyPolicies = policies.filter(
    policy => policy.type === "homeowners" || policy.type === "auto"
  );
  
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
          <h2 className="text-2xl font-semibold">Property Insurance</h2>
          <p className="text-muted-foreground">
            Manage your home, auto, and other property insurance policies
          </p>
        </div>
        <Button onClick={handleAddPolicy}>
          <Plus className="h-4 w-4 mr-2" /> Add Policy
        </Button>
      </div>
      
      {propertyPolicies.length === 0 ? (
        <Card className="p-8 flex flex-col items-center justify-center text-center">
          <Home className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-xl font-medium mb-2">No Property Insurance Policies</h3>
          <p className="text-muted-foreground mb-4 max-w-md">
            You haven't added any property insurance policies yet. Add your first policy to
            start tracking your coverage for your home and vehicles.
          </p>
          <Button onClick={handleAddPolicy}>
            <Plus className="h-4 w-4 mr-2" /> Add Property Insurance Policy
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {propertyPolicies.map((policy) => (
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
