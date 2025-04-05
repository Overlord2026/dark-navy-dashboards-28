
import { loanCategories } from "@/data/lending/loanCategories";
import { lenders } from "@/data/lending/lenders";
import { filterLendersByCategory } from "@/utils/lendingUtils";
import { useLendingNavigation } from "@/hooks/lending/useLendingNavigation";
import { useLendingPagination } from "@/hooks/lending/useLendingPagination";
import { useLenderSelection } from "@/hooks/lending/useLenderSelection";

/**
 * Main hook that combines all lending data and functionality
 * @returns All lending data and functions
 */
export const useLendingData = () => {
  // Use the smaller, more focused hooks
  const {
    activeTab,
    selectedCategory,
    handleCategorySelect,
    handleBack,
    setActiveTab,
    setSelectedCategory
  } = useLendingNavigation();
  
  // Filter lenders based on selected category
  const filteredLenders = filterLendersByCategory(lenders, selectedCategory);
  
  // Use the pagination hook with the filtered lenders
  const {
    currentPage,
    paginatedLenders,
    totalPages,
    handlePageChange,
    resetPagination
  } = useLendingPagination(filteredLenders);
  
  // Use the lender selection hook
  const {
    selectedLender,
    isLenderDetailOpen,
    handleLenderSelect,
    setSelectedLender,
    setIsLenderDetailOpen
  } = useLenderSelection();

  // Return all the data and functions needed
  return {
    // Data
    loanCategories,
    lenders,
    
    // Navigation state and functions
    activeTab,
    selectedCategory,
    handleCategorySelect,
    handleBack,
    
    // Pagination state and functions
    currentPage,
    paginatedLenders,
    totalPages,
    handlePageChange,
    
    // Lender selection state and functions
    selectedLender,
    isLenderDetailOpen,
    handleLenderSelect,
    setIsLenderDetailOpen
  };
};

// Re-export types from data files for convenience
export type { LoanCategory } from "@/data/lending/loanCategories";
export type { Lender } from "@/data/lending/lenders";
