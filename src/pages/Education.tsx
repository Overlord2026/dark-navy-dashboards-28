
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";
import { toast } from "sonner";
import { useSearchParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { EducationalTabs } from "@/components/education/EducationalTabs";
import { courseCategories } from "@/data/education";
import { handleCourseAccess } from "@/components/education/courseUtils";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Settings } from "lucide-react";
import { CourseApiDemo } from "@/components/education/CourseApiDemo";

export default function Education() {
  const [searchParams] = useSearchParams();
  const [activeCategory, setActiveCategory] = useState("all-courses");
  const [activeSection, setActiveSection] = useState("courses");
  const [showApiDemo, setShowApiDemo] = useState(false);
  
  useEffect(() => {
    const category = searchParams.get("category");
    const section = searchParams.get("section");
    const apiDemo = searchParams.get("api") === "true";
    
    if (category) {
      setActiveCategory(category);
      setActiveSection("courses");
    } else if (section) {
      // Make sure we validate that the section exists
      const validSections = ["courses", "guides", "books", "whitepapers"];
      if (validSections.includes(section)) {
        setActiveSection(section);
      }
    }
    
    setShowApiDemo(apiDemo);
  }, [searchParams]);

  const handleCourseEnrollment = (courseId: string | number, title: string, isPaid: boolean, ghlUrl?: string) => {
    if (ghlUrl) {
      // Use the handleCourseAccess utility for proper course access flow
      handleCourseAccess(courseId, title, isPaid, ghlUrl);
    } else {
      // Fallback for if we somehow get here without a URL
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
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
            <h2 className="text-2xl font-bold tracking-tight">Welcome to the SWAG Education Center</h2>
            
            <Link to="/education-admin">
              <Button variant="outline" size="sm" className="flex items-center gap-2 mt-2 md:mt-0">
                <Settings className="h-4 w-4" />
                Manage Content
              </Button>
            </Link>
          </div>
          
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
          />
        </motion.div>
      </motion.div>
    </ThreeColumnLayout>
  );
}
