import React from 'react';
import { Button } from "@/components/ui/button";
import { CourseCategory } from "@/types/education";
import { cn } from "@/lib/utils";
import { Card } from '@/components/ui/card';
import { courseCategories } from '@/data/education';
import { useNavigate, useLocation } from 'react-router-dom';

export interface CourseCategoryProps {
  activeCategory: string;
  onCategorySelect: (category: string) => void;
  courses: any;
  onCourseEnrollment: (courseId: string | number, title: string, isPaid: boolean, ghlUrl?: string) => void;
}

export const CourseCategories: React.FC<CourseCategoryProps> = ({ 
  activeCategory,
  onCategorySelect,
  courses,
  onCourseEnrollment 
}) => {
  // Use the imported courseCategories if not explicitly provided
  const categories = courseCategories;
  const navigate = useNavigate();
  const location = useLocation();
  
  const handleCategoryClick = (categoryId: string) => {
    // Update the category in the parent component
    onCategorySelect(categoryId);
    
    // Handle navigation based on current location
    if (location.pathname.includes('/education/')) {
      // If we're on a specific education page (like tax-planning), go back to main education
      navigate('/education', { state: { category: categoryId } });
    } else {
      // Otherwise, just update the URL with the new category parameter
      navigate(`/education?category=${categoryId}`, { replace: true });
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2 mb-6">
        {categories.map(category => (
          <Button
            key={category.id}
            variant="outline"
            size="sm"
            onClick={() => handleCategoryClick(category.id)}
            className={cn(
              "rounded-full",
              activeCategory === category.id 
                ? "bg-primary text-primary-foreground hover:bg-primary/90 border-primary"
                : ""
            )}
          >
            {category.name}
          </Button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.isArray(courses) && courses.length > 0 ? (
          courses.map((course) => (
            <Card key={course.id} className="p-4 flex flex-col h-full">
              <div className="flex flex-col h-full">
                <div className="flex justify-between mb-2">
                  <h3 className="font-semibold">{course.title}</h3>
                  {course.isPaid && (
                    <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded-full">
                      Premium
                    </span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mb-3 flex-grow">{course.description}</p>
                <div className="flex justify-between text-xs text-muted-foreground mb-3">
                  <span>{course.level}</span>
                  <span>{course.duration}</span>
                </div>
                <Button 
                  onClick={() => onCourseEnrollment(course.id, course.title, course.isPaid || false, course.ghlUrl)}
                  variant={course.isPaid ? "default" : "outline"}
                  className="w-full mt-auto"
                >
                  {course.isPaid ? "Enroll Now" : "Start Learning"}
                </Button>
              </div>
            </Card>
          ))
        ) : (
          <div className="col-span-full text-center py-8">
            <p className="text-muted-foreground">No courses available in this category.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseCategories;
