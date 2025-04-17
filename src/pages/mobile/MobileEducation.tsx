
import React, { useState } from "react";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { featuredCourses, popularCourses } from "@/data/education";
import { courseCategories } from "@/data/education";
import { handleCourseAccess } from "@/components/education/courseUtils";
import { MobileEducationSearch } from "@/components/mobile/education/MobileEducationSearch";
import { MobileEducationCourseCard } from "@/components/mobile/education/MobileEducationCourseCard";
import { MobileEducationCategories } from "@/components/mobile/education/MobileEducationCategories";
import { MobileEducationResources } from "@/components/mobile/education/MobileEducationResources";
import { Book, GraduationCap, BarChart, FileText, PieChart } from "lucide-react";

// Helper function for category icons
export const getCategoryIcon = (categoryId: string) => {
  switch (categoryId) {
    case "retirement-income":
      return <Book className="h-5 w-5 text-blue-400" />;
    case "tax-planning":
      return <PieChart className="h-5 w-5 text-green-400" />;
    case "wealth-management":
      return <BarChart className="h-5 w-5 text-purple-400" />;
    case "estate-planning":
      return <FileText className="h-5 w-5 text-orange-400" />;
    default:
      return <GraduationCap className="h-5 w-5 text-primary" />;
  }
};

export default function MobileEducation() {
  const [activeTab, setActiveTab] = useState<string>("featured");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const handleCourseEnrollment = (courseId: string | number, title: string, isPaid: boolean, ghlUrl?: string) => {
    handleCourseAccess(courseId, title, isPaid, ghlUrl);
  };

  const renderCourses = (courses: typeof featuredCourses) => {
    return courses.map((course) => (
      <MobileEducationCourseCard
        key={course.id}
        title={course.title}
        description={course.description}
        level={course.level}
        duration={course.duration}
        isPaid={course.isPaid || false}
        onClick={() => handleCourseEnrollment(course.id, course.title, course.isPaid || false, course.ghlUrl)}
      />
    ));
  };

  return (
    <MobileLayout title="Education Center" showAddButton={false}>
      <div className="p-4 space-y-6 pb-20">
        {/* Welcome Section */}
        <div>
          <h2 className="text-xl font-bold mb-2">Financial Education Center</h2>
          <p className="text-gray-400 text-sm">
            Build wealth and achieve your financial goals with our educational resources.
          </p>
        </div>

        {/* Search */}
        <MobileEducationSearch 
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        {/* Tabs */}
        <Tabs defaultValue="featured" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-2 w-full bg-[#1B1B32] border border-[#2A2A45]">
            <TabsTrigger value="featured" className="text-sm">Featured</TabsTrigger>
            <TabsTrigger value="popular" className="text-sm">Popular</TabsTrigger>
          </TabsList>
          
          <TabsContent value="featured" className="space-y-4 mt-4">
            {renderCourses(featuredCourses)}
          </TabsContent>
          
          <TabsContent value="popular" className="space-y-4 mt-4">
            {renderCourses(popularCourses)}
          </TabsContent>
        </Tabs>

        {/* Categories */}
        <MobileEducationCategories categories={courseCategories} />

        {/* Resources */}
        <MobileEducationResources />
      </div>
    </MobileLayout>
  );
}
