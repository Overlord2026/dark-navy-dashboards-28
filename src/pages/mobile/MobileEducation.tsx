
import React, { useState } from "react";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { Search } from "lucide-react";
import { featuredCourses, popularCourses } from "@/data/education";
import { courseCategories } from "@/data/education";
import { handleCourseAccess } from "@/components/education/courseUtils";
import { MobileCourseTabs } from "@/components/education/mobile/MobileCourseTabs";
import { MobileCategoryGrid } from "@/components/education/mobile/MobileCategoryGrid";
import { MobileResourceCards } from "@/components/education/mobile/MobileResourceCards";

export default function MobileEducation() {
  const [searchQuery, setSearchQuery] = useState<string>("");

  const handleCourseEnrollment = (courseId: string | number, title: string, isPaid: boolean, ghlUrl?: string) => {
    handleCourseAccess(courseId, title, isPaid, ghlUrl);
  };

  return (
    <MobileLayout title="Education Center" showAddButton={false}>
      <div className="p-4 space-y-6 pb-20">
        <div>
          <h2 className="text-xl font-bold mb-2">Financial Education Center</h2>
          <p className="text-gray-400 text-sm">
            Build wealth and achieve your financial goals with our educational resources.
          </p>
        </div>

        <div className="relative">
          <div className="absolute inset-y-0 left-2 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search courses and guides..."
            className="w-full py-2 pl-8 pr-4 bg-[#1B1B32] border border-[#2A2A45] rounded-lg text-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <MobileCourseTabs 
          featuredCourses={featuredCourses}
          popularCourses={popularCourses}
          onCourseClick={handleCourseEnrollment}
        />

        <MobileCategoryGrid categories={courseCategories} />

        <MobileResourceCards />
      </div>
    </MobileLayout>
  );
}
