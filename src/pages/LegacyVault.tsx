
import { useState } from "react";
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";
import { UploadDocumentDialog } from "@/components/documents/UploadDocumentDialog";
import { EditDocumentDialog } from "@/components/documents/EditDocumentDialog";
import { ShareDocumentDialog } from "@/components/documents/ShareDocumentDialog";
import { DeleteDocumentDialog } from "@/components/documents/DeleteDocumentDialog";
import { NewFolderDialog } from "@/components/documents/NewFolderDialog";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import { VaultTabs } from "@/components/vault/VaultTabs";
import { useVaultDialogs } from "@/hooks/useVaultDialogs";
import { toast } from "sonner";

export default function LegacyVault() {
  const {
    isUploadDialogOpen,
    isNewFolderDialogOpen,
    isEditDialogOpen,
    isShareDialogOpen,
    isDeleteDialogOpen,
    selectedDocument,
    setIsUploadDialogOpen,
    setIsNewFolderDialogOpen,
    setIsEditDialogOpen,
    setIsShareDialogOpen,
    setIsDeleteDialogOpen
  } = useVaultDialogs();

  return (
    <ThreeColumnLayout activeMainItem="legacy-vault" title="Secure Family Vault">
      <div className="container mx-auto p-4 space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h1 className="text-2xl font-bold mb-1">Secure Family Vault</h1>
            <p className="text-muted-foreground">Store and organize your important documents securely</p>
          </div>

          <Button
            onClick={() => window.open('https://trustandwill.com', '_blank')}
            variant="outline"
            className="flex items-center mt-4 md:mt-0 bg-white border-primary text-primary hover:bg-primary hover:text-white transition-colors"
          >
            <ExternalLink className="mr-2 h-4 w-4" />
            DIY with Trust & Will
          </Button>
        </div>
        
        <VaultTabs />
      </div>
      
      <UploadDocumentDialog 
        open={isUploadDialogOpen}
        onOpenChange={setIsUploadDialogOpen}
        onClose={() => setIsUploadDialogOpen(false)}
      />
      
      <NewFolderDialog 
        open={isNewFolderDialogOpen}
        onOpenChange={setIsNewFolderDialogOpen}
        onCreateFolder={(name, category) => {
          toast.success("Folder created successfully");
          setIsNewFolderDialogOpen(false);
        }}
      />

      <EditDocumentDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        document={selectedDocument}
        onSave={(doc, newName) => {
          toast.success("Document updated successfully");
          setIsEditDialogOpen(false);
        }}
      />

      <ShareDocumentDialog
        open={isShareDialogOpen}
        onOpenChange={setIsShareDialogOpen}
        document={selectedDocument}
      />

      <DeleteDocumentDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        document={selectedDocument}
        onConfirm={(doc) => {
          toast.success("Document deleted successfully");
          setIsDeleteDialogOpen(false);
        }}
      />
    </ThreeColumnLayout>
  );
}
