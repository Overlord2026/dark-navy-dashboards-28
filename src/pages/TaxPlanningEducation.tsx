
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { motion } from "framer-motion";
import { EducationalTabs } from "@/components/education/EducationalTabs";
import { courseCategories } from "@/data/education";
import { handleCourseAccess } from "@/components/education/courseUtils";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useAdmin } from "@/context/AdminContext";

export default function TaxPlanningEducation() {
  const [activeCategory] = useState("tax-planning");
  const [activeSection, setActiveSection] = useState("courses");
  const navigate = useNavigate();
  const { isAdmin } = useAdmin();
  
  const handleCourseEnrollment = (courseId: string | number, title: string, isPaid: boolean, ghlUrl?: string) => {
    if (ghlUrl) {
      // Use the handleCourseAccess utility for proper course access flow
      handleCourseAccess(courseId, title, isPaid, ghlUrl);
    }
  };
  
  const setActiveCategory = (category: string) => {
    // If user changes category from tax-planning, redirect to main education page
    if (category !== "tax-planning") {
      navigate('/education', { state: { category } });
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        duration: 0.3,
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <ThreeColumnLayout 
      title="Tax Planning Education" 
      activeMainItem="education"
      secondaryMenuItems={courseCategories}
    >
      <motion.div 
        className="space-y-6 px-1"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants}>
          <div className="flex items-center mb-4">
            <Link to="/education">
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Education Center
              </Button>
            </Link>
          </div>
          
          <h2 className="text-2xl font-bold tracking-tight">Tax Planning Education</h2>
          <p className="text-muted-foreground mt-2">
            Learn essential strategies to minimize your tax burden and optimize your financial planning.
          </p>
          
          <div className="mt-6">
            <EducationalTabs 
              activeSection={activeSection}
              activeCategory={activeCategory}
              setActiveSection={setActiveSection}
              setActiveCategory={setActiveCategory}
              handleCourseEnrollment={handleCourseEnrollment}
              isAdmin={isAdmin}
            />
          </div>
        </motion.div>
      </motion.div>
    </ThreeColumnLayout>
  );
}
