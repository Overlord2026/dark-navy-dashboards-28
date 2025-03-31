
import React, { useState } from "react";
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";
import { MarketplaceHeader } from "@/components/marketplace/MarketplaceHeader";
import { MarketplaceNavigation, serviceCategories } from "@/components/marketplace/MarketplaceNavigation";
import { MarketplaceContent } from "@/components/marketplace/MarketplaceContent";
import { useMarketplace } from "@/hooks/useMarketplace";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Building, Database, DollarSign, TrendingUp, FileText } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

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
        
        {/* Quick Access Navigation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-muted/40 p-4 rounded-lg flex flex-col justify-between h-full">
            <div>
              <h3 className="font-semibold text-lg">Family Office Directory</h3>
              <p className="text-muted-foreground text-sm">
                Browse our nationwide directory of Family Offices and wealth management providers
              </p>
            </div>
            <Button asChild className="mt-3 w-full sm:w-auto" variant="default">
              <Link to="/family-office-directory" className="flex items-center justify-center gap-2">
                <Building className="h-4 w-4" />
                Family Office Directory
              </Link>
            </Button>
          </div>
          
          <div className="bg-blue-50 p-4 rounded-lg flex flex-col justify-between h-full">
            <div>
              <h3 className="font-semibold text-blue-800">Private Investments</h3>
              <p className="text-blue-600 text-sm">
                Access exclusive investment opportunities
              </p>
            </div>
            <Button asChild className="mt-3 w-full sm:w-auto bg-blue-600 hover:bg-blue-700">
              <Link to="/private-investments" className="flex items-center justify-center gap-2">
                <TrendingUp className="h-4 w-4" />
                View Opportunities
              </Link>
            </Button>
          </div>
          
          <div className="bg-blue-50 p-4 rounded-lg flex flex-col justify-between h-full">
            <div>
              <h3 className="font-semibold text-blue-800">Submit RFP</h3>
              <p className="text-blue-600 text-sm">
                Request proposals from vetted service providers
              </p>
            </div>
            <Button asChild className="mt-3 w-full sm:w-auto border-blue-300 text-blue-700 hover:bg-blue-100" variant="outline">
              <Link to="/marketplace/rfp" className="flex items-center justify-center gap-2">
                <FileText className="h-4 w-4" />
                Submit RFP
              </Link>
            </Button>
          </div>
        </div>
        
        {/* Admin Tools Section */}
        <Card className="bg-muted/30">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row items-center justify-between">
              <div className="mb-3 sm:mb-0">
                <h3 className="font-semibold">Admin Tools</h3>
                <p className="text-sm text-muted-foreground">Import data to the directory</p>
              </div>
              <div className="flex gap-2">
                <Button asChild variant="outline" size="sm">
                  <Link to="/data-import" className="flex items-center gap-2">
                    <Database className="h-4 w-4" />
                    Data Import
                  </Link>
                </Button>
                <Button asChild variant="outline" size="sm">
                  <Link to="/marketplace/payments" className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    Payment Dashboard
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        
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
