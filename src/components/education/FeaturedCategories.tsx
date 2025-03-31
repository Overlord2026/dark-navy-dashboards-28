
import React from "react";
import { Link } from "react-router-dom";
import { CourseCategoryCard } from "./CourseCategoryCard";
import { CourseCategory } from "@/types/education";
import { coursesByCategory } from "@/data/education";

interface FeaturedCategoriesProps {
  categories: CourseCategory[];
  onSelectCategory: (categoryId: string) => void;
}

export function FeaturedCategories({ categories, onSelectCategory }: FeaturedCategoriesProps) {
  // Only display specific categories that we want to feature
  const featuredCategoryIds = [
    "retirement-income",
    "social-security", 
    "income-distribution", 
    "annuities", 
    "tax-planning", 
    "wealth-management",
    "estate-planning", 
    "advanced-tax", 
    "florida-residency", 
    "texas-residency"
  ];
  
  // Filter categories to only show the featured ones, and in the specified order
  // Make sure we filter out any undefined categories
  const featuredCategories = featuredCategoryIds
    .map(id => categories.find(cat => cat && cat.id === id))
    .filter((cat): cat is CourseCategory => cat !== undefined && cat !== null);
  
  // Count courses in each category
  const getCourseCount = (categoryId: string) => {
    return (coursesByCategory[categoryId as keyof typeof coursesByCategory] || []).length;
  };
  
  return (
    <div className="mt-8">
      <h3 className="text-xl font-semibold mb-6">Featured Course Categories</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {featuredCategories.map(category => (
          <div 
            key={category.id} 
            onClick={() => onSelectCategory(category.id)}
          >
            <CourseCategoryCard 
              category={category} 
              courseCount={getCourseCount(category.id)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
