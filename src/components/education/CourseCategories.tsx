
import React from 'react';
import { Button } from "@/components/ui/button";
import { CourseCategory } from "@/types/education";
import { cn } from "@/lib/utils";

export interface CourseCategoryProps {
  categories: CourseCategory[];
  onCategoryClick: (categoryId: string) => void;
  activeCategory?: string;
  setActiveCategory?: (category: string) => void;
}

export const CourseCategories: React.FC<CourseCategoryProps> = ({ 
  categories, 
  onCategoryClick,
  activeCategory 
}) => {
  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {categories.map(category => (
        <Button
          key={category.id}
          variant="outline"
          size="sm"
          onClick={() => onCategoryClick(category.id)}
          className={cn(
            "rounded-full",
            activeCategory === category.id || category.active 
              ? "bg-primary text-primary-foreground hover:bg-primary/90 border-primary"
              : ""
          )}
        >
          {category.name}
        </Button>
      ))}
    </div>
  );
};

export default CourseCategories;
