
import React, { useState } from "react";
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { FileText, ShieldCheck, Users2 } from "lucide-react";
import { ProfessionalType } from "@/types/professional";
import { ProfessionalsProvider } from "@/context/ProfessionalsContext";
import { AddProfessionalDialog } from "@/components/professionals/AddProfessionalDialog";
import { ShareDocumentWithProfessionalsDialog } from "@/components/professionals/ShareDocumentWithProfessionalsDialog";
import { UploadDocumentDialog } from "@/components/documents/UploadDocumentDialog";
import { ProfessionalsHeader } from "@/components/professionals/ProfessionalsHeader";
import { ProfessionalsTabContent } from "@/components/professionals/tabs/ProfessionalsTabContent";
import { DocumentsTabContent } from "@/components/professionals/tabs/DocumentsTabContent";
import { PermissionsTabContent } from "@/components/professionals/tabs/PermissionsTabContent";

export default function Professionals() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [professionalType, setProfessionalType] = useState<ProfessionalType>("Tax Professional / Accountant");
  const [activeTab, setActiveTab] = useState("professionals");

  return (
    <ThreeColumnLayout activeMainItem="client-professionals" title="Service Professionals">
      <ProfessionalsProvider>
        <div className="space-y-6 animate-fade-in">
          <ProfessionalsHeader onAddProfessional={() => setIsAddDialogOpen(true)} />

          <Tabs defaultValue="professionals" onValueChange={setActiveTab} className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="professionals" className="flex gap-2 items-center">
                <Users2 size={16} />
                <span>Professionals</span>
              </TabsTrigger>
              <TabsTrigger value="documents" className="flex gap-2 items-center">
                <FileText size={16} />
                <span>Shared Documents</span>
              </TabsTrigger>
              <TabsTrigger 
                value="permissions" 
                className="flex gap-2 items-center opacity-50 cursor-not-allowed relative"
                disabled
              >
                <ShieldCheck size={16} />
                <span>Permissions</span>
                <Badge variant="warning" className="ml-2 text-xs px-2 py-0.5 bg-yellow-500 text-black">
                  Coming Soon
                </Badge>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="professionals">
              {activeTab === "professionals" && (
                <ProfessionalsTabContent 
                  professionalType={professionalType}
                  setProfessionalType={setProfessionalType}
                />
              )}
            </TabsContent>
            
            <TabsContent value="documents">
              <DocumentsTabContent 
                onUpload={() => setIsUploadDialogOpen(true)}
                onShare={() => setIsShareDialogOpen(true)}
              />
            </TabsContent>
            
            <TabsContent value="permissions">
              <PermissionsTabContent />
            </TabsContent>
          </Tabs>

          <AddProfessionalDialog 
            isOpen={isAddDialogOpen}
            onOpenChange={setIsAddDialogOpen}
          />

          <ShareDocumentWithProfessionalsDialog
            open={isShareDialogOpen}
            onOpenChange={setIsShareDialogOpen}
          />

          <UploadDocumentDialog
            open={isUploadDialogOpen}
            onClose={() => setIsUploadDialogOpen(false)}
            category="professional-documents"
          />
        </div>
      </ProfessionalsProvider>
    </ThreeColumnLayout>
  );
}
