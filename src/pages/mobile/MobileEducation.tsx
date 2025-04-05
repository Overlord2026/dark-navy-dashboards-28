
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Course } from "@/types/education";
import { coursesByCategory, courseCategories } from '@/data/education';
import { MobileCourseCard } from '@/components/education/mobile/MobileCourseCard';
import { MobileCourseTabs } from '@/components/education/mobile/MobileCourseTabs';
import { MobileCategoryGrid } from '@/components/education/mobile/MobileCategoryGrid';
import { MobileResourceCards } from '@/components/education/mobile/MobileResourceCards';
import { handleCourseAccess } from '@/components/education/courseUtils';
import { toast } from 'sonner';

// Ensure we strictly adhere to the Course type from the types/education file
const filterCoursesToMatchType = (courses: any[]): Course[] => {
  return courses.map(course => ({
    id: course.id,
    title: course.title,
    description: course.description,
    level: course.level as "Beginner" | "Intermediate" | "Advanced" | "All Levels",
    duration: course.duration,
    image: course.image || "/placeholder.svg",
    isPaid: Boolean(course.isPaid),
    ghlUrl: course.ghlUrl || ""
  }));
};

const MobileEducation = () => {
  const [activeTab, setActiveTab] = useState('courses');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  const { data: courses = [], isLoading } = useQuery({
    queryKey: ['mobile-education-courses', selectedCategory],
    queryFn: async () => {
      // If category is selected, filter by it
      if (selectedCategory) {
        const filteredCourses = coursesByCategory[selectedCategory] || [];
        return filterCoursesToMatchType(filteredCourses);
      }
      
      // Otherwise return all courses
      const allCourses = Object.values(coursesByCategory).flat();
      return filterCoursesToMatchType(allCourses);
    }
  });

  const handleSelectCategory = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setActiveTab('courses'); // Switch to courses tab when category is selected
  };

  const handleClearCategory = () => {
    setSelectedCategory(null);
  };

  // Handle course enrollment using the courseUtils
  const handleCourseClick = (courseId: string | number, title: string, isPaid: boolean, ghlUrl?: string) => {
    if (ghlUrl) {
      handleCourseAccess(courseId, title, isPaid, ghlUrl);
    } else {
      toast.info(`Course content for "${title}" is not available yet.`);
    }
  };

  return (
    <div className="pb-16">
      {/* Mobile Header */}
      <div className="bg-background sticky top-0 z-10 border-b border-border">
        <div className="px-4 py-3 flex items-center justify-between">
          <h1 className="text-xl font-bold">Education & Resources</h1>
        </div>
        
        {/* Tabs */}
        <div className="px-4 py-2 flex gap-2 overflow-x-auto">
          <button 
            onClick={() => setActiveTab('courses')} 
            className={`px-4 py-2 rounded-full text-sm whitespace-nowrap ${activeTab === 'courses' ? 'bg-primary text-white' : 'bg-secondary'}`}
          >
            Courses
          </button>
          <button 
            onClick={() => setActiveTab('categories')} 
            className={`px-4 py-2 rounded-full text-sm whitespace-nowrap ${activeTab === 'categories' ? 'bg-primary text-white' : 'bg-secondary'}`}
          >
            Categories
          </button>
          <button 
            onClick={() => setActiveTab('resources')} 
            className={`px-4 py-2 rounded-full text-sm whitespace-nowrap ${activeTab === 'resources' ? 'bg-primary text-white' : 'bg-secondary'}`}
          >
            Resources
          </button>
        </div>
      </div>
      
      {/* Content based on active tab */}
      <div className="px-4 py-3">
        {activeTab === 'categories' && (
          <MobileCategoryGrid 
            categories={courseCategories} 
            onSelectCategory={handleSelectCategory} 
          />
        )}
        
        {activeTab === 'courses' && (
          <>
            {selectedCategory ? (
              <div className="grid grid-cols-2 gap-3">
                {isLoading ? (
                  <p className="col-span-2 text-center py-8">Loading courses...</p>
                ) : courses.length === 0 ? (
                  <p className="col-span-2 text-center py-8">No courses available</p>
                ) : (
                  courses.map((course) => (
                    <div key={course.id} className="col-span-1">
                      <MobileCourseCard 
                        course={course} 
                        onClick={() => handleCourseClick(course.id, course.title, course.isPaid, course.ghlUrl)}
                      />
                    </div>
                  ))
                )}
              </div>
            ) : (
              <MobileCourseTabs 
                featuredCourses={filterCoursesToMatchType(coursesByCategory["retirement-income"] || [])} 
                popularCourses={filterCoursesToMatchType(coursesByCategory["tax-planning"] || [])} 
                onCourseClick={handleCourseClick}
                selectedCategory={selectedCategory}
                onClearCategory={handleClearCategory}
              />
            )}
          </>
        )}
        
        {activeTab === 'resources' && (
          <MobileResourceCards />
        )}
      </div>
    </div>
  );
};

export default MobileEducation;
