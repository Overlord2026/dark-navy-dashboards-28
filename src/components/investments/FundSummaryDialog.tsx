
import React from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import FundDetailPanel from "./FundDetailPanel";

interface FundSummaryDialogProps {
  isOpen: boolean;
  onClose: () => void;
  offering: any;
}

const FundSummaryDialog: React.FC<FundSummaryDialogProps> = ({ 
  isOpen, 
  onClose, 
  offering 
}) => {
  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };
  
  return (
    <div 
      className="fixed inset-0 z-50 bg-black/50 flex justify-center items-center"
      onClick={handleBackdropClick}
    >
      <div className="relative w-full max-w-3xl max-h-[90vh] overflow-auto">
        <Button 
          className="absolute top-2 right-2 z-10 rounded-full bg-gray-800 hover:bg-gray-700 p-1"
          size="sm"
          variant="ghost"
          onClick={onClose}
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </Button>
        <FundDetailPanel offering={offering} onClose={onClose} />
      </div>
    </div>
  );
};

export default FundSummaryDialog;
