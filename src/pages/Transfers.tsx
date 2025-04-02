import React from "react";
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";
import { Plus } from "lucide-react"; // Add the missing import

const Transfers = () => {
  return (
    <ThreeColumnLayout title="Transfers">
      <div className="space-y-4 px-4 py-2 max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold">Transfers</h1>
        <p className="text-muted-foreground">
          Manage and schedule your transfers from one centralized location.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-6">
          <div className="rounded-lg border p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Upcoming Transfers</h2>
            <p className="text-muted-foreground">
              No upcoming transfers scheduled. Add your first transfer to get started.
            </p>
          </div>
          
          <div className="rounded-lg border p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Transfer History</h2>
            <p className="text-muted-foreground">
              Your transfer history will appear here once you've made your first transfer.
            </p>
          </div>
        </div>
        
        <div className="mt-8">
          <button className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md">
            + Add New Transfer
          </button>
        </div>
      </div>
    </ThreeColumnLayout>
  );
};

export default Transfers;
