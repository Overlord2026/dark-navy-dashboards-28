
import React, { useState } from "react";
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";
import { MarketplaceHeader } from "@/components/marketplace/MarketplaceHeader";
import { MarketplaceNavigation, serviceCategories } from "@/components/marketplace/MarketplaceNavigation";
import { MarketplaceContent } from "@/components/marketplace/MarketplaceContent";
import { useMarketplace } from "@/hooks/useMarketplace";

export default function Marketplace() {
  // Default to first category
  const [activeCategory, setActiveCategory] = useState<string>(serviceCategories[0].id);
  const [activeSubcategory, setActiveSubcategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const { categories } = useMarketplace();

  const handleCategoryChange = (categoryId: string) => {
    setActiveCategory(categoryId);
    setActiveSubcategory(null); // Reset subcategory when category changes
  };

  const handleSubcategoryChange = (categoryId: string, subcategoryId: string) => {
    setActiveCategory(categoryId);
    setActiveSubcategory(subcategoryId);
  };

  return (
    <ThreeColumnLayout title="Family Office Marketplace">
      <div className="space-y-6 px-4 py-6 max-w-7xl mx-auto">
        <MarketplaceHeader 
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
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
            <MarketplaceContent 
              activeCategory={activeCategory}
              activeSubcategory={activeSubcategory}
              serviceCategories={serviceCategories}
            />
          </div>
        </div>
      </div>
    </ThreeColumnLayout>
  );
}
