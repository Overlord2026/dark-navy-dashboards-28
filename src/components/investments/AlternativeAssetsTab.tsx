
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronRight } from "lucide-react";
import AssetCategoryOfferings from "./AssetCategoryOfferings";

interface AssetCategory {
  id: string;
  name: string;
  description: string;
}

const assetCategories: AssetCategory[] = [
  {
    id: "private-equity",
    name: "Private Equity",
    description: "Investments in private companies or buyouts of public companies resulting in a delisting of public equity."
  },
  {
    id: "private-debt",
    name: "Private Debt",
    description: "Loans made by non-bank institutions to private companies or commercial real estate owners with complex needs."
  },
  {
    id: "hedge-fund",
    name: "Hedge Fund",
    description: "Alternative investment vehicles employing different strategies to earn returns regardless of market direction."
  },
  {
    id: "venture-capital",
    name: "Venture Capital",
    description: "Investments in early stage companies with high growth potential across various industries."
  },
  {
    id: "collectibles",
    name: "Collectibles",
    description: "Investments in rare physical assets including art, wine, classic cars, watches and other luxury items."
  },
  {
    id: "digital-assets",
    name: "Digital Assets",
    description: "Investments in blockchain technology, cryptocurrencies, and other digital asset infrastructure."
  },
  {
    id: "real-assets",
    name: "Real Assets",
    description: "Investments in physical assets including real estate, infrastructure, natural resources, and commodities."
  },
  {
    id: "structured-investments",
    name: "Structured Investments",
    description: "Customized investment products with specific risk/return profiles using derivatives and financial engineering."
  }
];

const AlternativeAssetsTab: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<AssetCategory | null>(null);
  
  const handleCategoryClick = (category: AssetCategory) => {
    setSelectedCategory(category);
  };
  
  const handleBack = () => {
    setSelectedCategory(null);
  };
  
  if (selectedCategory) {
    return (
      <AssetCategoryOfferings 
        category={selectedCategory}
        onBack={handleBack}
      />
    );
  }
  
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-4">Alternative Investment Categories</h3>
        <p className="text-gray-400 mb-6">
          Explore exclusive private market investment opportunities within these alternative asset classes.
          Click on a category to view available offerings.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {assetCategories.map((category) => (
          <Card 
            key={category.id}
            className="border rounded-lg p-5 hover:shadow-md transition-all cursor-pointer bg-[#0f1628] border-gray-800"
            onClick={() => handleCategoryClick(category)}
          >
            <div className="flex justify-between items-center mb-2">
              <h4 className="text-lg font-medium text-white">{category.name}</h4>
              <ChevronRight className="h-5 w-5 text-gray-400" />
            </div>
            <p className="text-gray-300 text-sm line-clamp-3">{category.description}</p>
            <div className="mt-4">
              <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                Private Market Alpha
              </Badge>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AlternativeAssetsTab;
