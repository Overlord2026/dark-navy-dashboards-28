
import React from "react";
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";

const Help = () => {
  return (
    <ThreeColumnLayout title="Help">
      <div className="p-6 mx-auto max-w-7xl">
        <h1 className="text-3xl font-bold mb-6">Help & Support</h1>
        <div className="bg-card rounded-lg border border-border p-4">
          <p className="text-muted-foreground">Help page is under construction.</p>
        </div>
      </div>
    </ThreeColumnLayout>
  );
};

export default Help;
