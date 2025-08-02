import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Users, Share2, Eye, Edit, MessageSquare, UserPlus, Settings, Shield, Mail } from "lucide-react";
import { toast } from "sonner";

interface PropertyCollaborator {
  id: string;
  name: string;
  email: string;
  role: "owner" | "co_owner" | "advisor" | "accountant" | "attorney" | "realtor" | "property_manager" | "family_member" | "viewer";
  permissions: {
    view: boolean;
    edit: boolean;
    share: boolean;
    financials: boolean;
    documents: boolean;
  };
  invitedAt: string;
  lastAccess?: string;
  status: "active" | "pending" | "inactive";
  avatar?: string;
}

interface PropertyAccess {
  propertyId: string;
  propertyName: string;
  visibility: "private" | "family_only" | "professionals_only" | "public";
  allowInvites: boolean;
  requireApproval: boolean;
  collaborators: PropertyCollaborator[];
}

export const PropertyCollaboration: React.FC = () => {
  const [properties] = useState<PropertyAccess[]>([
    {
      propertyId: "1",
      propertyName: "Sunset Apartment",
      visibility: "family_only",
      allowInvites: true,
      requireApproval: true,
      collaborators: [
        {
          id: "1",
          name: "John Smith",
          email: "john@smith.com",
          role: "owner",
          permissions: { view: true, edit: true, share: true, financials: true, documents: true },
          invitedAt: "2024-01-15",
          lastAccess: "2024-02-14",
          status: "active",
          avatar: "/placeholder-avatar.jpg"
        },
        {
          id: "2", 
          name: "Sarah Johnson",
          email: "sarah@example.com",
          role: "accountant",
          permissions: { view: true, edit: false, share: false, financials: true, documents: true },
          invitedAt: "2024-02-01",
          lastAccess: "2024-02-13",
          status: "active"
        },
        {
          id: "3",
          name: "Michael Chen",
          email: "michael@attorney.com", 
          role: "attorney",
          permissions: { view: true, edit: false, share: false, financials: false, documents: true },
          invitedAt: "2024-02-05",
          status: "pending"
        }
      ]
    },
    {
      propertyId: "2",
      propertyName: "Downtown Condo",
      visibility: "private",
      allowInvites: false,
      requireApproval: false,
      collaborators: [
        {
          id: "1",
          name: "John Smith",
          email: "john@smith.com",
          role: "owner",
          permissions: { view: true, edit: true, share: true, financials: true, documents: true },
          invitedAt: "2024-01-15",
          lastAccess: "2024-02-14",
          status: "active"
        }
      ]
    }
  ]);

  const [selectedProperty, setSelectedProperty] = useState(properties[0]);
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);
  const [isSettingsDialogOpen, setIsSettingsDialogOpen] = useState(false);

  const roleColors = {
    owner: "default",
    co_owner: "default", 
    advisor: "secondary",
    accountant: "outline",
    attorney: "outline",
    realtor: "outline",
    property_manager: "outline",
    family_member: "secondary",
    viewer: "outline"
  };

  const statusColors = {
    active: "default",
    pending: "secondary", 
    inactive: "outline"
  };

  const formatRole = (role: string) => {
    return role.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const handleInviteCollaborator = () => {
    toast.success("Invitation sent successfully!");
    setIsInviteDialogOpen(false);
  };

  const handleRemoveCollaborator = (collaboratorId: string) => {
    toast.success("Collaborator removed successfully!");
  };

  const handleUpdatePermissions = (collaboratorId: string, permissions: any) => {
    toast.success("Permissions updated successfully!");
  };

  const getVisibilityDescription = (visibility: string) => {
    switch (visibility) {
      case "private":
        return "Only you can access this property";
      case "family_only":
        return "Family office members can view and request access";
      case "professionals_only":
        return "Verified professionals can view and request access";
      case "public":
        return "Anyone in the marketplace can view this property";
      default:
        return "";
    }
  };

  return (
    <div className="space-y-6">
      {/* Property Selector */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Share2 className="h-5 w-5" />
            Property Collaboration
          </CardTitle>
          <CardDescription>
            Manage who can access and collaborate on your properties
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Label htmlFor="property-select">Select Property:</Label>
            <Select 
              value={selectedProperty.propertyId} 
              onValueChange={(value) => {
                const property = properties.find(p => p.propertyId === value);
                if (property) setSelectedProperty(property);
              }}
            >
              <SelectTrigger className="w-64">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {properties.map((property) => (
                  <SelectItem key={property.propertyId} value={property.propertyId}>
                    {property.propertyName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Property Settings */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Visibility Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Badge variant="outline" className="mb-2">
                  {selectedProperty.visibility.replace('_', ' ').toUpperCase()}
                </Badge>
                <p className="text-sm text-muted-foreground">
                  {getVisibilityDescription(selectedProperty.visibility)}
                </p>
              </div>
              <Dialog open={isSettingsDialogOpen} onOpenChange={setIsSettingsDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Settings className="h-4 w-4 mr-2" />
                    Change Settings
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Property Privacy Settings</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label>Visibility Level</Label>
                      <Select defaultValue={selectedProperty.visibility}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="private">Private</SelectItem>
                          <SelectItem value="family_only">Family Only</SelectItem>
                          <SelectItem value="professionals_only">Professionals Only</SelectItem>
                          <SelectItem value="public">Public</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="allow-invites">Allow Invitations</Label>
                      <Switch id="allow-invites" defaultChecked={selectedProperty.allowInvites} />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="require-approval">Require Approval</Label>
                      <Switch id="require-approval" defaultChecked={selectedProperty.requireApproval} />
                    </div>
                    <Button className="w-full">Save Changes</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Quick Stats</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Total Collaborators</span>
                <span className="font-medium">{selectedProperty.collaborators.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Active</span>
                <span className="font-medium text-green-600">
                  {selectedProperty.collaborators.filter(c => c.status === "active").length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Pending</span>
                <span className="font-medium text-yellow-600">
                  {selectedProperty.collaborators.filter(c => c.status === "pending").length}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Dialog open={isInviteDialogOpen} onOpenChange={setIsInviteDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="w-full" size="sm">
                    <UserPlus className="h-4 w-4 mr-2" />
                    Invite Collaborator
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Invite New Collaborator</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="email">Email Address</Label>
                      <Input id="email" type="email" placeholder="collaborator@example.com" />
                    </div>
                    <div>
                      <Label htmlFor="role">Role</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="family_member">Family Member</SelectItem>
                          <SelectItem value="advisor">Financial Advisor</SelectItem>
                          <SelectItem value="accountant">Accountant</SelectItem>
                          <SelectItem value="attorney">Attorney</SelectItem>
                          <SelectItem value="realtor">Real Estate Agent</SelectItem>
                          <SelectItem value="property_manager">Property Manager</SelectItem>
                          <SelectItem value="viewer">Viewer Only</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="message">Personal Message (Optional)</Label>
                      <Textarea 
                        id="message" 
                        placeholder="Add a personal note to your invitation..."
                        className="min-h-[80px]"
                      />
                    </div>
                    <Button className="w-full" onClick={handleInviteCollaborator}>
                      <Mail className="h-4 w-4 mr-2" />
                      Send Invitation
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
              
              <Button variant="outline" className="w-full" size="sm">
                <MessageSquare className="h-4 w-4 mr-2" />
                Send Message
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Collaborators List */}
      <Card>
        <CardHeader>
          <CardTitle>Collaborators</CardTitle>
          <CardDescription>
            People who have access to {selectedProperty.propertyName}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {selectedProperty.collaborators.map((collaborator) => (
              <div key={collaborator.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <Avatar>
                    <AvatarImage src={collaborator.avatar} alt={collaborator.name} />
                    <AvatarFallback>
                      {collaborator.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium">{collaborator.name}</h3>
                      {collaborator.role === "owner" && (
                        <Shield className="h-4 w-4 text-yellow-500" />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{collaborator.email}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant={roleColors[collaborator.role] as any}>
                        {formatRole(collaborator.role)}
                      </Badge>
                      <Badge variant={statusColors[collaborator.status] as any}>
                        {collaborator.status}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="text-right text-xs text-muted-foreground">
                    {collaborator.lastAccess ? (
                      <p>Last active: {new Date(collaborator.lastAccess).toLocaleDateString()}</p>
                    ) : (
                      <p>Never accessed</p>
                    )}
                    <p>Invited: {new Date(collaborator.invitedAt).toLocaleDateString()}</p>
                  </div>
                  
                  {collaborator.role !== "owner" && (
                    <div className="flex gap-1">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button size="sm" variant="outline">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Edit Permissions - {collaborator.name}</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div className="space-y-3">
                              {Object.entries(collaborator.permissions).map(([permission, enabled]) => (
                                <div key={permission} className="flex items-center justify-between">
                                  <Label htmlFor={`${collaborator.id}-${permission}`}>
                                    {permission.charAt(0).toUpperCase() + permission.slice(1)}
                                  </Label>
                                  <Switch 
                                    id={`${collaborator.id}-${permission}`}
                                    defaultChecked={enabled}
                                  />
                                </div>
                              ))}
                            </div>
                            <Button className="w-full">Save Changes</Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                      
                      <Button 
                        size="sm" 
                        variant="destructive"
                        onClick={() => handleRemoveCollaborator(collaborator.id)}
                      >
                        Remove
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {selectedProperty.collaborators.length === 0 && (
            <div className="text-center py-8">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-medium mb-2">No collaborators yet</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Invite family members, advisors, or professionals to collaborate on this property
              </p>
              <Button onClick={() => setIsInviteDialogOpen(true)}>
                <UserPlus className="h-4 w-4 mr-2" />
                Invite First Collaborator
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};