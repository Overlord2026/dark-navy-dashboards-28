
import { IPProtectionSettings } from "@/components/settings/IPProtectionSettings";
import { PublishAuditLogViewer } from "@/components/settings/PublishAuditLogViewer";

export default function IPProtection() {
  return (
    <div className="container mx-auto py-8 space-y-8">
      <IPProtectionSettings />
      <PublishAuditLogViewer />
    </div>
  );
}
