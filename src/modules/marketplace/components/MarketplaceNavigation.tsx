
import React, { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";
import { MarketplaceCategory, marketplaceCategories } from "../navigation/MarketplaceNavigationConfig";

interface MarketplaceNavigationProps {
  activeCategory: string;
  activeSubcategory: string | null;
  onCategoryChange: (categoryId: string) => void;
  onSubcategoryChange: (categoryId: string, subcategoryId: string) => void;
  className?: string;
  expanded?: boolean;
}

export function MarketplaceNavigation({
  activeCategory,
  activeSubcategory,
  onCategoryChange,
  onSubcategoryChange,
  className,
  expanded = true
}: MarketplaceNavigationProps) {
  // Track which categories are expanded in the accordion
  const [expandedCategories, setExpandedCategories] = useState<string[]>([activeCategory]);

  const handleCategoryToggle = (categoryId: string) => {
    setExpandedCategories(prev => 
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Service Categories</CardTitle>
      </CardHeader>
      <CardContent className="px-2">
        <Button
          variant={activeCategory === "all" ? "default" : "ghost"}
          className="w-full justify-start mb-2"
          onClick={() => {
            onCategoryChange("all");
            setExpandedCategories([]);
          }}
        >
          All Categories
        </Button>
        
        <Accordion
          type="multiple"
          defaultValue={expandedCategories}
          className="w-full"
        >
          {marketplaceCategories.map((category) => (
            <AccordionItem key={category.id} value={category.id}>
              <AccordionTrigger
                onClick={() => handleCategoryToggle(category.id)}
                className={cn(
                  "py-2 px-3 text-sm font-medium",
                  activeCategory === category.id && !activeSubcategory && "text-primary"
                )}
              >
                <div className="flex items-center">
                  <category.icon className="h-4 w-4 mr-2" />
                  <span>{category.name.split(' ')[0]}</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pl-4">
                <div className="space-y-1 mt-1">
                  <Button
                    variant={activeCategory === category.id && !activeSubcategory ? "default" : "ghost"}
                    size="sm"
                    className="w-full justify-start text-sm"
                    onClick={() => onCategoryChange(category.id)}
                  >
                    All {category.name.split(' ')[0]}
                  </Button>
                  
                  {category.subcategories.map((subcategory) => (
                    <Button
                      key={subcategory.id}
                      variant={activeSubcategory === subcategory.id ? "default" : "ghost"}
                      size="sm"
                      className="w-full justify-start text-sm"
                      onClick={() => onSubcategoryChange(category.id, subcategory.id)}
                    >
                      <ChevronRight className="h-3 w-3 mr-1" />
                      {subcategory.name}
                    </Button>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
}
