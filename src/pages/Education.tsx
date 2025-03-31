
import React, { useState } from "react";
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";
import { EducationalTabs } from "@/components/education/EducationalTabs";
import { courseCategories } from "@/data/education";
import { handleCourseAccess } from "@/components/education/courseUtils";
import { Button } from "@/components/ui/button";

export default function Education() {
  const [activeSection, setActiveSection] = useState("courses");
  const [activeCategory, setActiveCategory] = useState("all-courses");
  const [isProcessing, setIsProcessing] = useState(false);

  // Handler for course enrollment that's compatible with our components
  const handleCourseEnrollment = (courseId: string | number, title: string, isPaid: boolean, ghlUrl?: string) => {
    handleCourseAccess(courseId, title, isPaid, ghlUrl, setIsProcessing);
  };

  return (
    <ThreeColumnLayout activeMainItem="education" title="Education Center">
      <div className="w-full h-full bg-[#080C24] text-white">
        <div className="max-w-7xl mx-auto p-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Welcome to the SWAG Education Center</h1>
            <p className="text-gray-300 text-lg">
              Explore our collection of financial education resources to help you build wealth and achieve your financial goals.
            </p>
          </div>

          <EducationalTabs 
            activeSection={activeSection}
            activeCategory={activeCategory}
            setActiveSection={setActiveSection}
            setActiveCategory={setActiveCategory}
            handleCourseEnrollment={handleCourseEnrollment}
          />
        </div>
      </div>
    </ThreeColumnLayout>
  );
}
