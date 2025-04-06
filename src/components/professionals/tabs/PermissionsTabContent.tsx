
import React from "react";
import { Button } from "@/components/ui/button";
import { ShieldCheck } from "lucide-react";

export function PermissionsTabContent() {
  return (
    <div className="bg-card p-6 rounded-lg border border-border space-y-4">
      <h2 className="text-xl font-medium">Professional Access Permissions</h2>
      <p className="text-muted-foreground">
        Manage what information each professional can view and edit.
      </p>
      <div className="p-8 border border-dashed border-border rounded-lg flex flex-col items-center justify-center">
        <ShieldCheck size={48} className="text-muted-foreground mb-4" />
        <p className="text-center mb-2">No custom permissions configured</p>
        <Button variant="outline">Configure Permissions</Button>
      </div>
    </div>
  );
}
