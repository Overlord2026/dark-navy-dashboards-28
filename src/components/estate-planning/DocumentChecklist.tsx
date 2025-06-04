
import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  FileText, 
  Upload, 
  Share2, 
  Eye, 
  CheckCircle2, 
  Clock,
  Plus
} from "lucide-react";
import { toast } from "sonner";

interface Document {
  id: string;
  name: string;
  description: string;
  status: 'completed' | 'notStarted';
  url?: string;
  date?: Date;
  uploadedBy?: string;
  sharedWith?: string[];
}

interface DocumentChecklistProps {
  onUploadDocument?: (documentType: string) => void;
  documents: Document[];
}

const documentTypes = [
  {
    id: "will",
    name: "Last Will and Testament",
    description: "Legal document specifying how assets should be distributed"
  },
  {
    id: "trust",
    name: "Living Trust",
    description: "Trust document for asset management during lifetime"
  },
  {
    id: "power-of-attorney",
    name: "Power of Attorney",
    description: "Legal authority for financial and legal decisions"
  },
  {
    id: "healthcare-directive",
    name: "Healthcare Directive",
    description: "Medical care preferences and healthcare proxy"
  },
  {
    id: "beneficiary-designations",
    name: "Beneficiary Designations",
    description: "Updated beneficiaries for all accounts and policies"
  },
  {
    id: "insurance-policies",
    name: "Insurance Policies",
    description: "Life, disability, and long-term care insurance documents"
  },
  {
    id: "financial-statements",
    name: "Financial Statements",
    description: "Recent bank, investment, and retirement account statements"
  },
  {
    id: "property-deeds",
    name: "Property Deeds",
    description: "Real estate ownership and title documents"
  },
  {
    id: "business-documents",
    name: "Business Documents",
    description: "Business ownership, partnership agreements, and succession plans"
  }
];

export const DocumentChecklist: React.FC<DocumentChecklistProps> = ({
  onUploadDocument,
  documents
}) => {
  const handleDirectUpload = (documentType: string) => {
    // Create a hidden file input
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png';
    fileInput.style.display = 'none';
    
    fileInput.onchange = (event) => {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (file) {
        // Simulate upload process
        toast.success("Document uploaded successfully", {
          description: `"${file.name}" has been added to your documents.`
        });
        
        // Call the upload handler if provided
        if (onUploadDocument) {
          onUploadDocument(documentType);
        }
      }
    };
    
    // Trigger file selector
    document.body.appendChild(fileInput);
    fileInput.click();
    document.body.removeChild(fileInput);
  };

  const handleShare = (documentId: string) => {
    toast.info("Share functionality would open here");
  };

  const handleView = (documentId: string) => {
    toast.info("Document viewer would open here");
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-4">
        {documentTypes.map((docType) => {
          const document = documents.find(doc => doc.id === docType.id);
          const isCompleted = document?.status === 'completed';
          
          return (
            <div
              key={docType.id}
              className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-start gap-3 flex-1 min-w-0">
                <div className="flex-shrink-0 mt-1">
                  {isCompleted ? (
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                  ) : (
                    <Clock className="h-5 w-5 text-muted-foreground" />
                  )}
                </div>
                
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-medium text-sm sm:text-base leading-tight">
                      {docType.name}
                    </h3>
                    <Badge 
                      variant={isCompleted ? "default" : "secondary"} 
                      className="text-xs flex-shrink-0"
                    >
                      {isCompleted ? "Complete" : "Pending"}
                    </Badge>
                  </div>
                  
                  <p className="text-sm text-muted-foreground leading-relaxed break-words">
                    {docType.description}
                  </p>
                  
                  {document && isCompleted && (
                    <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground mt-2">
                      {document.uploadedBy && (
                        <span>Uploaded by {document.uploadedBy}</span>
                      )}
                      {document.date && (
                        <span>• {document.date.toLocaleDateString()}</span>
                      )}
                      {document.sharedWith && document.sharedWith.length > 0 && (
                        <span>• Shared with {document.sharedWith.length} contact{document.sharedWith.length > 1 ? 's' : ''}</span>
                      )}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex items-center gap-2 flex-shrink-0 ml-4">
                {isCompleted ? (
                  <>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleView(document!.id)}
                      className="h-8 w-8 p-0"
                      title="View document"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleShare(document!.id)}
                      className="h-8 w-8 p-0"
                      title="Share document"
                    >
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDirectUpload(docType.id)}
                    className="flex items-center gap-1 text-xs px-3 py-1.5"
                  >
                    <Upload className="h-3 w-3" />
                    <span className="hidden sm:inline">Upload</span>
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
