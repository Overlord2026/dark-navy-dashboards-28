
import React from 'react';
import { Button } from '@/components/ui/button';
import { Upload, FileQuestion } from 'lucide-react';

interface NoDocumentsStateProps {
  onUploadClick: () => void;
  categoryName?: string;
  title?: string;
  description?: string;
}

export const NoDocumentsState: React.FC<NoDocumentsStateProps> = ({ 
  onUploadClick, 
  categoryName,
  title,
  description
}) => {
  const displayTitle = title || `No documents found in ${categoryName || "this category"}`;
  const displayDescription = description || "Upload your first document to get started";
  
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <div className="mb-4 rounded-full bg-muted p-3">
        <FileQuestion size={24} className="text-muted-foreground" />
      </div>
      <h3 className="mb-2 text-lg font-semibold">{displayTitle}</h3>
      <p className="mb-4 text-sm text-muted-foreground max-w-md">{displayDescription}</p>
      <Button onClick={onUploadClick} className="gap-2">
        <Upload size={16} />
        Upload Document
      </Button>
    </div>
  );
};

export const NoCategorySelectedState: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <div className="mb-4 rounded-full bg-muted p-3">
        <FileQuestion size={24} className="text-muted-foreground" />
      </div>
      <h3 className="mb-2 text-lg font-semibold">Select a category</h3>
      <p className="mb-4 text-sm text-muted-foreground max-w-md">
        Choose a document category from the sidebar to view related documents
      </p>
    </div>
  );
};
