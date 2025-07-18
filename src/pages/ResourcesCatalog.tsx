
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";
import { toast } from "sonner";
import { useSearchParams } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import { EducationalTabs } from "@/components/education/EducationalTabs";
import { courseCategories } from "@/data/education";
import { handleCourseAccess } from "@/components/education/courseUtils";
import { motion } from "framer-motion";

export default function ResourcesCatalog() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeCategory, setActiveCategory] = useState("all-courses");
  const [activeSection, setActiveSection] = useState("learn-discover");
  const [isInitialized, setIsInitialized] = useState(false);
  
  // Initialize state from URL parameters once
  useEffect(() => {
    if (!isInitialized) {
      const category = searchParams.get("category");
      const section = searchParams.get("section");
      
      if (category) {
        setActiveCategory(category);
        setActiveSection("courses");
      } else if (section) {
        const validSections = ["learn-discover", "solutions-services", "who-we-serve"];
        if (validSections.includes(section)) {
          setActiveSection(section);
        }
      }
      setIsInitialized(true);
    }
  }, [searchParams, isInitialized]);

  // Memoize course enrollment handler
  const handleCourseEnrollment = useCallback((courseId: string | number, title: string, isPaid: boolean, ghlUrl?: string) => {
    if (ghlUrl) {
      handleCourseAccess(courseId, title, isPaid, ghlUrl);
    } else {
      if (isPaid) {
        toast.info(`Redirecting to payment page for ${title}`);
      } else {
        toast.success(`Successfully enrolled in ${title}`);
      }
    }
  }, []);

  // Memoize category change handler
  const handleCategoryChange = useCallback((categoryId: string) => {
    setActiveCategory(categoryId);
    setActiveSection("courses");
    
    // Update URL without causing re-renders
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set("category", categoryId);
    setSearchParams(newSearchParams, { replace: true });
  }, [searchParams, setSearchParams]);

  // Memoize section change handler
  const handleSectionChange = useCallback((section: string) => {
    setActiveSection(section);
    
    // Update URL without causing re-renders
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set("section", section);
    if (newSearchParams.has("category")) {
      newSearchParams.delete("category");
    }
    setSearchParams(newSearchParams, { replace: true });
  }, [searchParams, setSearchParams]);

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

  if (!isInitialized) {
    return (
      <ThreeColumnLayout title="Resources & Solutions Catalog" activeMainItem="education">
        <div className="flex items-center justify-center min-h-64">
          <div className="text-center">
            <div className="animate-pulse">Loading...</div>
          </div>
        </div>
      </ThreeColumnLayout>
    );
  }

  return (
    <ThreeColumnLayout 
      title="Resources & Solutions Catalog" 
      activeMainItem="education"
    >
      <motion.div 
        className="space-y-8 px-1"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Hero Section */}
        <motion.div variants={itemVariants} className="text-center bg-gradient-to-r from-primary/5 to-primary/10 rounded-xl p-8 border border-primary/20">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Explore Your Family Office Resources & Solutions
          </h1>
          <p className="text-lg text-muted-foreground mb-6 max-w-3xl mx-auto">
            Discover comprehensive educational resources and advanced solutions designed to optimize your family's wealth management strategy.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.button
              className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleSectionChange("solutions-services")}
            >
              See Everything We Offer
            </motion.button>
            <motion.button
              className="px-6 py-3 border border-primary text-primary rounded-lg hover:bg-primary/5 transition-colors font-medium"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleSectionChange("learn-discover")}
            >
              Start Learning
            </motion.button>
          </div>
        </motion.div>

        <motion.div variants={itemVariants}>
          <EducationalTabs 
            activeSection={activeSection}
            activeCategory={activeCategory}
            setActiveSection={handleSectionChange}
            setActiveCategory={handleCategoryChange}
            handleCourseEnrollment={handleCourseEnrollment}
          />
        </motion.div>
      </motion.div>
    </ThreeColumnLayout>
  );
}
