
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CourseList } from "./CourseList";
import { courseCategories, featuredCourses, popularCourses } from "@/data/education";
import { allCourses } from "@/data/education/coursesByCategory";
import { ProfessionalsProvider } from "@/hooks/useProfessionals";
import { ProfessionalsDirectory } from "@/components/professionals/ProfessionalsDirectory";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, Plus, Trash2 } from "lucide-react";
import { GuidesList } from "./GuidesList";
import { BooksList } from "./BooksList";
import { WhitepapersList } from "./WhitepapersList";
import { educationalResources } from "@/data/education/educationalResources";

interface EducationalTabsProps {
  activeSection: string;
  activeCategory: string;
  setActiveSection: (section: string) => void;
  setActiveCategory: (category: string) => void;
  handleCourseEnrollment: (courseId: string | number, title: string, isPaid: boolean, ghlUrl?: string) => void;
}

export function EducationalTabs({ 
  activeSection, 
  activeCategory,
  setActiveSection,
  setActiveCategory,
  handleCourseEnrollment
}: EducationalTabsProps) {
  
  // Get the courses for the selected category
  const getCoursesByCategoryId = (categoryId: string) => {
    // For now, we'll use popularCourses for all categories
    // This can be expanded later with more specific course data
    switch(categoryId) {
      case "popular":
        return popularCourses;
      case "all-courses":
        return allCourses; // Use the complete list for all courses
      default:
        // Default to featured courses
        return featuredCourses;
    }
  };

  // Get the title for the selected category
  const getCategoryTitle = (categoryId: string) => {
    switch(categoryId) {
      case "all-courses":
        return "All Courses";
      case "popular":
        return "Popular Courses";
      case "tax-planning":
        return "Tax Planning Courses";
      case "investing":
        return "Investing Courses";
      case "retirement":
        return "Retirement Planning";
      case "estate-planning":
        return "Estate Planning";
      case "business":
        return "Business Courses";
      default:
        // Find the category from the courseCategories array
        const category = courseCategories.find(cat => cat.id === categoryId);
        return category?.name || "Courses";
    }
  };

  const currentCourses = getCoursesByCategoryId(activeCategory);
  const categoryTitle = getCategoryTitle(activeCategory);

  return (
    <Tabs defaultValue={activeSection} value={activeSection} onValueChange={setActiveSection} className="w-full">
      <TabsList className="mb-6 grid grid-cols-4 gap-2">
        <TabsTrigger 
          value="courses" 
          className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg transition-all duration-200"
        >
          Courses
        </TabsTrigger>
        <TabsTrigger 
          value="guides" 
          className="data-[state=active]:bg-blue-500 data-[state=active]:text-white data-[state=active]:shadow-lg border-2 border-blue-200 transition-all duration-200"
        >
          Guides
        </TabsTrigger>
        <TabsTrigger 
          value="books" 
          className="data-[state=active]:bg-amber-500 data-[state=active]:text-white data-[state=active]:shadow-lg border-2 border-amber-200 transition-all duration-200"
        >
          Books
        </TabsTrigger>
        <TabsTrigger 
          value="consultants" 
          className="data-[state=active]:bg-purple-500 data-[state=active]:text-white data-[state=active]:shadow-lg border-2 border-purple-200 transition-all duration-200"
        >
          Consultants
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="courses" className="pt-4">
        {currentCourses && (
          <CourseList 
            title={categoryTitle}
            courses={currentCourses}
            onCourseEnrollment={handleCourseEnrollment}
          />
        )}
      </TabsContent>
      
      <TabsContent value="guides" className="pt-4">
        <GuidesList />
      </TabsContent>
      
      <TabsContent value="books" className="pt-4">
        <BooksList />
      </TabsContent>
      
      <TabsContent value="consultants" className="pt-4">
        <h3 className="text-xl font-semibold mb-4">Financial Education Consultants</h3>
        <p className="text-muted-foreground mb-6">
          Connect with professionals who can provide personalized financial education and guidance.
        </p>
        
        <ProfessionalsProvider>
          <ProfessionalsDirectory />
        </ProfessionalsProvider>
      </TabsContent>
    </Tabs>
  );
}
