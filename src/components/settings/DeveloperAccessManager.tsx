
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { useUser } from "@/context/UserContext";
import { auditLog } from "@/services/auditLog/auditLogService";

// Mock data for developers
const mockDevelopers = [
  { id: "dev1", name: "Alex Johnson", email: "alex@example.com", hasAccess: true, lastAccess: "2023-06-15T10:30:00Z" },
  { id: "dev2", name: "Sam Phillips", email: "sam@example.com", hasAccess: false, lastAccess: null },
  { id: "dev3", name: "Jordan Lee", email: "jordan@example.com", hasAccess: true, lastAccess: "2023-06-10T08:15:00Z" },
  { id: "dev4", name: "Casey Rivera", email: "casey@example.com", hasAccess: false, lastAccess: "2023-05-20T11:45:00Z" },
];

export const DeveloperAccessManager = () => {
  const [developers, setDevelopers] = useState(mockDevelopers);
  const [isUpdating, setIsUpdating] = useState(false);
  const { userProfile } = useUser();
  const userId = userProfile?.id || "unknown";
  const userName = userProfile?.displayName || "Unknown User";
  const userRole = userProfile?.role || "client";
  
  const handleAccessToggle = (developerId: string) => {
    setIsUpdating(true);
    
    // Simulate API call delay
    setTimeout(() => {
      setDevelopers(prevDevelopers => 
        prevDevelopers.map(dev => 
          dev.id === developerId 
            ? { ...dev, hasAccess: !dev.hasAccess, lastAccess: dev.hasAccess ? dev.lastAccess : new Date().toISOString() } 
            : dev
        )
      );
      
      const developer = developers.find(dev => dev.id === developerId);
      const newAccessState = !developer?.hasAccess;
      
      if (developer) {
        // Log the action
        auditLog.log(
          userId,
          "permission_change",
          "success",
          {
            userName: userName,
            userRole: userRole,
            resourceType: "developmentAccess",
            details: { 
              action: newAccessState ? "Grant developer access" : "Revoke developer access",
              developerId: developerId,
              developerEmail: developer.email,
              developerName: developer.name
            }
          }
        );
        
        toast.success(
          newAccessState 
            ? `Access granted to ${developer.name}` 
            : `Access revoked from ${developer.name}`
        );
      }
      
      setIsUpdating(false);
    }, 600);
  };
  
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Never";
    return new Date(dateString).toLocaleString();
  };
  
  const addNewDeveloper = () => {
    // In a real app, this would open a form to add a new developer
    toast.info("This would open a dialog to add a new developer", {
      description: "Feature not implemented in this demo",
    });
  };
  
  return (
    <div className="rounded-lg border bg-card shadow-sm">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Developer Access Control</h2>
          <Button onClick={addNewDeveloper}>Add Developer</Button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b">
                <th className="text-left px-4 py-3 text-sm font-medium">Developer</th>
                <th className="text-left px-4 py-3 text-sm font-medium">Email</th>
                <th className="text-left px-4 py-3 text-sm font-medium">Last Access</th>
                <th className="text-center px-4 py-3 text-sm font-medium">Access</th>
              </tr>
            </thead>
            <tbody>
              {developers.map((developer) => (
                <tr key={developer.id} className="border-b hover:bg-muted/50">
                  <td className="px-4 py-3 text-sm">{developer.name}</td>
                  <td className="px-4 py-3 text-sm">{developer.email}</td>
                  <td className="px-4 py-3 text-sm">{formatDate(developer.lastAccess)}</td>
                  <td className="px-4 py-3 text-center">
                    <Switch 
                      checked={developer.hasAccess}
                      onCheckedChange={() => handleAccessToggle(developer.id)}
                      disabled={isUpdating}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="mt-6 text-sm text-muted-foreground">
          <p>Developers with access can use advanced diagnostics tools and access system internals.</p>
          <p>All access changes are logged and audited.</p>
        </div>
      </div>
    </div>
  );
};
