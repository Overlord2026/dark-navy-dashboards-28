
import React from "react";
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
  
  return <FundDetailPanel offering={offering} onClose={onClose} />;
};

export default FundSummaryDialog;
