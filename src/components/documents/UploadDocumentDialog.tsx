
import { FileText } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FileUpload } from "@/components/ui/file-upload";
import { DocumentCategory } from "@/types/document";

interface UploadDocumentDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onFileUpload: (file: File, customName: string) => void;
  activeCategory: string | null;
  documentCategories: DocumentCategory[];
}

export const UploadDocumentDialog = ({ 
  isOpen, 
  onOpenChange, 
  onFileUpload, 
  activeCategory,
  documentCategories 
}: UploadDocumentDialogProps) => {
  const activeCategoryName = documentCategories.find(c => c.id === activeCategory)?.name || "";

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <FileText className="h-4 w-4" />
          Upload
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Upload Document</DialogTitle>
          <DialogDescription>
            Upload a document to {activeCategoryName}.
          </DialogDescription>
        </DialogHeader>
        
        <FileUpload 
          onFileSelect={onFileUpload}
          onCancel={() => onOpenChange(false)}
          accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
          label="Upload Document"
          buttonText="Browse Files"
          placeholder="Drag and drop your files here or click to browse"
        />
      </DialogContent>
    </Dialog>
  );
};
