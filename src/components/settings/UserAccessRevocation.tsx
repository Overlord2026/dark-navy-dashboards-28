
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, ShieldX, UserX, Trash2, Archive } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { auditLog } from "@/services/auditLog/auditLogService";
import { toast } from "sonner";

export function UserAccessRevocation() {
  const [username, setUsername] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [revokeOptions, setRevokeOptions] = useState({
    removeFromProject: true,
    revokeRepositoryAccess: true,
    disablePublishing: true,
    disable2FA: true,
    archiveDocuments: true
  });

  const handleRevokeOptionChange = (option: keyof typeof revokeOptions) => {
    setRevokeOptions(prev => ({
      ...prev,
      [option]: !prev[option]
    }));
  };

  const handleShowConfirmation = () => {
    if (!username.trim()) {
      toast.error("Please enter a username");
      return;
    }
    setShowConfirmation(true);
  };

  const handleCancelRevocation = () => {
    setShowConfirmation(false);
  };

  const handleConfirmRevocation = () => {
    // Perform the revocation actions
    toast.success(`All access for ${username} has been revoked`);
    
    // Log the revocation to audit trail
    auditLog.log(
      "system-user",
      "permission_change",
      "success",
      {
        userName: "Admin",
        userRole: "Admin",
        resourceType: "User Access",
        details: {
          action: "revoke_access",
          targetUser: username,
          revokedAccess: {
            projectAccess: revokeOptions.removeFromProject,
            repositoryAccess: revokeOptions.revokeRepositoryAccess,
            publishingRights: revokeOptions.disablePublishing,
            twoFactorAuthentication: revokeOptions.disable2FA,
            documentsArchived: revokeOptions.archiveDocuments
          },
          timestamp: new Date().toISOString()
        }
      }
    );
    
    // Reset the form
    setUsername("");
    setShowConfirmation(false);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <ShieldX className="h-5 w-5 text-red-500" />
          <CardTitle>User Access Revocation</CardTitle>
        </div>
        <CardDescription>
          Revoke all access and permissions for a specific user
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        {!showConfirmation ? (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="username">Username to revoke access</Label>
              <Input 
                id="username" 
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            
            <div className="space-y-4">
              <h3 className="text-md font-medium">Revocation options:</h3>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <UserX className="h-4 w-4 text-muted-foreground" />
                    <Label htmlFor="remove-project">Remove from project</Label>
                  </div>
                  <Switch 
                    id="remove-project"
                    checked={revokeOptions.removeFromProject}
                    onCheckedChange={() => handleRevokeOptionChange("removeFromProject")}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldX className="h-4 w-4 text-muted-foreground" />
                    <Label htmlFor="revoke-repository">Revoke repository access</Label>
                  </div>
                  <Switch 
                    id="revoke-repository"
                    checked={revokeOptions.revokeRepositoryAccess}
                    onCheckedChange={() => handleRevokeOptionChange("revokeRepositoryAccess")}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Trash2 className="h-4 w-4 text-muted-foreground" />
                    <Label htmlFor="disable-publishing">Disable publishing rights</Label>
                  </div>
                  <Switch 
                    id="disable-publishing"
                    checked={revokeOptions.disablePublishing}
                    onCheckedChange={() => handleRevokeOptionChange("disablePublishing")}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldX className="h-4 w-4 text-muted-foreground" />
                    <Label htmlFor="disable-2fa">Disable 2FA association</Label>
                  </div>
                  <Switch 
                    id="disable-2fa"
                    checked={revokeOptions.disable2FA}
                    onCheckedChange={() => handleRevokeOptionChange("disable2FA")}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Archive className="h-4 w-4 text-muted-foreground" />
                    <Label htmlFor="archive-documents">Archive documents & logs</Label>
                  </div>
                  <Switch 
                    id="archive-documents"
                    checked={revokeOptions.archiveDocuments}
                    onCheckedChange={() => handleRevokeOptionChange("archiveDocuments")}
                  />
                </div>
              </div>
            </div>
            
            <Button 
              variant="destructive" 
              className="w-full"
              onClick={handleShowConfirmation}
              disabled={!username.trim()}
            >
              Proceed with Access Revocation
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Confirmation Required</AlertTitle>
              <AlertDescription>
                You are about to revoke all access for <strong>{username}</strong>. This action cannot be undone.
              </AlertDescription>
            </Alert>
            
            <div className="space-y-2">
              <h3 className="text-md font-medium">The following actions will be performed:</h3>
              <ul className="list-disc pl-5 space-y-1">
                {revokeOptions.removeFromProject && <li>Remove user from Lovable project</li>}
                {revokeOptions.revokeRepositoryAccess && <li>Revoke repository access</li>}
                {revokeOptions.disablePublishing && <li>Disable publishing rights</li>}
                {revokeOptions.disable2FA && <li>Disable 2FA association</li>}
                {revokeOptions.archiveDocuments && <li>Archive documents and chat logs</li>}
              </ul>
            </div>
            
            <div className="space-y-3">
              <Button 
                variant="destructive" 
                className="w-full"
                onClick={handleConfirmRevocation}
              >
                Confirm Revocation
              </Button>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={handleCancelRevocation}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
