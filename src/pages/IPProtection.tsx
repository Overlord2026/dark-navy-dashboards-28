
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { IPProtectionSettings } from "@/components/settings/IPProtectionSettings";
import { PublishAuditLogViewer } from "@/components/settings/PublishAuditLogViewer";
import { CollaborationGuidelines } from "@/components/settings/CollaborationGuidelines";
import { UserAccessRevocation } from "@/components/settings/UserAccessRevocation";
import { ShieldX } from "lucide-react";
import { useUser } from "@/context/UserContext";
import { DiagnosticsAccessButton } from "@/components/diagnostics/DiagnosticsAccessButton";

export default function IPProtection() {
  const { userProfile } = useUser();
  const userRole = userProfile?.role || "client";
  const isAdmin = userRole === "admin" || userRole === "system_administrator";

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">IP Protection & Security</h1>
        {isAdmin && <DiagnosticsAccessButton />}
      </div>
      
      <Tabs defaultValue="ip-settings" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="ip-settings">IP Agreement</TabsTrigger>
          <TabsTrigger value="repository">Repository Access</TabsTrigger>
          <TabsTrigger value="collaboration">Collaboration Guidelines</TabsTrigger>
          <TabsTrigger value="audit-logs">Publish Audit Logs</TabsTrigger>
          <TabsTrigger value="access-revocation" className="text-red-500 flex items-center gap-1">
            <ShieldX className="h-4 w-4" />
            <span>Revoke Access</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="ip-settings">
          <IPProtectionSettings />
        </TabsContent>
        
        <TabsContent value="repository">
          <IPProtectionSettings isRepositoryTab />
        </TabsContent>
        
        <TabsContent value="collaboration">
          <CollaborationGuidelines />
        </TabsContent>
        
        <TabsContent value="audit-logs">
          <PublishAuditLogViewer />
        </TabsContent>
        
        <TabsContent value="access-revocation">
          <UserAccessRevocation />
        </TabsContent>
      </Tabs>
    </div>
  );
}
