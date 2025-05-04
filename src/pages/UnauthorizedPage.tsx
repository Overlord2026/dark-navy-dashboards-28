
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ShieldX, AlertTriangle, ChevronLeft } from "lucide-react";
import { useUser } from "@/context/UserContext";
import { secureAudit } from "@/services/security/SecureAuditService";

export default function UnauthorizedPage() {
  const navigate = useNavigate();
  const { userProfile } = useUser();
  
  // Log the unauthorized access for audit purposes
  React.useEffect(() => {
    if (userProfile?.id) {
      secureAudit.recordEvent(
        userProfile.id,
        'permission_change',
        'failure',
        {
          userName: userProfile?.name || "Unknown User",
          userRole: userProfile?.role || "Unknown Role",
          resourceType: 'page_access',
          details: {
            action: 'Unauthorized access attempt',
            accessPath: window.location.pathname
          },
          reason: 'Insufficient permissions'
        },
        { persistImmediately: true }
      );
    }
  }, [userProfile]);
  
  return (
    <div className="min-h-screen bg-[#0A1F44] flex flex-col items-center justify-center p-4">
      <div className="bg-[#0F1E3A] p-8 rounded-lg shadow-xl border border-[#2A3E5C] w-full max-w-md text-center">
        <div className="mx-auto bg-red-900/20 w-14 h-14 flex items-center justify-center rounded-full mb-4">
          <ShieldX className="text-red-500 h-7 w-7" />
        </div>
        
        <h1 className="text-2xl font-bold text-white mb-2">Access Denied</h1>
        
        <div className="bg-red-900/10 border border-red-800/20 rounded-md p-4 mb-6">
          <div className="flex items-center">
            <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
            <p className="text-red-300 text-sm font-medium">Security Alert</p>
          </div>
          <p className="text-gray-300 mt-2 text-sm">
            You don't have permission to access this resource. 
            This access attempt has been logged for security purposes.
          </p>
        </div>
        
        <p className="text-gray-400 mb-6">
          If you believe this is an error, please contact your administrator 
          for assistance or return to the dashboard.
        </p>
        
        <div className="flex flex-col gap-3">
          <Button 
            onClick={() => navigate("/dashboard")} 
            variant="outline"
            className="border-[#2A3E5C] text-white hover:bg-[#2A3E5C]/50 w-full"
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            Return to Dashboard
          </Button>
          
          <Button 
            onClick={() => window.location.href = "/secure-login"}
            className="bg-red-700 hover:bg-red-800 text-white w-full"
          >
            Sign Out
          </Button>
        </div>
      </div>
    </div>
  );
}
