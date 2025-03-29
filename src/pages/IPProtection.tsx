
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { IPProtectionSettings } from "@/components/settings/IPProtectionSettings";
import { PublishAuditLogViewer } from "@/components/settings/PublishAuditLogViewer";
import { CollaborationGuidelines } from "@/components/settings/CollaborationGuidelines";
import { UserAccessRevocation } from "@/components/settings/UserAccessRevocation";
import { ShieldX, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function IPProtection() {
  const navigate = useNavigate();

  const handleDiagnosticsAccess = () => {
    navigate("/system-diagnostics");
  };

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">IP Protection & Security</h1>
        <Button 
          onClick={handleDiagnosticsAccess}
          variant="outline"
          className="flex items-center gap-2"
        >
          <Activity className="h-4 w-4" />
          <span>System Diagnostics</span>
        </Button>
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
