
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";
import { toast } from "sonner";
import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { EducationalTabs } from "@/components/education/EducationalTabs";
import { courseCategories } from "@/data/courseData";

export default function Education() {
  const [searchParams] = useSearchParams();
  const [activeCategory, setActiveCategory] = useState("all-courses");
  const [activeSection, setActiveSection] = useState("courses");
  
  useEffect(() => {
    const category = searchParams.get("category");
    const section = searchParams.get("section");
    
    if (category) {
      setActiveCategory(category);
      setActiveSection("courses");
    } else if (section) {
      setActiveSection(section);
    }
  }, [searchParams]);

  const handleCourseEnrollment = (courseId: string | number, title: string, isPaid: boolean, ghlUrl?: string) => {
    if (ghlUrl) {
      // If we have a GHL URL, we'll open it directly (this is handled in CourseCard now)
      return;
    }
    
    // Fallback for if we somehow get here without a URL
    if (isPaid) {
      toast.info(`Redirecting to payment page for ${title}`);
    } else {
      toast.success(`Successfully enrolled in ${title}`);
    }
  };

  return (
    <ThreeColumnLayout 
      title="SWAG Education Center" 
      activeMainItem="education"
      activeSecondaryItem={activeCategory}
      secondaryMenuItems={courseCategories}
    >
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Welcome to the SWAG Education Center</h2>
          <p className="text-muted-foreground mt-2">
            Explore our collection of financial education resources to help you build wealth and achieve your financial goals.
          </p>
          
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
