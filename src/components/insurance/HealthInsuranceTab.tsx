
import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, ClipboardCheck } from "lucide-react";
import { useInsuranceStore } from "@/hooks/useInsuranceStore";
import { InsurancePolicyCard } from "./InsurancePolicyCard";

export const HealthInsuranceTab = () => {
  const { policies, removePolicy } = useInsuranceStore();
  
  const healthPolicies = policies.filter(
    policy => policy.type === "health" || policy.type === "long-term-care"
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
          <h2 className="text-2xl font-semibold">Health Insurance</h2>
          <p className="text-muted-foreground">
            Manage your health and long-term care policies
          </p>
        </div>
        <Button onClick={handleAddPolicy}>
          <Plus className="h-4 w-4 mr-2" /> Add Policy
        </Button>
      </div>
      
      {healthPolicies.length === 0 ? (
        <Card className="p-8 flex flex-col items-center justify-center text-center">
          <ClipboardCheck className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-xl font-medium mb-2">No Health Insurance Policies</h3>
          <p className="text-muted-foreground mb-4 max-w-md">
            You haven't added any health insurance policies yet. Add your first policy to
            start tracking your healthcare coverage.
          </p>
          <Button onClick={handleAddPolicy}>
            <Plus className="h-4 w-4 mr-2" /> Add Health Insurance Policy
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {healthPolicies.map((policy) => (
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
