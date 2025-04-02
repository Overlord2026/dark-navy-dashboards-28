
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { DocumentItem, DocumentPermission, HealthcareAccessLevel, healthcareProfessionalRoles } from "@/types/document";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TrashIcon, PlusCircle, ShieldAlert, Users, UserPlus } from "lucide-react";
import { toast } from "sonner";
import { auditLog } from "@/services/auditLog/auditLogService";

interface HealthcareDocumentPermissionsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  document: DocumentItem | null;
}

export function HealthcareDocumentPermissions({
  open,
  onOpenChange,
  document
}: HealthcareDocumentPermissionsProps) {
  const [newEmail, setNewEmail] = useState("");
  const [newName, setNewName] = useState("");
  const [newRole, setNewRole] = useState("");
  const [newAccessLevel, setNewAccessLevel] = useState<HealthcareAccessLevel>("view");
  const [permissions, setPermissions] = useState<DocumentPermission[]>([]);
  const [isAddingPermission, setIsAddingPermission] = useState(false);
  
  const userId = "Tom Brady"; // In a real app, this would come from auth context

  // Update permissions when document changes
  React.useEffect(() => {
    if (document && document.permissions) {
      setPermissions([...document.permissions]);
    } else {
      setPermissions([]);
    }
  }, [document]);

  const handleAddPermission = () => {
    if (!newEmail || !newName || !newRole) {
      toast.error("Please fill out all fields");
      return;
    }

    const newPermission: DocumentPermission = {
      userId: newEmail,
      userEmail: newEmail,
      userName: newName,
      userRole: newRole,
      accessLevel: newAccessLevel,
      grantedBy: userId,
      grantedAt: new Date().toISOString()
    };

    setPermissions([...permissions, newPermission]);
    
    // Log permission change in audit trail
    auditLog.log(
      userId,
      "permission_change",
      "success",
      {
        userName: userId,
        resourceId: document?.id,
        resourceType: "healthcare_document_permissions",
        details: {
          action: "add_permission",
          grantedTo: newName,
          grantedEmail: newEmail,
          accessLevel: newAccessLevel,
          documentName: document?.name
        }
      }
    );
    
    toast.success("Permission added successfully");
    setNewEmail("");
    setNewName("");
    setNewRole("");
    setNewAccessLevel("view");
    setIsAddingPermission(false);
  };

  const handleRemovePermission = (userEmail: string) => {
    const updatedPermissions = permissions.filter(p => p.userEmail !== userEmail);
    setPermissions(updatedPermissions);
    
    // Log permission change in audit trail
    auditLog.log(
      userId,
      "permission_change",
      "success",
      {
        userName: userId,
        resourceId: document?.id,
        resourceType: "healthcare_document_permissions",
        details: {
          action: "remove_permission",
          revokedFrom: userEmail,
          documentName: document?.name
        }
      }
    );
    
    toast.success("Permission removed");
  };

  const handleClose = () => {
    // In a real app, this would save the permissions back to the document
    onOpenChange(false);
  };

  const getAccessLevelBadge = (accessLevel: HealthcareAccessLevel) => {
    switch (accessLevel) {
      case "none":
        return <Badge variant="outline" className="bg-gray-200 text-gray-800">No Access</Badge>;
      case "view":
        return <Badge variant="outline" className="bg-blue-100 text-blue-800">View Only</Badge>;
      case "edit":
        return <Badge variant="outline" className="bg-amber-100 text-amber-800">Can Edit</Badge>;
      case "full":
        return <Badge variant="outline" className="bg-green-100 text-green-800">Full Access</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl overflow-y-auto max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ShieldAlert className="h-5 w-5 text-blue-500" />
            Document Privacy Settings
          </DialogTitle>
          <DialogDescription>
            {document?.name && (
              <>Manage who can access "<span className="font-medium">{document.name}</span>"</>
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Current permissions section */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium flex items-center gap-2">
                <Users className="h-4 w-4" />
                Current Access
              </h3>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setIsAddingPermission(true)}
                className="flex items-center gap-1"
              >
                <UserPlus className="h-4 w-4" />
                Add Person
              </Button>
            </div>
            
            {permissions.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Access Level</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {permissions.map((permission, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{permission.userName}</TableCell>
                      <TableCell>{permission.userEmail}</TableCell>
                      <TableCell>{permission.userRole}</TableCell>
                      <TableCell>{getAccessLevelBadge(permission.accessLevel)}</TableCell>
                      <TableCell className="text-right">
                        {/* Don't allow removing owner's access */}
                        {permission.accessLevel !== "full" && (
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => handleRemovePermission(permission.userEmail || "")}
                          >
                            <TrashIcon className="h-4 w-4 text-red-500" />
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-8 border rounded-md bg-muted/20">
                <p className="text-sm text-muted-foreground">
                  No one else has access to this document
                </p>
              </div>
            )}
          </div>
          
          {/* Add new permission form */}
          {isAddingPermission && (
            <div className="border rounded-md p-4 space-y-4 bg-muted/10">
              <h4 className="font-medium flex items-center gap-2">
                <PlusCircle className="h-4 w-4" />
                Grant Access
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="new-name">Name</Label>
                  <Input
                    id="new-name"
                    placeholder="Enter name"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="new-email">Email</Label>
                  <Input
                    id="new-email"
                    type="email"
                    placeholder="Enter email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="new-role">Role</Label>
                  <Select value={newRole} onValueChange={setNewRole}>
                    <SelectTrigger id="new-role">
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      {healthcareProfessionalRoles.map((role) => (
                        <SelectItem key={role} value={role}>{role}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="new-access-level">Access Level</Label>
                  <Select value={newAccessLevel} onValueChange={(value) => setNewAccessLevel(value as HealthcareAccessLevel)}>
                    <SelectTrigger id="new-access-level">
                      <SelectValue placeholder="Select access level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No Access</SelectItem>
                      <SelectItem value="view">View Only</SelectItem>
                      <SelectItem value="edit">Can Edit</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsAddingPermission(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddPermission}>
                  Add Permission
                </Button>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button onClick={handleClose}>
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
