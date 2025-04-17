import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";
import { toast } from "sonner";
import { useSearchParams, Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { EducationalTabs } from "@/components/education/EducationalTabs";
import { courseCategories } from "@/data/education";
import { handleCourseAccess } from "@/components/education/courseUtils";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { CourseApiDemo } from "@/components/education/CourseApiDemo";

export default function Education() {
  const [searchParams] = useSearchParams();
  const [activeCategory, setActiveCategory] = useState("all-courses");
  const [activeSection, setActiveSection] = useState("courses");
  const [showApiDemo, setShowApiDemo] = useState(false);
  
  const location = useLocation();
  
  useEffect(() => {
    const category = searchParams.get("category");
    const section = searchParams.get("section");
    const apiDemo = searchParams.get("api") === "true";
    
    const stateCategory = location.state?.category;
    
    if (stateCategory) {
      setActiveCategory(stateCategory);
      setActiveSection("courses");
    } else if (category) {
      setActiveCategory(category);
      setActiveSection("courses");
    } else if (section) {
      const validSections = ["courses", "guides", "books", "whitepapers"];
      if (validSections.includes(section)) {
        setActiveSection(section);
      }
    }
    
    setShowApiDemo(apiDemo);
  }, [searchParams, location.state]);

  const handleCourseEnrollment = (courseId: string | number, title: string, isPaid: boolean, ghlUrl?: string) => {
    if (ghlUrl) {
      handleCourseAccess(courseId, title, isPaid, ghlUrl);
    } else {
      if (isPaid) {
        toast.info(`Redirecting to payment page for ${title}`);
      } else {
        toast.success(`Successfully enrolled in ${title}`);
      }
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

  const toggleApiDemo = () => {
    setShowApiDemo(!showApiDemo);
  };

  return (
    <ThreeColumnLayout 
      title="SWAG Education Center" 
      activeMainItem="education"
      activeSecondaryItem={activeCategory}
      secondaryMenuItems={courseCategories}
    >
      <motion.div 
        className="space-y-6 px-1"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants}>
          <h2 className="text-2xl font-bold tracking-tight">Welcome to the SWAG Education Center</h2>
          <p className="text-muted-foreground mt-2">
            Explore our collection of financial education resources to help you build wealth and achieve your financial goals.
          </p>
          
          <div className="mt-4 mb-6 flex gap-2">
            <Link to="/education/tax-planning">
              <Button variant="outline" className="flex items-center gap-2">
                Tax Planning <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            
            <Button 
              variant={showApiDemo ? "default" : "outline"} 
              className="flex items-center gap-2"
              onClick={toggleApiDemo}
            >
              {showApiDemo ? "Hide API Demo" : "Show API Demo"}
            </Button>
          </div>
          
          {showApiDemo && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="mb-8"
            >
              <CourseApiDemo />
            </motion.div>
          )}
          
          <EducationalTabs 
            activeSection={activeSection}
            activeCategory={activeCategory}
            setActiveSection={setActiveSection}
            setActiveCategory={setActiveCategory}
            handleCourseEnrollment={handleCourseEnrollment}
            isAdmin={true} // Enable admin features for testing
          />
        </motion.div>
      </motion.div>
    </ThreeColumnLayout>
  );
}
