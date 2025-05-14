
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Shield, FolderPlus, Upload } from "lucide-react";

interface HealthcareDocumentsHeaderProps {
  onNavigateBack: () => void;
  onNewFolderClick: () => void;
  onUploadClick: () => void;
}

export const HealthcareDocumentsHeader: React.FC<HealthcareDocumentsHeaderProps> = ({
  onNavigateBack,
  onNewFolderClick,
  onUploadClick
}) => {
  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-2">
        <Button 
          variant="ghost" 
          size="sm"
          onClick={onNavigateBack}
          className="flex items-center gap-1"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Shield className="h-5 w-5 text-blue-500" />
            Healthcare Documents
          </h2>
          <p className="text-sm text-muted-foreground">
            Securely store and share your sensitive health information
          </p>
        </div>
      </div>
      
      <div className="flex space-x-2">
        <Button
          variant="outline"
          onClick={onNewFolderClick}
          className="flex items-center gap-2"
        >
          <FolderPlus className="h-4 w-4" />
          New Folder
        </Button>
        
        <Button
          onClick={onUploadClick}
          className="flex items-center gap-2"
        >
          <Upload className="h-4 w-4" />
          Upload
        </Button>
      </div>
    </div>
  );
};
