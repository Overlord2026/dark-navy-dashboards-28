
import { useState } from "react";

/**
 * Custom hook to manage lending navigation tabs
 * @returns Tab navigation state and functions
 */
export const useLendingNavigation = () => {
  const [activeTab, setActiveTab] = useState("categories");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setActiveTab("lenders");
  };
  
  const handleBack = () => {
    if (activeTab === "lenders") {
      setActiveTab("categories");
      setSelectedCategory(null);
    }
  };
  
  return {
    activeTab,
    selectedCategory,
    handleCategorySelect,
    handleBack,
    setActiveTab,
    setSelectedCategory
  };
};
