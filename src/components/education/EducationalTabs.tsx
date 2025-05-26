
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CourseList } from "./CourseList";
import { CourseCategories } from "./CourseCategories";
import { coursesByCategory } from "@/data/education/coursesByCategory";
import { educationalResources } from "@/data/education/educationalResources";
import { useNavigate, useSearchParams } from "react-router-dom";
import { BookList } from './BookList';
import { BookManagement } from './BookManagement';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { EducationalResource } from "@/types/education";
import { toast } from 'sonner';

interface EducationalTabsProps {
  activeSection: string;
  activeCategory: string;
  setActiveSection: (section: string) => void;
  setActiveCategory: (category: string) => void;
  handleCourseEnrollment: (id: string | number, title: string, isPaid: boolean, ghlUrl?: string) => void;
}

export const EducationalTabs: React.FC<EducationalTabsProps> = ({ 
  activeSection, 
  activeCategory, 
  setActiveSection, 
  setActiveCategory,
  handleCourseEnrollment
}) => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [isAdmin, setIsAdmin] = useState(false);
  const [books, setBooks] = useState<EducationalResource[]>(educationalResources.books);

  // Effect to update URL when active section changes
  useEffect(() => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('section', activeSection);
    if (activeSection === 'courses') {
      newParams.set('category', activeCategory);
    } else {
      newParams.delete('category');
    }
    setSearchParams(newParams);
  }, [activeSection, activeCategory, setSearchParams]);

  const handleTabChange = (value: string) => {
    setActiveSection(value);
  };

  const handleUpdateBooks = (updatedBooks: EducationalResource[]) => {
    setBooks(updatedBooks);
    // In a real app, you would save to an API or local storage here
    toast.success("Books list updated");
  };

  return (
    <Tabs value={activeSection} onValueChange={handleTabChange} className="w-full mt-6">
      <div className="flex justify-between items-center mb-4">
        <TabsList>
          <TabsTrigger value="courses">Courses</TabsTrigger>
          <TabsTrigger value="guides">Guides</TabsTrigger>
          <TabsTrigger value="books">Books</TabsTrigger>
          <TabsTrigger value="whitepapers">Whitepapers</TabsTrigger>
        </TabsList>
        
        {activeSection === 'books' && (
          <div className="flex items-center space-x-2">
            <Switch 
              id="admin-mode"
              checked={isAdmin} 
              onCheckedChange={setIsAdmin}
            />
            <Label htmlFor="admin-mode">Admin Mode</Label>
          </div>
        )}
      </div>
      
      <TabsContent value="courses" className="py-4">
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 md:col-span-3">
            <CourseCategories />
          </div>
          <div className="col-span-12 md:col-span-9">
            <CourseList
              title={activeCategory === "all-courses" ? "All Courses" : "Category Courses"}
              courses={
                activeCategory === "all-courses"
                  ? Object.values(coursesByCategory).flat()
                  : coursesByCategory[activeCategory] || []
              }
              onCourseEnrollment={handleCourseEnrollment}
            />
          </div>
        </div>
      </TabsContent>
      
      <TabsContent value="guides" className="py-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {educationalResources.guides.map(guide => (
            <div
              key={guide.id}
              className="border rounded-lg p-6 hover:shadow-md transition-shadow"
            >
              <h3 className="font-semibold text-lg mb-2">{guide.title}</h3>
              <p className="text-sm text-muted-foreground mb-4">
                {guide.description}
              </p>
              <div className="flex justify-between items-center text-xs text-muted-foreground mt-2 mb-4">
                <span>{guide.level}</span>
                <span>{guide.duration}</span>
              </div>
              <button
                onClick={() => handleCourseEnrollment(guide.id, guide.title, guide.isPaid, guide.ghlUrl)}
                className="w-full py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
              >
                View Guide
              </button>
            </div>
          ))}
        </div>
      </TabsContent>
      
      <TabsContent value="books" className="py-4">
        {isAdmin ? (
          <BookManagement books={books} onUpdateBooks={handleUpdateBooks} />
        ) : (
          <BookList books={books} />
        )}
      </TabsContent>
      
      <TabsContent value="whitepapers" className="py-4">
        <div className="text-center py-8">
          <p className="text-muted-foreground">Whitepapers coming soon.</p>
        </div>
      </TabsContent>
    </Tabs>
  );
};
