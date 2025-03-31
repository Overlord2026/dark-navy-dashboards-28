
import { Button } from "@/components/ui/button";
import { FileText, Upload } from "lucide-react";

interface EmptyStatesProps {
  category: string;
  onUpload: () => void;
}

export function EmptyStates({ category, onUpload }: EmptyStatesProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-border rounded-lg min-h-[300px]">
      <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
        <FileText className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="text-xl font-medium mb-2">No documents found</h3>
      <p className="text-muted-foreground text-center max-w-md mb-6">
        {category === "All Documents" 
          ? "You don't have any documents uploaded yet." 
          : `You don't have any documents in the ${category} category.`}
      </p>
      <Button onClick={onUpload} className="flex items-center">
        <Upload className="h-4 w-4 mr-2" />
        Upload Document
      </Button>
    </div>
  );
}
