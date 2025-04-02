
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FileUpload } from "@/components/ui/file-upload";
import { Copy, Check, Share2, FileText, LinkIcon } from "lucide-react";
import { DocumentItem } from "@/types/document";
import { toast } from "sonner";

interface ChecklistItem {
  id: string;
  title: string;
  completed: boolean;
  documents: DocumentItem[];
  subItems?: {
    id: string;
    title: string;
    completed: boolean;
  }[];
  expanded?: boolean;
}

interface DocumentDialogsProps {
  openUploadDialog: boolean;
  setOpenUploadDialog: (open: boolean) => void;
  openShareDialog: boolean;
  setOpenShareDialog: (open: boolean) => void;
  openViewDialog: boolean;
  setOpenViewDialog: (open: boolean) => void;
  selectedCategory: ChecklistItem | null;
  selectedDocument: DocumentItem | null;
  handleUpload: (file: File) => void;
  handleShare: () => void;
  generateShareLink: () => string | undefined;
  copyLinkToClipboard: () => Promise<void>;
  shareEmail: string;
  setShareEmail: (email: string) => void;
  shareLink: string;
  copySuccess: boolean;
}

export const DocumentDialogs: React.FC<DocumentDialogsProps> = ({
  openUploadDialog,
  setOpenUploadDialog,
  openShareDialog,
  setOpenShareDialog,
  openViewDialog,
  setOpenViewDialog,
  selectedCategory,
  selectedDocument,
  handleUpload,
  handleShare,
  generateShareLink,
  copyLinkToClipboard,
  shareEmail,
  setShareEmail,
  shareLink,
  copySuccess,
}) => {
  return (
    <>
      <Dialog open={openUploadDialog} onOpenChange={setOpenUploadDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload Document to {selectedCategory?.title}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Category</Label>
              <div className="p-2 bg-muted/30 rounded-md">
                {selectedCategory?.title}
              </div>
            </div>
            <div className="space-y-2">
              <Label>Select Document</Label>
              <FileUpload 
                onFileChange={handleUpload}
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              />
              <p className="text-xs text-muted-foreground">
                Accepted formats: PDF, Word, JPG, PNG
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenUploadDialog(false)}>Cancel</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Dialog open={openShareDialog} onOpenChange={setOpenShareDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Share Document</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Document</Label>
              <div className="p-2 bg-muted/30 rounded-md">
                {selectedDocument?.name}
              </div>
            </div>
            
            <div className="border-t pt-4">
              <h4 className="font-medium mb-2">Share by Email</h4>
              <div className="space-y-2">
                <Label htmlFor="share-email">Email Address</Label>
                <Input 
                  id="share-email" 
                  type="email" 
                  placeholder="Enter email address" 
                  value={shareEmail}
                  onChange={(e) => setShareEmail(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  This person will receive an email with a secure link to view this document.
                </p>
                <Button 
                  onClick={handleShare} 
                  disabled={!shareEmail}
                  size="sm"
                  className="w-full mt-1"
                >
                  Send Email Invitation
                </Button>
              </div>
            </div>
            
            <div className="border-t pt-4">
              <h4 className="font-medium mb-2">Create Shareable Link</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Input 
                    value={shareLink} 
                    placeholder="Generate a shareable link"
                    readOnly
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={copyLinkToClipboard}
                    className="flex-shrink-0"
                  >
                    {copySuccess ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Anyone with this link can view the document. Links expire after 30 days.
                </p>
                {!shareLink && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={generateShareLink}
                    className="w-full mt-1"
                  >
                    <LinkIcon className="h-4 w-4 mr-2" />
                    Generate Link
                  </Button>
                )}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenShareDialog(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Dialog open={openViewDialog} onOpenChange={setOpenViewDialog}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{selectedDocument?.name}</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <div className="bg-muted/20 p-4 rounded-md h-[400px] flex items-center justify-center">
              <div className="text-center">
                <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  Document preview would appear here in a production environment
                </p>
                <div className="mt-4 text-sm">
                  <p><strong>Name:</strong> {selectedDocument?.name}</p>
                  <p><strong>Uploaded:</strong> {selectedDocument?.dateUploaded}</p>
                  <p><strong>Size:</strong> {selectedDocument?.size}</p>
                  <p><strong>Category:</strong> {selectedCategory?.title}</p>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter className="flex justify-between">
            <Button variant="outline" onClick={() => setOpenViewDialog(false)}>Close</Button>
            <div className="flex gap-2">
              <Button onClick={() => {
                setOpenViewDialog(false);
                setTimeout(() => {
                  if (selectedCategory && selectedDocument) {
                    setOpenShareDialog(true);
                  }
                }, 100);
              }}>
                <Share2 className="h-4 w-4 mr-2" />
                Share Document
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
