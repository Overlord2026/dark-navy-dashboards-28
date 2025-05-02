
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileUpload } from "@/components/ui/file-upload";
import { v4 as uuidv4 } from "uuid";
import { VaultDocument, DocumentType } from "@/types/vault";

interface DocumentUploadFormProps {
  onNotify: (documents: VaultDocument[]) => Promise<void>;
}

export const DocumentUploadForm: React.FC<DocumentUploadFormProps> = ({ onNotify }) => {
  const [documents, setDocuments] = useState<VaultDocument[]>([
    {
      id: uuidv4(),
      documentType: "Will",
      description: "",
      fileName: "",
      fileSize: "",
      uploadDate: new Date().toLocaleDateString()
    }
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleDocumentChange = (index: number, field: keyof VaultDocument, value: string) => {
    const updatedDocuments = [...documents];
    updatedDocuments[index][field] = value as any;
    setDocuments(updatedDocuments);
  };

  const handleFileChange = (index: number, file: File) => {
    const updatedDocuments = [...documents];
    updatedDocuments[index].fileName = file.name;
    updatedDocuments[index].fileSize = `${(file.size / (1024 * 1024)).toFixed(2)} MB`;
    setDocuments(updatedDocuments);
  };

  const addDocument = () => {
    setDocuments([
      ...documents,
      {
        id: uuidv4(),
        documentType: "Will",
        description: "",
        fileName: "",
        fileSize: "",
        uploadDate: new Date().toLocaleDateString()
      }
    ]);
  };

  const removeDocument = (index: number) => {
    if (documents.length > 1) {
      const updatedDocuments = [...documents];
      updatedDocuments.splice(index, 1);
      setDocuments(updatedDocuments);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!documents.every(doc => doc.documentType && doc.description && doc.fileName)) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      await onNotify(documents);
    } catch (error) {
      console.error("Error notifying advisor:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {documents.map((document, index) => (
        <div 
          key={document.id} 
          className="bg-[#0F1E3A] p-6 rounded-lg border border-[#2A3E5C] mb-4"
        >
          <div className="flex justify-between mb-4">
            <h3 className="text-lg font-medium text-white">Document #{index + 1}</h3>
            {documents.length > 1 && (
              <Button 
                type="button"
                variant="outline" 
                size="sm" 
                onClick={() => removeDocument(index)}
                className="text-red-400 hover:text-red-300 border-red-500"
              >
                Remove
              </Button>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">
                Document Type <span className="text-red-500">*</span>
              </label>
              <Select
                value={document.documentType}
                onValueChange={(value) => handleDocumentChange(index, "documentType", value as DocumentType)}
              >
                <SelectTrigger className="bg-[#172A47] border-[#2A3E5C] text-white">
                  <SelectValue placeholder="Select document type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Will">Will</SelectItem>
                  <SelectItem value="Trust">Trust</SelectItem>
                  <SelectItem value="Power of Attorney">Power of Attorney</SelectItem>
                  <SelectItem value="Insurance Policy">Insurance Policy</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">
                Description <span className="text-red-500">*</span>
              </label>
              <Input
                value={document.description}
                onChange={(e) => handleDocumentChange(index, "description", e.target.value)}
                placeholder="Brief description of the document"
                required
                className="bg-[#172A47] border-[#2A3E5C] text-white"
              />
            </div>
            
            <div className="space-y-2 col-span-2">
              <label className="block text-sm font-medium text-gray-300">
                File Upload <span className="text-red-500">*</span>
              </label>
              <FileUpload
                onFileChange={(file) => handleFileChange(index, file)}
                accept=".pdf,.docx"
                className="w-full"
              />
              {document.fileName && (
                <p className="text-sm text-gray-400 mt-1">
                  Selected: {document.fileName} ({document.fileSize})
                </p>
              )}
            </div>
          </div>
        </div>
      ))}
      
      <div className="flex space-x-4">
        <Button 
          type="button"
          variant="outline" 
          onClick={addDocument}
          className="border-[#4C6385] text-[#4C6385] hover:bg-[#172A47] hover:text-white"
        >
          Add Another Document
        </Button>
        
        <Button 
          type="submit"
          variant="advisor"
          disabled={isSubmitting}
          className="bg-[#1EAEDB] hover:bg-[#1EAEDB]/90 text-white font-medium"
        >
          {isSubmitting ? "Notifying Advisor..." : "Notify My Advisor"}
        </Button>
      </div>
    </form>
  );
};
