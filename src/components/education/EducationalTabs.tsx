
import React, { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, GraduationCap, FileText, Newspaper } from "lucide-react";
import { CourseCategories } from "./CourseCategories";
import { BookList } from "./BookList";
import { coursesByCategory, featuredCourses } from "@/data/education";
import { educationalResources } from "@/data/education/educationalResources";
import { memo } from "react";
import { EducationTabsManager } from "./EducationTabsManager";
import { useNavigate, useLocation } from "react-router-dom";

interface EducationalTabsProps {
  activeSection: string;
  activeCategory: string;
  setActiveSection: (section: string) => void;
  setActiveCategory: (category: string) => void;
  handleCourseEnrollment: (courseId: string | number, title: string, isPaid: boolean, ghlUrl?: string) => void;
  isAdmin?: boolean;
}

const MemoizedBookList = memo(BookList);

export const EducationalTabs: React.FC<EducationalTabsProps> = ({
  activeSection,
  activeCategory,
  setActiveSection,
  setActiveCategory,
  handleCourseEnrollment,
  isAdmin = false
}) => {
  const [filteredBooks, setFilteredBooks] = useState(educationalResources.books);
  const [availableTabs, setAvailableTabs] = useState([
    { id: 'courses', label: 'Courses', value: 'courses' },
    { id: 'guides', label: 'Guides', value: 'guides' },
    { id: 'books', label: 'Books', value: 'books' },
    { id: 'whitepapers', label: 'Whitepapers', value: 'whitepapers' }
  ]);
  
  const navigate = useNavigate();
  const location = useLocation();
  
  useEffect(() => {
    setFilteredBooks(educationalResources.books);
  }, [activeCategory]);
  
  // Handler for category selection that checks if we're on a specific topic page
  const handleCategorySelect = (category: string) => {
    // If we're on a specific topic page like tax-planning or all-courses, redirect to main education page
    if ((location.pathname.includes('/education/') && location.pathname !== '/education') || 
        location.pathname.includes('/education/all-courses')) {
      navigate('/education', { state: { category } });
    } else {
      // Update the category in the parent component
      setActiveCategory(category);
    }
  };
  
  const activeCategoryCourses = 
    activeCategory === "all-courses" 
      ? featuredCourses 
      : coursesByCategory[activeCategory] || [];

  const handleTabsUpdate = (newTabs: Array<{ id: string; label: string; value: string; }>) => {
    setAvailableTabs(newTabs);
    // If the active section is no longer available, switch to the first available tab
    if (!newTabs.find(tab => tab.value === activeSection)) {
      setActiveSection(newTabs[0].value);
    }
  };

  return (
    <>
      {isAdmin && (
        <div className="mb-6">
          <EducationTabsManager tabs={availableTabs} onUpdateTabs={handleTabsUpdate} />
        </div>
      )}
      
      <Tabs value={activeSection} onValueChange={setActiveSection} className="w-full">
        <TabsList className="grid w-full" style={{ gridTemplateColumns: `repeat(${availableTabs.length}, 1fr)` }}>
          {availableTabs.map(tab => (
            <TabsTrigger key={tab.id} value={tab.value} className="flex items-center gap-2">
              {tab.value === 'courses' && <GraduationCap className="h-4 w-4" />}
              {tab.value === 'guides' && <FileText className="h-4 w-4" />}
              {tab.value === 'books' && <BookOpen className="h-4 w-4" />}
              {tab.value === 'whitepapers' && <Newspaper className="h-4 w-4" />}
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
        
        <TabsContent value="courses" className="mt-6">
          <CourseCategories 
            activeCategory={activeCategory}
            onCategorySelect={handleCategorySelect}
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
    </>
  );
};
