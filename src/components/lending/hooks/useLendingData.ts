
import { useState } from "react";
import { loanCategories } from "../data/loanCategories";
import { lenders } from "../data/lenders";
import { LoanCategory, Lender } from "../types";

export function useLendingData() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedLender, setSelectedLender] = useState<string | null>(null);
  const [isLenderDetailOpen, setIsLenderDetailOpen] = useState(false);

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
  };

  const handleLenderSelect = (lenderId: string) => {
    setSelectedLender(lenderId);
    setIsLenderDetailOpen(true);
  };

  const handleCloseLenderDetail = () => {
    setIsLenderDetailOpen(false);
  };

  const selectedCategoryObj = loanCategories.find(cat => cat.id === selectedCategory) || null;
  
  const filteredLenders = selectedCategory 
    ? lenders.filter(lender => lender.category === selectedCategoryObj?.title) 
    : [];

  return {
    loanCategories,
    selectedCategory,
    selectedCategoryObj,
    filteredLenders,
    selectedLender,
    isLenderDetailOpen,
    handleCategorySelect,
    handleLenderSelect,
    handleCloseLenderDetail,
    getSelectedLenderData: () => selectedLender ? lenders.find(l => l.id === selectedLender) || null : null
  };
}
