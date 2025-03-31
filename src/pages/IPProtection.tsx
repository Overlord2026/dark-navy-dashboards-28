
import React from "react";
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";

const IPProtection = () => {
  return (
    <ThreeColumnLayout title="IP Protection" activeMainItem="ip-protection">
      <div className="space-y-6 px-4 py-6 max-w-7xl mx-auto">
        <div className="bg-card rounded-lg border border-border p-6">
          <h2 className="text-2xl font-semibold mb-4">Intellectual Property Protection</h2>
          <p className="text-muted-foreground mb-6">
            Manage and protect your intellectual property assets with our comprehensive tools.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-muted p-4 rounded-md">
              <h3 className="font-medium mb-2">IP Registry</h3>
              <p className="text-sm text-muted-foreground">Register and track your intellectual property</p>
            </div>
            <div className="bg-muted p-4 rounded-md">
              <h3 className="font-medium mb-2">Protection Status</h3>
              <p className="text-sm text-muted-foreground">Monitor the protection status of your IP assets</p>
            </div>
          </div>
        </div>
        
        <div className="bg-card rounded-lg border border-border p-6">
          <h2 className="text-2xl font-semibold mb-4">Legal Resources</h2>
          <p className="text-muted-foreground">
            Access legal resources and templates for IP protection and enforcement.
          </p>
        </div>
      </div>
    </ThreeColumnLayout>
  );
};

export default IPProtection;
