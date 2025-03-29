
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MarketplaceCategory } from "@/hooks/useMarketplace";
import { 
  Receipt, 
  PiggyBank, 
  Scroll, 
  TrendingUp, 
  Shield, 
  Home,
  CircleDot
} from "lucide-react";

interface MarketplaceCategoriesProps {
  categories: MarketplaceCategory[];
  activeCategory: string;
  setActiveCategory: (categoryId: string) => void;
}

export function MarketplaceCategories({ 
  categories, 
  activeCategory, 
  setActiveCategory 
}: MarketplaceCategoriesProps) {
  
  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case "receipt": return <Receipt className="h-4 w-4" />;
      case "piggy-bank": return <PiggyBank className="h-4 w-4" />;
      case "scroll": return <Scroll className="h-4 w-4" />;
      case "trending-up": return <TrendingUp className="h-4 w-4" />;
      case "shield": return <Shield className="h-4 w-4" />;
      case "home": return <Home className="h-4 w-4" />;
      default: return <CircleDot className="h-4 w-4" />;
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Categories</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <Button
          variant={activeCategory === "all" ? "default" : "ghost"}
          className="w-full justify-start"
          onClick={() => setActiveCategory("all")}
        >
          <CircleDot className="h-4 w-4 mr-2" />
          All Categories
          <span className="ml-auto bg-muted text-muted-foreground rounded-full px-2 py-0.5 text-xs">
            {categories.reduce((sum, cat) => sum + cat.count, 0)}
          </span>
        </Button>
        
        {categories.map((category) => (
          <Button
            key={category.id}
            variant={activeCategory === category.id ? "default" : "ghost"}
            className="w-full justify-start"
            onClick={() => setActiveCategory(category.id)}
          >
            {getIconComponent(category.icon)}
            <span className="ml-2">{category.name}</span>
            <span className="ml-auto bg-muted text-muted-foreground rounded-full px-2 py-0.5 text-xs">
              {category.count}
            </span>
          </Button>
        ))}
      </CardContent>
    </Card>
  );
}
