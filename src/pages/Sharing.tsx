
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { UserRoundPlusIcon, Share2, Users, FileText, ShieldCheck } from "lucide-react";
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { AddCollaboratorDialog } from "@/components/sharing/AddCollaboratorDialog";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";

type Collaborator = {
  id: string;
  name: string;
  email: string;
  role: string;
  accessLevel: "full" | "limited";
  dateAdded: Date;
};

export default function Sharing() {
  const { toast } = useToast();
  const { sectionId } = useParams<{ sectionId: string }>();
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const [showAddCollaborator, setShowAddCollaborator] = useState(false);
  
  const activeSecondaryItem = sectionId || "collaborators";
  
  const handleAddCollaborator = (collaborator: {
    name: string;
    email: string;
    role: string;
    accessLevel: "full" | "limited";
  }) => {
    const newCollaborator: Collaborator = {
      id: `collab-${Math.random().toString(36).substring(2, 9)}`,
      name: collaborator.name,
      email: collaborator.email,
      role: collaborator.role,
      accessLevel: collaborator.accessLevel,
      dateAdded: new Date(),
    };
    
    setCollaborators([...collaborators, newCollaborator]);
    
    toast({
      title: "Invitation sent",
      description: `An invitation has been sent to ${collaborator.email}`,
    });
  };
  
  const handleGetStarted = () => {
    setShowAddCollaborator(true);
  };

  const handleRemoveCollaborator = (id: string) => {
    setCollaborators(collaborators.filter(collaborator => collaborator.id !== id));
    toast({
      title: "Collaborator removed",
      description: "The collaborator has been removed successfully.",
    });
  };

  return (
    <ThreeColumnLayout 
      title="Family Sharing" 
      activeMainItem="sharing"
    >
      <div className="space-y-6 w-full max-w-6xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Family Sharing</h1>
            <p className="text-muted-foreground mt-1">
              Share access with family members and manage permissions
            </p>
          </div>
          <Button 
            onClick={() => setShowAddCollaborator(true)}
            className="flex items-center gap-2"
          >
            <UserRoundPlusIcon size={16} />
            Add Family Member
          </Button>
        </div>
        
        <Tabs defaultValue="members" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="members" className="flex gap-2 items-center">
              <Users size={16} />
              <span>Family Members</span>
            </TabsTrigger>
            <TabsTrigger value="shared-content" className="flex gap-2 items-center">
              <FileText size={16} />
              <span>Shared Content</span>
            </TabsTrigger>
            <TabsTrigger value="access-settings" className="flex gap-2 items-center">
              <ShieldCheck size={16} />
              <span>Access Settings</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="members" className="space-y-4">
            <Card className="border border-border/30 p-6">
              {collaborators.length > 0 ? (
                <div className="space-y-4">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2">Name</th>
                        <th className="text-left p-2">Email</th>
                        <th className="text-left p-2">Role</th>
                        <th className="text-left p-2">Access Level</th>
                        <th className="text-left p-2">Date Added</th>
                        <th className="text-right p-2">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {collaborators.map((collaborator) => (
                        <tr key={collaborator.id} className="border-b border-border/30">
                          <td className="p-2">{collaborator.name}</td>
                          <td className="p-2">{collaborator.email}</td>
                          <td className="p-2">{collaborator.role}</td>
                          <td className="p-2 capitalize">{collaborator.accessLevel}</td>
                          <td className="p-2">
                            {collaborator.dateAdded.toLocaleDateString()}
                          </td>
                          <td className="p-2 text-right">
                            <Button variant="ghost" size="sm">Edit</Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="text-destructive"
                              onClick={() => handleRemoveCollaborator(collaborator.id)}
                            >
                              Remove
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-10">
                  <Users size={48} className="mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Family Members Added</h3>
                  <p className="text-muted-foreground text-sm max-w-md mx-auto mb-4">
                    Share access with your family members by inviting them to collaborate on financial planning, document access, and more.
                  </p>
                  <Button onClick={handleGetStarted}>
                    Add Family Member
                  </Button>
                </div>
              )}
            </Card>
          </TabsContent>
          
          <TabsContent value="shared-content">
            <Card className="border border-border/30 p-6">
              <h2 className="text-xl font-medium mb-4">Shared Content</h2>
              <div className="p-8 border border-dashed border-border rounded-lg flex flex-col items-center justify-center">
                <Share2 size={48} className="text-muted-foreground mb-4" />
                <p className="text-center mb-2">No content shared with family members yet</p>
                <Button variant="outline">Share Content</Button>
              </div>
            </Card>
          </TabsContent>
          
          <TabsContent value="access-settings">
            <Card className="border border-border/30 p-6">
              <h2 className="text-xl font-medium mb-4">Access Settings</h2>
              <p className="text-muted-foreground mb-4">
                Control what information each family member can view and edit.
              </p>
              <div className="p-8 border border-dashed border-border rounded-lg flex flex-col items-center justify-center">
                <ShieldCheck size={48} className="text-muted-foreground mb-4" />
                <p className="text-center mb-2">No custom access settings configured</p>
                <Button variant="outline">Configure Access Settings</Button>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <AddCollaboratorDialog 
        onAddCollaborator={handleAddCollaborator}
        isOpen={showAddCollaborator}
        onOpenChange={setShowAddCollaborator}
      />
    </ThreeColumnLayout>
  );
}
