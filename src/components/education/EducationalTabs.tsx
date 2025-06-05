import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CourseList } from "./CourseList";
import { coursesByCategory } from "@/data/education/coursesByCategory";
import { educationalResources } from "@/data/education/educationalResources";
import { courseCategories } from "@/data/education/categories";
import { useNavigate, useSearchParams } from "react-router-dom";
import { BookList } from './BookList';
import { BookManagement } from './BookManagement';
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

  const handleWhitepaperAccess = (whitepaper: EducationalResource) => {
    window.open(whitepaper.ghlUrl, '_blank');
  };

  const handleResourceAccess = (resource: EducationalResource) => {
    window.open(resource.ghlUrl, '_blank');
  };

  const handleFunnelAccess = (funnel: EducationalResource) => {
    window.open(funnel.ghlUrl, '_blank');
  };

  return (
    <Tabs value={activeSection} onValueChange={handleTabChange} className="w-full mt-6">
      <div className="flex justify-between items-center mb-4">
        <TabsList>
          <TabsTrigger value="guides">Guides</TabsTrigger>
          <TabsTrigger value="books">Books</TabsTrigger>
          <TabsTrigger value="ebooks">E-Books</TabsTrigger>
          <TabsTrigger value="whitepapers">Whitepapers</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
          <TabsTrigger value="funnel">Funnel</TabsTrigger>
          <TabsTrigger value="courses">Courses</TabsTrigger>
        </TabsList>
      </div>
      
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
        <BookList books={books} />
      </TabsContent>

      <TabsContent value="ebooks" className="py-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {educationalResources.ebooks.map(ebook => (
            <div
              key={ebook.id}
              className="border rounded-lg p-6 hover:shadow-md transition-shadow"
            >
              <h3 className="font-semibold text-lg mb-2">{ebook.title}</h3>
              <p className="text-sm text-muted-foreground mb-4">
                {ebook.description}
              </p>
              <div className="flex justify-between items-center text-xs text-muted-foreground mt-2 mb-4">
                <span>{ebook.level}</span>
                <span>{ebook.author}</span>
              </div>
              <button
                onClick={() => handleCourseEnrollment(ebook.id, ebook.title, ebook.isPaid, ebook.ghlUrl)}
                className="w-full py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
              >
                {ebook.isPaid ? 'Purchase E-Book' : 'Download E-Book'}
              </button>
            </div>
          ))}
        </div>
      </TabsContent>
      
      <TabsContent value="whitepapers" className="py-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {educationalResources.whitepapers.map(whitepaper => (
            <div
              key={whitepaper.id}
              className="border rounded-lg p-6 hover:shadow-md transition-shadow"
            >
              <h3 className="font-semibold text-lg mb-2">{whitepaper.title}</h3>
              <p className="text-sm text-muted-foreground mb-4">
                {whitepaper.description}
              </p>
              <div className="flex justify-between items-center text-xs text-muted-foreground mt-2 mb-4">
                <span>{whitepaper.level}</span>
                <span>PDF Document</span>
              </div>
              <button
                onClick={() => handleWhitepaperAccess(whitepaper)}
                className="w-full py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
              >
                View Whitepaper
              </button>
            </div>
          ))}
        </div>
      </TabsContent>

      <TabsContent value="resources" className="py-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {educationalResources.resources.map(resource => (
            <div
              key={resource.id}
              className="border rounded-lg p-6 hover:shadow-md transition-shadow"
            >
              <h3 className="font-semibold text-lg mb-2">{resource.title}</h3>
              <p className="text-sm text-muted-foreground mb-4">
                {resource.description}
              </p>
              <div className="flex justify-between items-center text-xs text-muted-foreground mt-2 mb-4">
                <span>{resource.level}</span>
                <span>Tool/Resource</span>
              </div>
              <button
                onClick={() => handleResourceAccess(resource)}
                className="w-full py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
              >
                Access Resource
              </button>
            </div>
          ))}
        </div>
      </TabsContent>

      <TabsContent value="funnel" className="py-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {educationalResources.funnel?.map(funnel => (
            <div
              key={funnel.id}
              className="border rounded-lg p-6 hover:shadow-md transition-shadow"
            >
              <h3 className="font-semibold text-lg mb-2">{funnel.title}</h3>
              <p className="text-sm text-muted-foreground mb-4">
                {funnel.description}
              </p>
              <div className="flex justify-between items-center text-xs text-muted-foreground mt-2 mb-4">
                <span>{funnel.level}</span>
                <span>Funnel</span>
              </div>
              <button
                onClick={() => handleFunnelAccess(funnel)}
                className="w-full py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
              >
                Access Funnel
              </button>
            </div>
          )) || (
            <div className="col-span-full text-center py-8">
              <p className="text-muted-foreground">No funnel content available yet.</p>
            </div>
          )}
        </div>
      </TabsContent>

      <TabsContent value="courses" className="py-4">
        <CourseList
          title={activeCategory === "all-courses" ? "All Courses" : "Category Courses"}
          courses={
            activeCategory === "all-courses"
              ? Object.values(coursesByCategory).flat()
              : coursesByCategory[activeCategory] || []
          }
          onCourseEnrollment={handleCourseEnrollment}
        />
      </TabsContent>
    </Tabs>
  );
};
