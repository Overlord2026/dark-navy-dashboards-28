
import { FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  onUploadClick: () => void;
  categoryName?: string;
}

export const NoCategorySelectedState = () => {
  return (
    <div className="dashboard-card h-[400px] flex flex-col items-center justify-center mt-6">
      <div className="text-center max-w-md mx-auto">
        <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
        <h3 className="text-xl font-medium mb-2">Select a category</h3>
        <p className="text-muted-foreground mb-6">
          Please select a document category from the list above.
        </p>
      </div>
    </div>
  );
};

export const NoDocumentsState = ({ onUploadClick, categoryName }: EmptyStateProps) => {
  return (
    <div className="dashboard-card h-[400px] flex flex-col items-center justify-center">
      <div className="text-center max-w-md mx-auto">
        <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
        <h3 className="text-xl font-medium mb-2">No files</h3>
        <p className="text-muted-foreground mb-6">
          You haven't uploaded any files to {categoryName}.
        </p>
        <Button 
          className="gap-2"
          onClick={onUploadClick}
        >
          <FileText className="h-4 w-4" />
          Upload Document
        </Button>
      </div>
    </div>
  );
};
