import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download, FileText } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Trust, TrustDocument } from "./trusts/types";

interface TrustViewDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  trust: Trust | null;
}

export function TrustViewDialog({ 
  isOpen, 
  onOpenChange, 
  trust 
}: TrustViewDialogProps) {
  if (!trust) return null;

  const handleDownloadDocument = async (trustDocument: TrustDocument) => {
    try {
      console.log('Starting download for document:', trustDocument.file_name);
      
      // For now, we'll create a blob with some sample content since we don't have actual file storage
      // In a real implementation, you would fetch the file from Supabase Storage
      const sampleContent = `This is a placeholder for ${trustDocument.file_name}`;
      const blob = new Blob([sampleContent], { type: trustDocument.content_type || 'application/octet-stream' });
      
      // Create a download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = trustDocument.file_name;
      
      // Trigger the download
      document.body.appendChild(link);
      link.click();
      
      // Clean up
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast.success(`Downloaded ${trustDocument.file_name}`);
    } catch (error) {
      console.error('Error downloading document:', error);
      toast.error(`Failed to download ${trustDocument.file_name}`);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            Trust Details - {trust.trustName}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Trust Information */}
          <div>
            <h3 className="text-lg font-semibold mb-3 text-foreground">Trust Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Trust Name</label>
                <p className="text-foreground">{trust.trustName}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Country</label>
                <p className="text-foreground">{trust.country}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Document Type</label>
                <p className="text-foreground">{trust.documentType}</p>
              </div>
            </div>
          </div>

          {/* Address Information */}
          <div>
            <h3 className="text-lg font-semibold mb-3 text-foreground">Address Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="text-sm font-medium text-muted-foreground">Address</label>
                <p className="text-foreground">{trust.address}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">City</label>
                <p className="text-foreground">{trust.city}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">State</label>
                <p className="text-foreground">{trust.state}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">ZIP Code</label>
                <p className="text-foreground">{trust.zipCode}</p>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="text-lg font-semibold mb-3 text-foreground">Contact Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Phone Number</label>
                <p className="text-foreground">{trust.phoneNumber}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Email Address</label>
                <p className="text-foreground">{trust.emailAddress}</p>
              </div>
            </div>
          </div>

          {/* Documents Section */}
          {trust.documents && trust.documents.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-3 text-foreground">Documents</h3>
              <div className="space-y-2">
                {trust.documents.map((trustDocument) => (
                  <div key={trustDocument.id} className="flex items-center justify-between border rounded-md p-3 bg-muted/50">
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="font-medium text-foreground">{trustDocument.file_name}</p>
                        <p className="text-sm text-muted-foreground">
                          {formatFileSize(trustDocument.file_size)} • {trustDocument.content_type}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDownloadDocument(trustDocument)}
                      className="flex items-center gap-2"
                    >
                      <Download className="h-4 w-4" />
                      Download
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {(!trust.documents || trust.documents.length === 0) && (
            <div>
              <h3 className="text-lg font-semibold mb-3 text-foreground">Documents</h3>
              <p className="text-muted-foreground">No documents attached to this trust.</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
