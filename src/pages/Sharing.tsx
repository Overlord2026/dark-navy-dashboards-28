
import { useState } from "react";
import { UserRoundPlusIcon } from "lucide-react";
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { AddCollaboratorDialog } from "@/components/sharing/AddCollaboratorDialog";

type Collaborator = {
  id: string;
  name: string;
  email: string;
  role: string;
  accessLevel: "full" | "partial";
  dateAdded: Date;
};

export default function Sharing() {
  const { toast } = useToast();
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const [showAddCollaborator, setShowAddCollaborator] = useState(false);
  
  const handleAddCollaborator = (collaborator: {
    name: string;
    email: string;
    role: string;
    accessLevel: "full" | "partial";
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

  return (
    <ThreeColumnLayout 
      title="Sharing" 
      activeMainItem="sharing"
      secondaryMenuItems={[
        { id: "collaborators", name: "Collaborators", active: true },
        { id: "requests", name: "Pending Requests" },
        { id: "settings", name: "Sharing Settings" },
      ]}
    >
      <div className="space-y-6 w-full max-w-6xl">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Sharing</h1>
          <AddCollaboratorDialog 
            onAddCollaborator={handleAddCollaborator}
            trigger={
              <Button className="bg-white text-black hover:bg-gray-100 border border-gray-300">
                <span>Add Collaborators</span>
              </Button>
            }
          />
        </div>
        
        <section className="space-y-4">
          <div>
            <h2 className="text-xl font-medium">Your Collaborators</h2>
            <p className="text-muted-foreground text-sm">
              Share access with family members and service professionals (e.g., your accountant) by giving them full or 
              partial access.
            </p>
          </div>
          
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
                          <Button variant="ghost" size="sm" className="text-destructive">
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
                <h3 className="text-lg font-medium mb-2">Collaborators</h3>
                <p className="text-muted-foreground text-sm max-w-md mx-auto mb-4">
                  Share access with family members and service professionals (e.g., your accountant) by giving them full or 
                  partial access.
                </p>
                <Button onClick={handleGetStarted} className="bg-white text-black hover:bg-gray-100 border border-gray-300">
                  Get Started
                </Button>
              </div>
            )}
          </Card>
        </section>
      </div>

      <AddCollaboratorDialog 
        onAddCollaborator={handleAddCollaborator}
        isOpen={showAddCollaborator}
        onOpenChange={setShowAddCollaborator}
      />
    </ThreeColumnLayout>
  );
}
