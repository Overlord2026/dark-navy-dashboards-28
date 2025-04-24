
import { useState, useEffect } from "react";
import { DocumentItem } from "@/types/document";
import { toast } from "sonner";

export const useVaultDialogs = () => {
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [isNewFolderDialogOpen, setIsNewFolderDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<DocumentItem | null>(null);

  useEffect(() => {
    const openUploadDialog = () => setIsUploadDialogOpen(true);
    const openNewFolderDialog = () => setIsNewFolderDialogOpen(true);
    const openEditDialog = (e: CustomEvent<DocumentItem>) => {
      setSelectedDocument(e.detail);
      setIsEditDialogOpen(true);
    };
    const openShareDialog = (e: CustomEvent<DocumentItem>) => {
      setSelectedDocument(e.detail);
      setIsShareDialogOpen(true);
    };
    const openDeleteDialog = (e: CustomEvent<DocumentItem>) => {
      setSelectedDocument(e.detail);
      setIsDeleteDialogOpen(true);
    };

    window.addEventListener('open-upload-dialog', openUploadDialog);
    window.addEventListener('open-new-folder-dialog', openNewFolderDialog);
    window.addEventListener('open-edit-dialog', openEditDialog as EventListener);
    window.addEventListener('open-share-dialog', openShareDialog as EventListener);
    window.addEventListener('open-delete-dialog', openDeleteDialog as EventListener);

    return () => {
      window.removeEventListener('open-upload-dialog', openUploadDialog);
      window.removeEventListener('open-new-folder-dialog', openNewFolderDialog);
      window.removeEventListener('open-edit-dialog', openEditDialog as EventListener);
      window.removeEventListener('open-share-dialog', openShareDialog as EventListener);
      window.removeEventListener('open-delete-dialog', openDeleteDialog as EventListener);
    };
  }, []);

  return {
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
  };
};
