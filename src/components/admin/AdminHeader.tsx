import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PublishBatchButton } from "@/components/admin/PublishBatchButton";
import { PromotePolicyButton } from "@/components/admin/PromotePolicyButton";
import { RevertTagButton } from "@/components/admin/RevertTagButton";
import { AnchorNowButton } from "@/components/admin/AnchorNowButton";
import { AutoAnchorToggle } from "@/components/admin/AutoAnchorToggle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { VoiceMicButton } from "@/components/voice/VoiceMicButton";
import { VoiceDrawer } from "@/components/voice/VoiceDrawer";

export function AdminHeader() {
  const [voiceOpen, setVoiceOpen] = useState(false);
  
  return (
    <div className="border-b border-border bg-background">
      <div className="flex h-14 items-center justify-between px-6">
        <h1 className="text-lg font-semibold text-foreground">Admin Dashboard</h1>
        <div className="flex items-center gap-3">
          <VoiceMicButton onClick={() => setVoiceOpen(true)} />
          <AdminHeaderTools />
        </div>
        <VoiceDrawer 
          open={voiceOpen} 
          onClose={() => setVoiceOpen(false)} 
          persona="admin" 
          endpoint="meeting-summary" 
        />
      </div>
    </div>
  );
}

export function AdminHeaderTools() {
  // Guard with ADMIN role check if needed
  const isAdminToolsEnabled = import.meta.env.VITE_ADMIN_TOOLS_ENABLED !== 'false';
  const nav = useNavigate();
  const [rid, setRid] = useState("");
  
  // Preserve current query params when opening receipts
  const currentQuery = typeof window !== "undefined" 
    ? window.location.search 
    : "";
  
  if (!isAdminToolsEnabled) return null;

  const goto = (path: string) => {
    try {
      window.location.assign(path);
    } catch { /* ignore */ }
  };

  return (
    <div className="flex items-center gap-3">
      <PublishBatchButton />
      <PromotePolicyButton />
      <RevertTagButton />
      <AnchorNowButton />
      <AutoAnchorToggle />
      
      <div className="inline-flex items-center gap-1 border border-border rounded-lg px-3 py-1">
        <Input
          className="border-0 outline-none text-sm bg-transparent h-auto p-0 w-32"
          placeholder="Receipt ID…"
          value={rid}
          onChange={e => setRid(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && rid && nav(`/admin/receipt/${encodeURIComponent(rid)}${currentQuery}`)}
        />
        <Button
          variant="ghost"
          size="sm"
          className="h-auto px-2 py-1 text-xs"
          onClick={() => rid && nav(`/admin/receipt/${encodeURIComponent(rid)}${currentQuery}`)}
        >
          Open
        </Button>
      </div>
      
      <Button
        variant="outline"
        size="sm"
        onClick={() => goto("/admin/anchors")}
        title="View anchor batches"
      >
        Anchors
      </Button>
      
      <Button
        variant="outline"
        size="sm"
        onClick={() => goto("/admin/estate/county-meta")}
        title="County metadata editor"
      >
        County Meta
      </Button>
      
      <Button
        variant="outline"
        size="sm"
        onClick={() => goto("/admin/rulesync")}
        title="RuleSync administration"
      >
        RuleSync
      </Button>
    </div>
  );
}