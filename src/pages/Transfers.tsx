
import React from "react";
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const Transfers = () => {
  const handleAddFundingAccount = () => {
    // TODO: Navigate to add funding account page or open modal
    console.log("Add funding account clicked");
  };

  return (
    <ThreeColumnLayout title="Transfers">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold">Funding Account</h1>
          <Button onClick={handleAddFundingAccount} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add a Funding Account
          </Button>
        </div>
      </div>
    </ThreeColumnLayout>
  );
};

export default Transfers;
