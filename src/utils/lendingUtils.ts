
import { loanCategories } from "@/data/lending/loanCategories";
import { Lender } from "@/data/lending/lenders";

/**
 * Filter lenders based on selected category
 * @param lenders List of all lenders
 * @param categoryId Selected category ID
 * @returns Filtered list of lenders
 */
export const filterLendersByCategory = (
  lenders: Lender[], 
  categoryId: string | null
): Lender[] => {
  if (!categoryId) return [];
  
  const categoryTitle = loanCategories.find(cat => cat.id === categoryId)?.title;
  return lenders.filter(lender => lender.category === categoryTitle);
};

/**
 * Get paginated lenders
 * @param lenders List of lenders to paginate
 * @param currentPage Current page number
 * @param pageSize Number of items per page
 * @returns Paginated list of lenders
 */
export const getPaginatedLenders = (
  lenders: Lender[],
  currentPage: number,
  pageSize: number = 2
): Lender[] => {
  const startIndex = (currentPage - 1) * pageSize;
  return lenders.slice(startIndex, startIndex + pageSize);
};

/**
 * Calculate total number of pages
 * @param totalItems Total number of items
 * @param pageSize Number of items per page
 * @returns Total number of pages
 */
export const calculateTotalPages = (totalItems: number, pageSize: number = 2): number => {
  return Math.ceil(totalItems / pageSize);
};
