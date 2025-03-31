
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";
import { DeveloperAccessManager } from "@/components/settings/DeveloperAccessManager";
import { useUser } from "@/context/UserContext";
import { Navigate } from "react-router-dom";
import { toast } from "sonner";
import { auditLog } from "@/services/auditLog/auditLogService";
import { useEffect } from "react";

export default function DeveloperAccessControl() {
  const { userProfile } = useUser();
  const userRole = userProfile?.role || "client";
  const isAdmin = userRole === "admin" || userRole === "system_administrator";
  const userName = userProfile?.displayName || "Unknown User";

  // Log page access
  useEffect(() => {
    if (isAdmin && userProfile?.id) {
      // Log successful access to the developer access control page
      auditLog.log(
        userProfile.id,
        "document_access",
        "success",
        {
          userName: userName,
          userRole: userRole,
          resourceType: "developerAccessControl",
          details: { action: "Access developer permissions page" }
        }
      );
    } else if (userProfile?.id) {
      // Log unauthorized access attempt
      auditLog.log(
        userProfile.id,
        "document_access",
        "failure",
        {
          userName: userName,
          userRole: userRole,
          resourceType: "developerAccessControl",
          details: { action: "Access developer permissions page" },
          reason: "Insufficient permissions - admin access required"
        }
      );
    }
  }, [isAdmin, userProfile, userRole, userName]);

  // Redirect non-admin users
  if (!isAdmin) {
    toast.error("You don't have permission to access developer access control");
    return <Navigate to="/" replace />;
  }

  return (
    <ThreeColumnLayout title="Developer Access Control">
      <div className="container mx-auto py-8 space-y-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Developer Access Control</h1>
        </div>
        
        <div className="space-y-6">
          <p className="text-muted-foreground">
            As a System Administrator, you can control which developers have access
            to diagnostic tools. Use the controls below to grant or revoke access
            on a per-developer basis.
          </p>
          
          <DeveloperAccessManager />
        </div>
      </div>
    </ThreeColumnLayout>
  );
}
