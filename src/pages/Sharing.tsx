
import { useState, useEffect } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { UserRoundPlusIcon, Users, BriefcaseIcon, ChevronLeft, InfoIcon } from "lucide-react";
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { AddCollaboratorDialog } from "@/components/sharing/AddCollaboratorDialog";

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
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const [showAddCollaborator, setShowAddCollaborator] = useState(false);
  const [addStep, setAddStep] = useState<"info" | "access">("info");
  const [addType, setAddType] = useState<"family" | "professional" | null>(null);
  
  // Check for "add" parameter in the URL
  useEffect(() => {
    const addParam = searchParams.get('add');
    if (addParam === 'family' || addParam === 'professional') {
      setAddType(addParam);
      setShowAddCollaborator(true);
      // Remove the parameter from URL after processing
      searchParams.delete('add');
      setSearchParams(searchParams);
    }
  }, [searchParams, setSearchParams]);

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

  const handleRemoveCollaborator = (id: string) => {
    setCollaborators(collaborators.filter(collaborator => collaborator.id !== id));
    toast({
      title: "Collaborator removed",
      description: "The collaborator has been removed successfully.",
    });
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
                
                {addStep === "info" ? (
                  <div>
                    <h2 className="text-xl font-medium mb-4">Add Collaborator</h2>
                    <p className="text-gray-400 mb-6">Tell us who you want to collaborate with.</p>
                    
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-gray-400 text-sm mb-1">First Name</label>
                          <input 
                            type="text" 
                            className="w-full p-2 bg-transparent border border-gray-700 rounded-md text-white focus:border-gray-500 focus:outline-none"
                            placeholder="First Name" 
                          />
                        </div>
                        <div>
                          <label className="block text-gray-400 text-sm mb-1">Last Name</label>
                          <input 
                            type="text" 
                            className="w-full p-2 bg-transparent border border-gray-700 rounded-md text-white focus:border-gray-500 focus:outline-none"
                            placeholder="Last Name"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-gray-400 text-sm mb-1">Email</label>
                        <input 
                          type="email" 
                          className="w-full p-2 bg-transparent border border-gray-700 rounded-md text-white focus:border-gray-500 focus:outline-none"
                          placeholder="Email"
                        />
                      </div>
                    </div>
                    
                    <div className="flex justify-between mt-8">
                      <Button 
                        variant="ghost" 
                        className="border border-white/20 hover:bg-gray-800 text-white"
                        onClick={() => setShowAddCollaborator(false)}
                      >
                        Cancel
                      </Button>
                      
                      <Button 
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                        onClick={() => setAddStep("access")}
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <h2 className="text-xl font-medium mb-4">Add Type and Access</h2>
                    <p className="text-gray-400 mb-6">
                      Choose the collaborator's type and access level. You can always change this later.
                    </p>
                    
                    <div className="bg-[#0c1428] p-6 rounded-md space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-white mb-2">
                          Collaborator Type
                        </label>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="w-full justify-between bg-transparent border-gray-700 text-white">
                              Select collaborator type
                              <ChevronLeft className="h-4 w-4 rotate-90" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent className="w-full min-w-[240px]">
                            {addType === "family" || addType === null ? (
                              <>
                                <div className="px-2 py-1.5 text-sm font-medium text-gray-400">Family Member</div>
                                <DropdownMenuItem>Spouse</DropdownMenuItem>
                                <DropdownMenuItem>Son</DropdownMenuItem>
                                <DropdownMenuItem>Daughter</DropdownMenuItem>
                                <DropdownMenuItem>Father</DropdownMenuItem>
                                <DropdownMenuItem>Mother</DropdownMenuItem>
                                <DropdownMenuItem>Brother</DropdownMenuItem>
                                <DropdownMenuItem>Sister</DropdownMenuItem>
                                <DropdownMenuItem>Other Family Member</DropdownMenuItem>
                              </>
                            ) : null}
                            
                            {addType === "professional" || addType === null ? (
                              <>
                                <div className="px-2 py-1.5 text-sm font-medium text-gray-400">Service Professional</div>
                                <DropdownMenuItem>Accountant</DropdownMenuItem>
                                <DropdownMenuItem>Financial Advisor</DropdownMenuItem>
                                <DropdownMenuItem>Estate Lawyer</DropdownMenuItem>
                                <DropdownMenuItem>Insurance Agent</DropdownMenuItem>
                                <DropdownMenuItem>Tax Professional</DropdownMenuItem>
                                <DropdownMenuItem>Property Manager</DropdownMenuItem>
                                <DropdownMenuItem>Other Professional</DropdownMenuItem>
                              </>
                            ) : null}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      
                      <div>
                        <label className="flex items-center gap-1 text-sm font-medium text-white mb-2">
                          Access
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger>
                                <InfoIcon className="w-4 h-4 text-gray-400" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p className="max-w-xs">Full access allows viewing and editing. Limited access allows viewing only.</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </label>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="w-full justify-between bg-transparent border-gray-700 text-white">
                              Select access level
                              <ChevronLeft className="h-4 w-4 rotate-90" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem>Full Access</DropdownMenuItem>
                            <DropdownMenuItem>Limited Access</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                    
                    <div className="flex justify-between mt-8">
                      <Button 
                        variant="ghost"
                        className="border border-white/20 hover:bg-gray-800 text-white"
                        onClick={() => setShowAddCollaborator(false)}
                      >
                        Cancel
                      </Button>
                      
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          className="border border-white/20 hover:bg-gray-800 text-white"
                          onClick={() => setAddStep("info")}
                        >
                          Back
                        </Button>
                        <Button 
                          className="bg-blue-600 hover:bg-blue-700 text-white"
                          onClick={() => {
                            toast({
                              title: "Invitation sent",
                              description: "Your collaborator will receive an email with instructions to access your shared information."
                            });
                            setShowAddCollaborator(false);
                            setAddStep("info");
                          }}
                        >
                          Send Invitation
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
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
                  Share access with family members and service professionals (e.g., your accountant) by giving them full or partial access.
                </p>
                
                <div className="tabs flex border-b border-gray-700 mb-6">
                  <button className="px-6 py-3 font-medium text-blue-400 border-b-2 border-blue-400 -mb-px flex items-center gap-2">
                    <Users size={18} />
                    Family Members
                  </button>
                  <button className="px-6 py-3 font-medium text-gray-400 hover:text-gray-300 flex items-center gap-2">
                    <BriefcaseIcon size={18} />
                    Service Professionals
                  </button>
                </div>
                
                {collaborators.length > 0 ? (
                  <div className="rounded-lg overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-gray-900/40">
                        <tr>
                          <th className="text-left p-3 text-sm font-medium text-gray-400">Name</th>
                          <th className="text-left p-3 text-sm font-medium text-gray-400">Email</th>
                          <th className="text-left p-3 text-sm font-medium text-gray-400">Role</th>
                          <th className="text-left p-3 text-sm font-medium text-gray-400">Access Level</th>
                          <th className="text-left p-3 text-sm font-medium text-gray-400">Date Added</th>
                          <th className="text-right p-3 text-sm font-medium text-gray-400">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-800">
                        {collaborators.map((collaborator) => (
                          <tr key={collaborator.id} className="hover:bg-gray-900/30">
                            <td className="p-3">{collaborator.name}</td>
                            <td className="p-3">{collaborator.email}</td>
                            <td className="p-3">{collaborator.role}</td>
                            <td className="p-3 capitalize">{collaborator.accessLevel}</td>
                            <td className="p-3">
                              {collaborator.dateAdded.toLocaleDateString()}
                            </td>
                            <td className="p-3 text-right">
                              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">Edit</Button>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="text-red-400 hover:text-red-300"
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
                  <div className="text-center py-10 bg-[#071429] rounded-lg border border-gray-800">
                    <Users size={60} className="mx-auto text-blue-500/60 mb-4" />
                    <h3 className="text-xl font-medium mb-3">No Family Members Added</h3>
                    <p className="text-gray-400 text-base max-w-md mx-auto mb-6">
                      Share access with your family members by inviting them to collaborate on financial planning, document access, and more.
                    </p>
                    <Button 
                      onClick={() => {
                        setAddType("family");
                        setShowAddCollaborator(true);
                      }}
                      size="lg" 
                      className="px-6 bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      Get Started
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </ThreeColumnLayout>
  );
}
