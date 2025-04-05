
import { useState } from "react";

/**
 * Custom hook to manage lender selection
 * @returns Lender selection state and functions
 */
export const useLenderSelection = () => {
  const [selectedLender, setSelectedLender] = useState<string | null>(null);
  const [isLenderDetailOpen, setIsLenderDetailOpen] = useState(false);
  
  const handleLenderSelect = (lenderId: string) => {
    setSelectedLender(lenderId);
    setIsLenderDetailOpen(true);
  };
  
  return {
    selectedLender,
    isLenderDetailOpen,
    handleLenderSelect,
    setSelectedLender,
    setIsLenderDetailOpen
  };
};
