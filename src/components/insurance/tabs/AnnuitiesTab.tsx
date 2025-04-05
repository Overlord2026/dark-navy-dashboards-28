
import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, FileText } from "lucide-react";
import { useInsuranceStore } from "@/hooks/useInsuranceStore";
import { InsurancePolicyCard } from "../cards/InsurancePolicyCard";

export const AnnuitiesTab = () => {
  const { policies, removePolicy } = useInsuranceStore();
  
  const annuityPolicies = policies.filter(policy => policy.type === "annuity");
  
  const handleAddPolicy = () => {
    // This would open a form dialog to add a new annuity policy
  };
  
  const handleUploadDocument = (policyId: string) => {
    // This would open a document upload dialog
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Annuities</h2>
          <p className="text-muted-foreground">
            Manage your annuity contracts and income streams
          </p>
        </div>
        <Button onClick={handleAddPolicy}>
          <Plus className="h-4 w-4 mr-2" /> Add Annuity
        </Button>
      </div>
      
      {annuityPolicies.length === 0 ? (
        <Card className="p-8 flex flex-col items-center justify-center text-center">
          <FileText className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-xl font-medium mb-2">No Annuity Contracts</h3>
          <p className="text-muted-foreground mb-4 max-w-md">
            You haven't added any annuity contracts yet. Add your first contract to
            start tracking your retirement income streams.
          </p>
          <Button onClick={handleAddPolicy}>
            <Plus className="h-4 w-4 mr-2" /> Add Annuity Contract
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {annuityPolicies.map((policy) => (
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
