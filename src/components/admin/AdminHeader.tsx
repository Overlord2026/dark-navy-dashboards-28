import React from "react";
import { PublishBatchButton } from "@/components/admin/PublishBatchButton";
import { PromotePolicyButton } from "@/components/admin/PromotePolicyButton";
import { RevertTagButton } from "@/components/admin/RevertTagButton";

export function AdminHeader() {
  return (
    <div className="border-b border-border bg-background">
      <div className="flex h-14 items-center justify-between px-6">
        <h1 className="text-lg font-semibold text-foreground">Admin Dashboard</h1>
        <AdminHeaderTools />
      </div>
    </div>
  );
}

export function AdminHeaderTools() {
  // Guard with ADMIN role check if needed
  const isAdminToolsEnabled = import.meta.env.VITE_ADMIN_TOOLS_ENABLED !== 'false';
  
  if (!isAdminToolsEnabled) return null;
  
  return (
    <div className="flex items-center gap-3">
      <PublishBatchButton />
      <PromotePolicyButton />
      <RevertTagButton />
    </div>
  );
}