
import { Folder, Upload, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  onUploadClick: () => void;
  categoryName?: string;
}

export const NoCategorySelectedState = () => {
  return (
    <div className="h-[300px] flex flex-col items-center justify-center mt-6">
      <div className="text-center max-w-md mx-auto">
        <Folder className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
        <h3 className="text-xl font-medium mb-2">Select a category</h3>
        <p className="text-muted-foreground mb-6">
          Please select a document category from the list.
        </p>
      </div>
    </div>
  );
};

export const NoDocumentsState = ({ onUploadClick, categoryName }: EmptyStateProps) => {
  return (
    <div className="h-[300px] flex flex-col items-center justify-center">
      <div className="text-center max-w-md mx-auto">
        <div className="w-14 h-14 rounded-full bg-blue-500/10 flex items-center justify-center mx-auto mb-4">
          <PlusCircle className="h-8 w-8 text-blue-500" />
        </div>
        <h3 className="text-xl font-medium mb-2">No files</h3>
        <p className="text-muted-foreground mb-6">
          You haven't uploaded any files to {categoryName}
        </p>
        <Button 
          onClick={onUploadClick}
          className="flex items-center gap-2 bg-[#1B1B32] text-white hover:bg-[#2D2D4A] border-0"
        >
          <Upload className="h-5 w-5" />
          Upload Documents
        </Button>
      </div>
    </div>
  );
};
