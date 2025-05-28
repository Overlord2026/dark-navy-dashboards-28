
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download, FileText } from "lucide-react";
import { z } from "zod";

const trustSchema = z.object({
  trustName: z.string().min(1, { message: "Trust name is required." }),
  country: z.string().min(1, { message: "Country is required." }),
  address: z.string().min(1, { message: "Address is required." }),
  city: z.string().min(1, { message: "City is required." }),
  state: z.string().min(1, { message: "State is required." }),
  zipCode: z.string().min(1, { message: "Zip code is required." }),
  phoneNumber: z.string().min(1, { message: "Phone number is required." }),
  emailAddress: z.string().email({ message: "Valid email is required." }),
  documentType: z.string().min(1, { message: "Document type is required." }),
});

interface TrustDocument {
  id: string;
  file_name: string;
  file_path: string;
  file_size: number;
  content_type: string;
}

interface TrustViewDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  trust: (z.infer<typeof trustSchema> & { 
    documents?: TrustDocument[] 
  }) | null;
}

export function TrustViewDialog({ 
  isOpen, 
  onOpenChange, 
  trust 
}: TrustViewDialogProps) {
  if (!trust) return null;

  const handleDownloadDocument = (document: TrustDocument) => {
    // In a real application, this would download the file from Supabase Storage
    // For now, we'll show a placeholder message
    console.log('Downloading document:', document.file_name);
    alert(`Download functionality for ${document.file_name} would be implemented here.`);
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
                {trust.documents.map((document) => (
                  <div key={document.id} className="flex items-center justify-between border rounded-md p-3 bg-muted/50">
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="font-medium text-foreground">{document.file_name}</p>
                        <p className="text-sm text-muted-foreground">
                          {formatFileSize(document.file_size)} • {document.content_type}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDownloadDocument(document)}
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
