import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";
import { toast } from "sonner";
import { useSearchParams, Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { EducationalTabs } from "@/components/education/EducationalTabs";
import { AdminEducationTabs } from "@/components/education/AdminEducationTabs";
import { courseCategories } from "@/data/education";
import { handleCourseAccess } from "@/components/education/courseUtils";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Shield } from "lucide-react";
import { CourseApiDemo } from "@/components/education/CourseApiDemo";
import { useAdmin } from "@/context/AdminContext";

export default function Education() {
  const [searchParams] = useSearchParams();
  const [activeCategory, setActiveCategory] = useState("all-courses");
  const [activeSection, setActiveSection] = useState("courses");
  const [showApiDemo, setShowApiDemo] = useState(false);
  
  const location = useLocation();
  
  const { isAdmin, setIsAdmin } = useAdmin();
  
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
    
    if (location.pathname.includes('/education/all-courses')) {
      setActiveCategory("all-courses");
      setActiveSection("courses");
    }
    
    setShowApiDemo(apiDemo);
  }, [searchParams, location.state, location.pathname]);

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

  const toggleAdminMode = () => {
    setIsAdmin(!isAdmin);
    toast.success(isAdmin ? "Exited admin mode" : "Entered admin mode");
  };

  const toggleApiDemo = () => {
    setShowApiDemo(!showApiDemo);
  };

  const handleTabsUpdate = (newTabs: Array<{ id: string; label: string; value: string; }>) => {
    toast.success("Tabs updated successfully");
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
      title={isAdmin ? "Education Management" : "SWAG Education Center"}
      activeMainItem="education"
    >
      <motion.div 
        className="space-y-6 px-1"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold tracking-tight">
              {isAdmin ? "Education Management Dashboard" : "Welcome to the SWAG Education Center"}
            </h2>
            <Button
              variant="outline"
              size="sm"
              onClick={toggleAdminMode}
              className="flex items-center gap-2"
            >
              <Shield className="h-4 w-4" />
              {isAdmin ? "Exit Admin Mode" : "Admin Mode"}
            </Button>
          </div>

          {isAdmin ? (
            <AdminEducationTabs 
              tabs={[
                { id: 'courses', label: 'Courses', value: 'courses' },
                { id: 'guides', label: 'Guides', value: 'guides' },
                { id: 'books', label: 'Books', value: 'books' },
                { id: 'whitepapers', label: 'Whitepapers', value: 'whitepapers' }
              ]}
              onUpdateTabs={handleTabsUpdate}
            />
          ) : (
            <>
              <p className="text-muted-foreground mt-2">
                Explore our collection of financial education resources to help you build wealth and achieve your financial goals.
              </p>
              
              <div className="flex flex-col space-y-6">
                <div className="flex flex-wrap gap-2">
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
                  isAdmin={false}
                />
              </div>
            </>
          )}
        </motion.div>
      </motion.div>
    </ThreeColumnLayout>
  );
}
