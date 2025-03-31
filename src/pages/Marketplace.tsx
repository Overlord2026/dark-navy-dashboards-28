import React, { useState } from "react";
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";
import { MarketplaceHeader } from "@/components/marketplace/MarketplaceHeader";
import { MarketplaceNavigation, serviceCategories } from "@/components/marketplace/MarketplaceNavigation";
import { MarketplaceContent } from "@/components/marketplace/MarketplaceContent";
import { useMarketplace } from "@/hooks/useMarketplace";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Building, Database } from "lucide-react";
import { SystemDiagnosticsButton } from "@/components/diagnostics/SystemDiagnosticsButton";

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
        <div className="flex justify-between items-center">
          <MarketplaceHeader 
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
          <SystemDiagnosticsButton targetSystem="marketplace" variant="outline" size="sm" />
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 flex-wrap">
          <div className="bg-muted/40 p-4 rounded-lg flex-1 flex flex-col sm:flex-row items-center justify-between">
            <div>
              <h3 className="font-semibold text-lg">Find the Perfect Family Office</h3>
              <p className="text-muted-foreground text-sm">
                Browse our nationwide directory of Family Offices and wealth management providers
              </p>
            </div>
            <Button asChild className="mt-3 sm:mt-0" variant="default">
              <Link to="/family-office-directory" className="flex items-center gap-2">
                <Building className="h-4 w-4" />
                Family Office Directory
              </Link>
            </Button>
          </div>
          
          <div className="bg-blue-50 p-4 rounded-lg w-full sm:w-auto">
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <div>
                <h3 className="font-semibold text-blue-800">Admin Tools</h3>
                <p className="text-blue-600 text-sm">Import data to the directory</p>
              </div>
              <Button asChild variant="outline" className="border-blue-300 text-blue-700 hover:bg-blue-100">
                <Link to="/data-import" className="flex items-center gap-2">
                  <Database className="h-4 w-4" />
                  Data Import
                </Link>
              </Button>
            </div>
          </div>
        </div>
        
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
