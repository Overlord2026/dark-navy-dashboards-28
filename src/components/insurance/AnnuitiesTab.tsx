
import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, FileText } from "lucide-react";
import { useInsuranceStore } from "@/hooks/useInsuranceStore";
import { InsurancePolicyCard } from "./InsurancePolicyCard";

export const AnnuitiesTab = () => {
  const { policies, removePolicy } = useInsuranceStore();
  
  const annuityPolicies = policies.filter(policy => policy.type === "annuity");
  
  const handleAddAnnuity = () => {
    // This would open a form dialog similar to Life Insurance
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
            Manage your annuity contracts and payments
          </p>
        </div>
        <Button onClick={handleAddAnnuity}>
          <Plus className="h-4 w-4 mr-2" /> Add Annuity
        </Button>
      </div>
      
      {annuityPolicies.length === 0 ? (
        <Card className="p-8 flex flex-col items-center justify-center text-center">
          <FileText className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-xl font-medium mb-2">No Annuities</h3>
          <p className="text-muted-foreground mb-4 max-w-md">
            You haven't added any annuities yet. Add your first annuity to
            start tracking your retirement income.
          </p>
          <Button onClick={handleAddAnnuity}>
            <Plus className="h-4 w-4 mr-2" /> Add Annuity
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
