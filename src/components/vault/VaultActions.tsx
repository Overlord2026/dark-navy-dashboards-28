
import React from "react";
import { Button } from "@/components/ui/button";
import { FolderPlus, Upload } from "lucide-react";

export function VaultActions() {
  return (
    <div className="flex justify-end space-x-4">
      <Button 
        variant="outline"
        className="flex items-center"
        onClick={() => window.dispatchEvent(new CustomEvent('open-new-folder-dialog'))}
      >
        <FolderPlus className="mr-2 h-4 w-4" />
        New Folder
      </Button>
      
      <Button 
        className="flex items-center"
        onClick={() => window.dispatchEvent(new CustomEvent('open-upload-dialog'))}
      >
        <Upload className="mr-2 h-4 w-4" />
        Upload
      </Button>
    </div>
  );
}
