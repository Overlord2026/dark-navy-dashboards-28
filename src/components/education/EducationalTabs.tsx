
import React, { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, GraduationCap, FileText, Newspaper } from "lucide-react";
import { CourseCategories } from "./CourseCategories";
import { BookList } from "./BookList";
import { coursesByCategory, featuredCourses } from "@/data/education";
import { educationalResources } from "@/data/education/educationalResources";
import { memo } from "react";

interface EducationalTabsProps {
  activeSection: string;
  activeCategory: string;
  setActiveSection: (section: string) => void;
  setActiveCategory: (category: string) => void;
  handleCourseEnrollment: (courseId: string | number, title: string, isPaid: boolean, ghlUrl?: string) => void;
}

// Memoize the BookList component to prevent unnecessary re-renders
const MemoizedBookList = memo(BookList);

export const EducationalTabs: React.FC<EducationalTabsProps> = ({
  activeSection,
  activeCategory,
  setActiveSection,
  setActiveCategory,
  handleCourseEnrollment,
}) => {
  // Use state to store filtered books to avoid recalculating on every render
  const [filteredBooks, setFilteredBooks] = useState(educationalResources.books);
  
  // Only update filtered books when activeCategory changes
  useEffect(() => {
    // For now, we're not filtering books by category, but if needed in the future:
    setFilteredBooks(educationalResources.books);
  }, [activeCategory]);
  
  // Get courses for the active category
  const activeCategoryCourses = 
    activeCategory === "all-courses" 
      ? featuredCourses 
      : coursesByCategory[activeCategory] || [];

  return (
    <Tabs value={activeSection} onValueChange={setActiveSection} className="w-full">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="courses" className="flex items-center gap-2">
          <GraduationCap className="h-4 w-4" />
          Courses
        </TabsTrigger>
        <TabsTrigger value="guides" className="flex items-center gap-2">
          <FileText className="h-4 w-4" />
          Guides
        </TabsTrigger>
        <TabsTrigger value="books" className="flex items-center gap-2">
          <BookOpen className="h-4 w-4" />
          Books
        </TabsTrigger>
        <TabsTrigger value="whitepapers" className="flex items-center gap-2">
          <Newspaper className="h-4 w-4" />
          Whitepapers
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="courses" className="mt-6">
        <CourseCategories 
          activeCategory={activeCategory}
          onCategorySelect={setActiveCategory}
          courses={activeCategoryCourses}
          onCourseEnrollment={handleCourseEnrollment}
        />
      </TabsContent>
      
      <TabsContent value="guides" className="mt-6">
        <div className="text-center py-8">
          <h3 className="text-xl font-semibold mb-2">Financial Guides</h3>
          <p className="text-muted-foreground">
            Our comprehensive guides help you navigate complex financial topics with ease.
          </p>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            {educationalResources.guides.map(guide => (
              <div key={guide.id} className="border rounded-lg p-6 text-left">
                <h4 className="font-semibold">{guide.title}</h4>
                <p className="text-sm text-muted-foreground mt-2">{guide.description}</p>
                <div className="mt-4">
                  <button 
                    onClick={() => handleCourseEnrollment(guide.id, guide.title, guide.isPaid || false, guide.ghlUrl)}
                    className="text-primary hover:underline flex items-center"
                  >
                    Download Guide <FileText className="ml-2 h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </TabsContent>
      
      <TabsContent value="books" className="mt-6">
        <h3 className="text-xl font-semibold mb-4">Recommended Reading</h3>
        <p className="text-muted-foreground mb-6">
          Explore our curated collection of essential financial literature to deepen your knowledge.
        </p>
        <MemoizedBookList books={filteredBooks} />
      </TabsContent>
      
      <TabsContent value="whitepapers" className="mt-6">
        <div className="text-center py-8">
          <h3 className="text-xl font-semibold">Whitepapers Coming Soon</h3>
          <p className="text-muted-foreground mt-2">
            Our team is working on creating insightful whitepapers on various financial topics.
            Check back soon for updates!
          </p>
        </div>
      </TabsContent>
    </Tabs>
  );
};
