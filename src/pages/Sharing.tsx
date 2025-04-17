
import { useState, useEffect } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { UserRoundPlusIcon, ChevronLeft } from "lucide-react";
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { CollaboratorInfoStep } from "@/components/sharing/CollaboratorInfoStep";
import { CollaboratorAccessStep } from "@/components/sharing/CollaboratorAccessStep";
import { CollaboratorsTable } from "@/components/sharing/CollaboratorsTable";
import { EmptyCollaborators } from "@/components/sharing/EmptyCollaborators";
import { Collaborator, CollaboratorFormData } from "@/components/sharing/types";

const formSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  role: z.string().min(1, "Role is required"),
  collaboratorType: z.string().min(1, "Collaborator type is required"),
  accessLevel: z.enum(["full", "limited"]),
});

export default function Sharing() {
  const { toast } = useToast();
  const { sectionId } = useParams<{ sectionId: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const [showAddCollaborator, setShowAddCollaborator] = useState(false);
  const [addStep, setAddStep] = useState<"info" | "access">("info");
  const [addType, setAddType] = useState<"family" | null>("family");
  
  const form = useForm<CollaboratorFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      role: "",
      collaboratorType: "",
      accessLevel: "limited",
    },
  });

  useEffect(() => {
    const addParam = searchParams.get('add');
    if (addParam === 'family') {
      setAddType("family");
      setShowAddCollaborator(true);
      searchParams.delete('add');
      setSearchParams(searchParams);
    }
  }, [searchParams, setSearchParams]);

  const handleAddCollaborator = (data: CollaboratorFormData) => {
    const newCollaborator: Collaborator = {
      id: `collab-${Math.random().toString(36).substring(2, 9)}`,
      name: `${data.firstName} ${data.lastName}`,
      email: data.email,
      role: data.collaboratorType,
      accessLevel: data.accessLevel,
      dateAdded: new Date(),
    };
    
    setCollaborators([...collaborators, newCollaborator]);
    
    toast({
      title: "Invitation sent",
      description: `An invitation has been sent to ${data.email}`,
    });
    
    form.reset();
    setShowAddCollaborator(false);
    setAddStep("info");
  };

  const handleRemoveCollaborator = (id: string) => {
    setCollaborators(collaborators.filter(collaborator => collaborator.id !== id));
    toast({
      title: "Collaborator removed",
      description: "The collaborator has been removed successfully.",
    });
  };

  const onSubmit = (data: CollaboratorFormData) => {
    if (addStep === "info") {
      setAddStep("access");
      return;
    }
    handleAddCollaborator(data);
  };

  return (
    <ThreeColumnLayout 
      title="Sharing" 
      activeMainItem="sharing"
    >
      <div className="bg-[#010e20] text-white min-h-screen">
        <div className="max-w-6xl mx-auto p-6">
          {showAddCollaborator ? (
            <div className="space-y-6">
              <div className="flex items-center text-sm text-gray-400">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="hover:bg-[#071c38] text-gray-400"
                  onClick={() => {
                    setShowAddCollaborator(false);
                    setAddStep("info");
                  }}
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Back to Sharing
                </Button>
              </div>
              
              <h1 className="text-2xl font-bold">Sharing</h1>
              
              <div className="bg-[#061527] border border-gray-800 rounded-lg p-6">
                <div className="flex items-center justify-center gap-2 mb-8">
                  <div className={`flex items-center ${addStep === "info" ? "text-white" : "text-gray-500"}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-2 ${addStep === "info" ? "bg-white text-[#010e20]" : "bg-gray-700 text-gray-300"}`}>
                      1
                    </div>
                    <span>Add Collaborator</span>
                  </div>
                  
                  <div className="w-10 h-px bg-gray-700"></div>
                  
                  <div className={`flex items-center ${addStep === "access" ? "text-white" : "text-gray-500"}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-2 ${addStep === "access" ? "bg-white text-[#010e20]" : "bg-gray-700 text-gray-300"}`}>
                      2
                    </div>
                    <span>Access & Type</span>
                  </div>
                </div>
                
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  {addStep === "info" ? (
                    <CollaboratorInfoStep form={form} />
                  ) : (
                    <CollaboratorAccessStep form={form} />
                  )}
                  
                  <div className="flex justify-between pt-4">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => {
                        setShowAddCollaborator(false);
                        setAddStep("info");
                        form.reset();
                      }}
                      className="border border-white/20 bg-transparent text-white hover:bg-gray-800"
                    >
                      Cancel
                    </Button>
                    
                    <div className="flex gap-2">
                      {addStep === "access" && (
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setAddStep("info")}
                          className="border border-white/20 bg-transparent text-white hover:bg-gray-800"
                        >
                          Back
                        </Button>
                      )}
                      
                      <Button 
                        type="submit"
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        {addStep === "info" ? "Next" : "Send Invitation"}
                      </Button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">Sharing</h1>
                <Button 
                  onClick={() => setShowAddCollaborator(true)}
                  className="bg-white text-[#010e20] hover:bg-gray-200 flex items-center gap-2"
                >
                  <UserRoundPlusIcon size={16} />
                  Add Collaborators
                </Button>
              </div>
              
              <div className="bg-[#061527] border border-gray-800 rounded-lg p-6">
                <h2 className="text-xl font-medium mb-3">Your Collaborators</h2>
                <p className="text-gray-400 mb-6">
                  Share access with family members by inviting them to collaborate on financial planning, document access, and more.
                </p>
                
                {collaborators.length > 0 ? (
                  <CollaboratorsTable 
                    collaborators={collaborators} 
                    onRemove={handleRemoveCollaborator} 
                  />
                ) : (
                  <EmptyCollaborators />
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </ThreeColumnLayout>
  );
}
