
import React from "react";
import { Link } from "react-router-dom";
import { CourseCategoryCard } from "./CourseCategoryCard";
import { CourseCategory } from "@/types/education";

interface FeaturedCategoriesProps {
  categories: CourseCategory[];
  onSelectCategory: (categoryId: string) => void;
}

export function FeaturedCategories({ categories, onSelectCategory }: FeaturedCategoriesProps) {
  return (
    <div className="mb-10">
      <h2 className="text-2xl font-semibold mb-6">Browse by Category</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <Link 
            key={category.id} 
            to={`/education/${category.id}`}
            onClick={(e) => {
              e.preventDefault();
              onSelectCategory(category.id);
            }}
          >
            <CourseCategoryCard name={category.name} id={category.id} />
          </Link>
        ))}
      </div>
    </div>
  );
}
