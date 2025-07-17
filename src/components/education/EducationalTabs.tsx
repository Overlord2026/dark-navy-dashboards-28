
import React, { useState, useEffect, useCallback, useMemo, lazy, Suspense } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { CourseList } from "./CourseList";
import { coursesByCategory } from "@/data/education/coursesByCategory";
import { educationalResources } from "@/data/education/educationalResources";
import { courseCategories } from "@/data/education/categories";
import { useNavigate, useSearchParams } from "react-router-dom";
import { BookList } from './BookList';
import { BookManagement } from './BookManagement';
import { EducationalResource } from "@/types/education";
import { toast } from 'sonner';
import { SolutionCardSkeleton, ClientSegmentSkeleton } from '@/components/ui/loading-skeletons';

// Lazy load heavy components
const SolutionCards = lazy(() => import('@/components/solutions/SolutionCards').then(module => ({ default: module.SolutionCards })));
const WhoWeServe = lazy(() => import('@/components/solutions/WhoWeServe').then(module => ({ default: module.WhoWeServe })));

interface EducationalTabsProps {
  activeSection: string;
  activeCategory: string;
  setActiveSection: (section: string) => void;
  setActiveCategory: (category: string) => void;
  handleCourseEnrollment: (id: string | number, title: string, isPaid: boolean, ghlUrl?: string) => void;
}

export const EducationalTabs: React.FC<EducationalTabsProps> = React.memo(({ 
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

  const handleTabChange = useCallback((value: string) => {
    setActiveSection(value);
  }, [setActiveSection]);

  const handleUpdateBooks = useCallback((updatedBooks: EducationalResource[]) => {
    setBooks(updatedBooks);
    // In a real app, you would save to an API or local storage here
    toast.success("Books list updated");
  }, []);

  const handleWhitepaperAccess = useCallback((whitepaper: EducationalResource) => {
    window.open(whitepaper.ghlUrl, '_blank');
  }, []);

  const handleResourceAccess = useCallback((resource: EducationalResource) => {
    window.open(resource.ghlUrl, '_blank');
  }, []);

  const handleFunnelAccess = useCallback((funnel: EducationalResource) => {
    window.open(funnel.ghlUrl, '_blank');
  }, []);

  // Memoize course data to prevent unnecessary recalculations
  const coursesData = useMemo(() => {
    return activeCategory === "all-courses"
      ? Object.values(coursesByCategory).flat()
      : coursesByCategory[activeCategory] || [];
  }, [activeCategory]);

  return (
    <Tabs value={activeSection} onValueChange={handleTabChange} className="w-full">
      <div className="flex justify-center mb-6">
        <TabsList className="grid w-full max-w-2xl grid-cols-3 gap-1">
          <TabsTrigger value="learn-discover" className="text-sm font-medium">
            Learn & Discover
          </TabsTrigger>
          <TabsTrigger value="solutions-services" className="text-sm font-medium">
            Solutions & Services
          </TabsTrigger>
          <TabsTrigger value="who-we-serve" className="text-sm font-medium">
            Who We Serve
          </TabsTrigger>
        </TabsList>
      </div>
      
      {/* Learn & Discover Tab */}
      <TabsContent value="learn-discover" className="py-6">
        <div className="space-y-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-3">Educational Resources</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Expand your financial knowledge with our comprehensive library of books, guides, tools, and courses.
            </p>
          </div>
          
          <Tabs defaultValue="books" className="w-full">
            <div className="flex justify-center mb-6">
              <TabsList className="grid w-full max-w-3xl grid-cols-5 gap-1">
                <TabsTrigger value="books">Books</TabsTrigger>
                <TabsTrigger value="guides-whitepapers">Guides & Whitepapers</TabsTrigger>
                <TabsTrigger value="videos-webinars">Videos & Webinars</TabsTrigger>
                <TabsTrigger value="tools-checklists">Tools & Checklists</TabsTrigger>
                <TabsTrigger value="courses">Courses</TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="books" className="py-4">
              <BookList books={books} />
            </TabsContent>

            <TabsContent value="guides-whitepapers" className="py-4">
              <div className="space-y-8">
                {/* Guides Section */}
                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-4">Comprehensive Guides</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {educationalResources.ebooks.map(ebook => (
                      <div
                        key={ebook.id}
                        className="border rounded-lg p-6 hover:shadow-md transition-shadow bg-card"
                      >
                        <h4 className="font-semibold text-lg mb-2">{ebook.title}</h4>
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
                          {ebook.isPaid ? 'Purchase Guide' : 'Download Guide'}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Whitepapers Section */}
                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-4">Research & Whitepapers</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {educationalResources.whitepapers.map(whitepaper => (
                      <div
                        key={whitepaper.id}
                        className="border rounded-lg p-6 hover:shadow-md transition-shadow bg-card"
                      >
                        <h4 className="font-semibold text-lg mb-2">{whitepaper.title}</h4>
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
                </div>
              </div>
            </TabsContent>

            <TabsContent value="videos-webinars" className="py-4">
              <div className="space-y-8">
                {/* Videos Section */}
                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-4">Educational Videos</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {educationalResources.resources.filter(r => r.title.includes('Video') || r.title.includes('Watch')).map(resource => (
                      <div
                        key={resource.id}
                        className="border rounded-lg p-6 hover:shadow-md transition-shadow bg-card"
                      >
                        <h4 className="font-semibold text-lg mb-2">{resource.title}</h4>
                        <p className="text-sm text-muted-foreground mb-4">
                          {resource.description}
                        </p>
                        <div className="flex justify-between items-center text-xs text-muted-foreground mt-2 mb-4">
                          <span>{resource.level}</span>
                          <span>Video Content</span>
                        </div>
                        <button
                          onClick={() => handleResourceAccess(resource)}
                          className="w-full py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
                        >
                          Watch Now
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Webinars Section */}
                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-4">Webinars & Events</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {educationalResources.funnel?.map(funnel => (
                      <div
                        key={funnel.id}
                        className="border rounded-lg p-6 hover:shadow-md transition-shadow bg-card"
                      >
                        <h4 className="font-semibold text-lg mb-2">{funnel.title}</h4>
                        <p className="text-sm text-muted-foreground mb-4">
                          {funnel.description}
                        </p>
                        <div className="flex justify-between items-center text-xs text-muted-foreground mt-2 mb-4">
                          <span>{funnel.level}</span>
                          <span>Webinar</span>
                        </div>
                        <button
                          onClick={() => handleFunnelAccess(funnel)}
                          className="w-full py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
                        >
                          Register Now
                        </button>
                      </div>
                    )) || (
                      <div className="col-span-full text-center py-8">
                        <p className="text-muted-foreground">No webinars available at this time.</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="tools-checklists" className="py-4">
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-4">Tools & Checklists</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {educationalResources.resources.filter(r => !r.title.includes('Video') && !r.title.includes('Watch')).map(resource => (
                    <div
                      key={resource.id}
                      className="border rounded-lg p-6 hover:shadow-md transition-shadow bg-card"
                    >
                      <h4 className="font-semibold text-lg mb-2">{resource.title}</h4>
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
                        Access Tool
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="courses" className="py-4">
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-4">Professional Courses</h3>
                <CourseList
                  title={activeCategory === "all-courses" ? "All Courses" : "Category Courses"}
                  courses={coursesData}
                  onCourseEnrollment={handleCourseEnrollment}
                />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </TabsContent>
      
      {/* Solutions & Services Tab */}
      <TabsContent value="solutions-services" className="py-6">
        <div className="space-y-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-3">Solutions & Services</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Comprehensive family office solutions designed to optimize your wealth management strategy.
            </p>
          </div>
          <Suspense fallback={
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => <SolutionCardSkeleton key={i} />)}
            </div>
          }>
            <SolutionCards />
          </Suspense>
        </div>
      </TabsContent>
      
      {/* Who We Serve Tab */}
      <TabsContent value="who-we-serve" className="py-6">
        <Suspense fallback={
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => <ClientSegmentSkeleton key={i} />)}
          </div>
        }>
          <WhoWeServe />
        </Suspense>
      </TabsContent>
    </Tabs>
  );
});
