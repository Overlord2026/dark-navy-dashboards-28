
import { useState } from "react";
import { Lender } from "@/data/lending/lenders";
import { 
  getPaginatedLenders, 
  calculateTotalPages 
} from "@/utils/lendingUtils";

/**
 * Custom hook to manage lending pagination
 * @param lenders List of lenders to paginate
 * @returns Pagination state and functions
 */
export const useLendingPagination = (lenders: Lender[]) => {
  const [currentPage, setCurrentPage] = useState(1);
  
  const totalPages = calculateTotalPages(lenders.length);
  const paginatedLenders = getPaginatedLenders(lenders, currentPage);
  
  const handlePageChange = (direction: 'next' | 'prev') => {
    if (direction === 'next' && currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    } else if (direction === 'prev' && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };
  
  const resetPagination = () => {
    setCurrentPage(1);
  };

  return {
    currentPage,
    paginatedLenders,
    totalPages,
    handlePageChange,
    resetPagination
  };
};
