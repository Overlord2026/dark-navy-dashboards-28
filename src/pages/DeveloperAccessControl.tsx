
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";
import { DeveloperAccessManager } from "@/components/settings/DeveloperAccessManager";
import { useUser } from "@/context/UserContext";
import { Navigate } from "react-router-dom";
import { toast } from "sonner";

export default function DeveloperAccessControl() {
  const { userProfile } = useUser();
  const userRole = userProfile?.role || "client";
  const isAdmin = userRole === "admin" || userRole === "system_administrator";

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
