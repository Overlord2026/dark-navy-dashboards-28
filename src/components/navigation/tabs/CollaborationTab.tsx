
import React from "react";
import { FileTextIcon, Users2, ShareIcon, BriefcaseIcon, UsersIcon } from "lucide-react";
import { NavItem } from "@/types/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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

const CollaborationTab = () => {
  return (
    <div className="collaboration-tab p-4">
      <h2 className="text-xl font-semibold mb-4">Collaboration & Sharing</h2>
      
      <Tabs defaultValue="service-pros" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="service-pros" className="flex items-center gap-2">
            <BriefcaseIcon className="h-4 w-4" />
            Service Pros
          </TabsTrigger>
          <TabsTrigger value="family-members" className="flex items-center gap-2">
            <UsersIcon className="h-4 w-4" />
            Family Members
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="service-pros" className="space-y-4">
          <div className="bg-card rounded-lg p-4 shadow-sm">
            <h3 className="text-lg font-medium mb-3">Professional Document Sharing</h3>
            <p className="text-muted-foreground mb-4">
              Share documents and collaborate with your tax, legal, and financial professionals.
            </p>
            
            <div className="grid gap-3">
              <a href="/documents" className="flex items-center gap-2 p-3 bg-muted/50 rounded-md hover:bg-muted transition-colors">
                <FileTextIcon className="h-5 w-5" />
                <div>
                  <h4 className="font-medium">Document Sharing</h4>
                  <p className="text-sm text-muted-foreground">Share documents with professionals</p>
                </div>
              </a>
              
              <a href="/professionals" className="flex items-center gap-2 p-3 bg-muted/50 rounded-md hover:bg-muted transition-colors">
                <Users2 className="h-5 w-5" />
                <div>
                  <h4 className="font-medium">Professional Access</h4>
                  <p className="text-sm text-muted-foreground">Manage professional access permissions</p>
                </div>
              </a>
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
              <a href="/sharing" className="flex items-center gap-2 p-3 bg-muted/50 rounded-md hover:bg-muted transition-colors">
                <ShareIcon className="h-5 w-5" />
                <div>
                  <h4 className="font-medium">Family Member Access</h4>
                  <p className="text-sm text-muted-foreground">Manage family member permissions</p>
                </div>
              </a>
              
              <a href="/documents" className="flex items-center gap-2 p-3 bg-muted/50 rounded-md hover:bg-muted transition-colors">
                <FileTextIcon className="h-5 w-5" />
                <div>
                  <h4 className="font-medium">Shared Family Documents</h4>
                  <p className="text-sm text-muted-foreground">View and manage family-shared documents</p>
                </div>
              </a>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CollaborationTab;
