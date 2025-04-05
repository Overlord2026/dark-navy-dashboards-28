
import { useState } from "react";
import { loanCategories } from "@/data/lending/loanCategories";
import { lenders } from "@/data/lending/lenders";
import { 
  filterLendersByCategory, 
  getPaginatedLenders, 
  calculateTotalPages 
} from "@/utils/lendingUtils";

/**
 * Custom hook to manage lending data and state
 * @returns Loan categories, lenders, and state management functions
 */
export const useLendingData = () => {
  // State management
  const [activeTab, setActiveTab] = useState("categories");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedLender, setSelectedLender] = useState<string | null>(null);
  const [isLenderDetailOpen, setIsLenderDetailOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // Event handlers
  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setActiveTab("lenders");
    setCurrentPage(1);
  };

  const handleLenderSelect = (lenderId: string) => {
    setSelectedLender(lenderId);
    setIsLenderDetailOpen(true);
  };

  const handleBack = () => {
    if (activeTab === "lenders") {
      setActiveTab("categories");
      setSelectedCategory(null);
    }
  };

  // Filter and paginate lenders
  const filteredLenders = filterLendersByCategory(lenders, selectedCategory);
  
  const handlePageChange = (direction: 'next' | 'prev') => {
    const totalPages = calculateTotalPages(filteredLenders.length);
    
    if (direction === 'next' && currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    } else if (direction === 'prev' && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const paginatedLenders = getPaginatedLenders(filteredLenders, currentPage);
  const totalPages = calculateTotalPages(filteredLenders.length);

  // Return all the data and functions needed
  return {
    loanCategories,
    lenders,
    activeTab,
    selectedCategory,
    selectedLender,
    isLenderDetailOpen,
    currentPage,
    paginatedLenders,
    totalPages,
    handleCategorySelect,
    handleLenderSelect,
    handleBack,
    handlePageChange,
    setIsLenderDetailOpen
  };
};

// Re-export types from data files for convenience
export type { LoanCategory } from "@/data/lending/loanCategories";
export type { Lender } from "@/data/lending/lenders";
