
import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";
import { MarketplaceShowcase } from "@/components/marketplace/MarketplaceShowcase";
import { EliteMarketplaceHeader } from "@/components/marketplace/EliteMarketplaceHeader";
import { MarketplaceNavigation, serviceCategories } from "@/components/marketplace/MarketplaceNavigation";
import { EliteDirectory } from "@/components/marketplace/EliteDirectory";
import { useMarketplace } from "@/hooks/useMarketplace";

export default function Marketplace() {
  const [searchParams] = useSearchParams();
  const categoryParam = searchParams.get('category');
  
  // Show showcase if no category is selected
  const [showShowcase, setShowShowcase] = useState(!categoryParam);
  const [activeCategory, setActiveCategory] = useState<string>(categoryParam || serviceCategories[0].id);
  const [activeSubcategory, setActiveSubcategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const { categories, listings } = useMarketplace();
  const [filteredListings, setFilteredListings] = useState(listings);

  // Filter listings when search query, category, or subcategory changes
  useEffect(() => {
    let filtered = listings;
    
    // Apply search filter if search query exists
    if (searchQuery.trim() !== "") {
      const searchLower = searchQuery.toLowerCase();
      filtered = filtered.filter(listing => 
        listing.title.toLowerCase().includes(searchLower) || 
        listing.description.toLowerCase().includes(searchLower) || 
        listing.provider.name.toLowerCase().includes(searchLower)
      );
    } else {
      // If no search, filter by category/subcategory
      if (activeSubcategory) {
        filtered = filtered.filter(listing => 
          listing.category === activeCategory && 
          listing.subcategory === activeSubcategory
        );
      } else if (activeCategory !== "all") {
        filtered = filtered.filter(listing => 
          listing.category === activeCategory
        );
      }
    }
    
    setFilteredListings(filtered);
  }, [searchQuery, activeCategory, activeSubcategory, listings]);

  const handleCategoryChange = (categoryId: string) => {
    setActiveCategory(categoryId);
    setActiveSubcategory(null);
    setShowShowcase(false);
    
    if (searchQuery) {
      setSearchQuery("");
    }
  };

  const handleSubcategoryChange = (categoryId: string, subcategoryId: string) => {
    setActiveCategory(categoryId);
    setActiveSubcategory(subcategoryId);
    setShowShowcase(false);
    
    if (searchQuery) {
      setSearchQuery("");
    }
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      setShowShowcase(false);
    }
  };

  if (showShowcase) {
    return (
      <ThreeColumnLayout title="Family Office Marketplace">
        <div className="space-y-6 px-4 py-6 max-w-7xl mx-auto">
          <MarketplaceShowcase />
        </div>
      </ThreeColumnLayout>
    );
  }

  return (
    <ThreeColumnLayout title="Family Office Marketplace">
      <div className="space-y-6 px-4 py-6 max-w-7xl mx-auto">
        <EliteMarketplaceHeader 
          searchQuery={searchQuery}
          setSearchQuery={handleSearchChange}
        />

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="md:col-span-1">
            <MarketplaceNavigation 
              activeCategory={activeCategory}
              activeSubcategory={activeSubcategory}
              onCategoryChange={handleCategoryChange}
              onSubcategoryChange={handleSubcategoryChange}
            />
          </div>
          
          <div className="md:col-span-3">
            <EliteDirectory searchQuery={searchQuery} />
          </div>
        </div>
      </div>
    </ThreeColumnLayout>
  );
}
