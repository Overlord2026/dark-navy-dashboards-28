
import React, { useState } from "react";
import { FileTextIcon, Users2, ShareIcon, BriefcaseIcon, UsersIcon, KeyIcon } from "lucide-react";
import { NavItem } from "@/types/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProfessionalType } from "@/types/professional";
import { useProfessionals } from "@/hooks/useProfessionals";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DocumentType } from "@/types/document";
import { Link } from "react-router-dom";

export const collaborationNavItems: NavItem[] = [
  { 
    title: "Document Sharing", 
    href: "/documents", 
    icon: FileTextIcon 
  },
  { 
    title: "Professional Access", 
    href: "/professionals", 
    icon: Users2 
  },
  { 
    title: "Family Member Access", 
    href: "/sharing", 
    icon: ShareIcon 
  }
];

// Define document categories and their associated professional roles
interface DocumentCategory {
  id: string;
  name: string;
  icon: React.ElementType;
  relevantProfessionals: ProfessionalType[];
  description: string;
  documentTypes: DocumentType[];
}

const documentCategories: DocumentCategory[] = [
  {
    id: "legal",
    name: "Legal Documents",
    icon: FileTextIcon,
    relevantProfessionals: ["Estate Planning Attorney", "Tax Professional / Accountant"],
    description: "Legal agreements, contracts, and estate planning documents",
    documentTypes: ["legal", "document"]
  },
  {
    id: "property",
    name: "Property Records",
    icon: FileTextIcon,
    relevantProfessionals: ["Real Estate Agent / Property Manager"],
    description: "Property deeds, inspection reports, and rental agreements",
    documentTypes: ["property", "document", "image"]
  },
  {
    id: "financial",
    name: "Financial Documents",
    icon: FileTextIcon,
    relevantProfessionals: ["Financial Advisor", "Tax Professional / Accountant"],
    description: "Tax returns, financial statements, and investment documents",
    documentTypes: ["financial", "spreadsheet"]
  },
  {
    id: "insurance",
    name: "Insurance Policies",
    icon: FileTextIcon,
    relevantProfessionals: ["Insurance / LTC Specialist"],
    description: "Insurance policies and claims documentation",
    documentTypes: ["insurance", "document", "pdf"]
  },
  {
    id: "mortgage",
    name: "Mortgage Documents",
    icon: FileTextIcon,
    relevantProfessionals: ["Mortgage Broker", "Real Estate Agent / Property Manager"],
    description: "Mortgage agreements, refinancing documents, and loan applications",
    documentTypes: ["financial", "document"]
  }
];

const CollaborationTab = () => {
  const [selectedRole, setSelectedRole] = useState<ProfessionalType | "all">("all");
  const { professionals } = useProfessionals();

  // Filter document categories based on selected professional role
  const getRelevantCategories = () => {
    if (selectedRole === "all") {
      return documentCategories;
    }
    return documentCategories.filter(category => 
      category.relevantProfessionals.includes(selectedRole as ProfessionalType)
    );
  };

  const relevantCategories = getRelevantCategories();

  return (
    <div className="collaboration-tab p-4">
      <h2 className="text-xl font-semibold mb-4">Collaboration & Sharing</h2>
      
      <Tabs defaultValue="service-pros" className="w-full">
        <TabsList className="mb-4 w-full flex">
          <TabsTrigger value="service-pros" className="flex items-center gap-2 flex-1 justify-center">
            <BriefcaseIcon className="h-4 w-4 flex-shrink-0" />
            <span className="whitespace-nowrap overflow-hidden text-ellipsis">Service Pros</span>
          </TabsTrigger>
          <TabsTrigger value="family-members" className="flex items-center gap-2 flex-1 justify-center">
            <UsersIcon className="h-4 w-4 flex-shrink-0" />
            <span className="whitespace-nowrap overflow-hidden text-ellipsis">Family Members</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="service-pros" className="space-y-4">
          <div className="bg-card rounded-lg p-4 shadow-sm">
            <h3 className="text-lg font-medium mb-3">Professional Document Sharing</h3>
            <p className="text-muted-foreground mb-4">
              Share documents and collaborate with your tax, legal, and financial professionals.
            </p>
            
            {/* Role selector */}
            <div className="mb-4">
              <label className="text-sm text-muted-foreground mb-2 block">
                Filter documents by professional type:
              </label>
              <Select
                value={selectedRole}
                onValueChange={(value) => setSelectedRole(value as ProfessionalType | "all")}
              >
                <SelectTrigger className="w-full max-w-xs">
                  <SelectValue placeholder="Select professional type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Document Types</SelectItem>
                  <SelectItem value="Tax Professional / Accountant">Tax Professional / Accountant</SelectItem>
                  <SelectItem value="Estate Planning Attorney">Estate Planning Attorney</SelectItem>
                  <SelectItem value="Financial Advisor">Financial Advisor</SelectItem>
                  <SelectItem value="Real Estate Agent / Property Manager">Real Estate Agent / Property Manager</SelectItem>
                  <SelectItem value="Insurance / LTC Specialist">Insurance / LTC Specialist</SelectItem>
                  <SelectItem value="Mortgage Broker">Mortgage Broker</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {/* Document categories filtered by role */}
            <div className="grid gap-3">
              {relevantCategories.length > 0 ? (
                relevantCategories.map(category => (
                  <Link 
                    key={category.id}
                    to={`/documents?category=${category.id}`} 
                    className="flex items-center gap-2 p-3 bg-muted/50 rounded-md hover:bg-muted transition-colors"
                  >
                    <category.icon className="h-5 w-5 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium">{category.name}</h4>
                      <p className="text-sm text-muted-foreground">{category.description}</p>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="text-center p-4 border border-dashed rounded-md border-muted">
                  <p className="text-muted-foreground">No relevant documents for this professional type.</p>
                </div>
              )}
              
              {/* Professional access management always visible */}
              <Link to="/professionals" className="flex items-center gap-2 p-3 bg-muted/50 rounded-md hover:bg-muted transition-colors">
                <KeyIcon className="h-5 w-5 flex-shrink-0" />
                <div>
                  <h4 className="font-medium">Professional Access Management</h4>
                  <p className="text-sm text-muted-foreground">Control which professionals can access your documents</p>
                </div>
              </Link>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="family-members" className="space-y-4">
          <div className="bg-card rounded-lg p-4 shadow-sm">
            <h3 className="text-lg font-medium mb-3">Family Collaboration</h3>
            <p className="text-muted-foreground mb-4">
              Share information and collaborate with family members securely.
            </p>
            
            <div className="grid gap-3">
              <Link to="/sharing" className="flex items-center gap-2 p-3 bg-muted/50 rounded-md hover:bg-muted transition-colors">
                <ShareIcon className="h-5 w-5 flex-shrink-0" />
                <div>
                  <h4 className="font-medium">Family Member Access</h4>
                  <p className="text-sm text-muted-foreground">Manage family member permissions</p>
                </div>
              </Link>
              
              <Link to="/documents" className="flex items-center gap-2 p-3 bg-muted/50 rounded-md hover:bg-muted transition-colors">
                <FileTextIcon className="h-5 w-5 flex-shrink-0" />
                <div>
                  <h4 className="font-medium">Shared Family Documents</h4>
                  <p className="text-sm text-muted-foreground">View and manage family-shared documents</p>
                </div>
              </Link>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CollaborationTab;
