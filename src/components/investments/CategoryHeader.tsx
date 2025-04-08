
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronLeft, FileText } from "lucide-react";
import { toast } from "sonner";

interface CategoryHeaderProps {
  categoryName: string;
  categoryDescription: string;
  onDownload: () => void;
}

export const CategoryHeader: React.FC<CategoryHeaderProps> = ({
  categoryName,
  categoryDescription,
  onDownload
}) => {
  const navigate = useNavigate();
  
  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Button 
          variant="ghost" 
          size="sm" 
          className="mr-2"
          onClick={() => navigate("/investments?tab=private-market")}
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to Investments
        </Button>
      </div>
      
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">{categoryName}</h1>
          <p className="text-muted-foreground mt-1">{categoryDescription}</p>
        </div>
        <Button 
          variant="outline" 
          size="sm"
          className="flex items-center gap-1"
          onClick={onDownload}
        >
          <FileText className="h-4 w-4 mr-1" />
          Download Fact Sheet
        </Button>
      </div>
    </div>
  );
};
