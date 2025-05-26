
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";
import { toast } from "sonner";
import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { EducationalTabs } from "@/components/education/EducationalTabs";
import { courseCategories } from "@/data/education";
import { handleCourseAccess } from "@/components/education/courseUtils";
import { motion } from "framer-motion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
      // Make sure we validate that the section exists
      const validSections = ["courses", "guides", "books", "whitepapers"];
      if (validSections.includes(section)) {
        setActiveSection(section);
      }
    }
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

  const handleCategoryChange = (categoryId: string) => {
    setActiveCategory(categoryId);
    setActiveSection("courses");
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
      title="SWAG Education Center" 
      activeMainItem="education"
    >
      <motion.div 
        className="space-y-6 px-1"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants}>
          <div className="flex justify-end items-start mb-4">
            <div className="flex items-center gap-2">
              <Select value={activeCategory} onValueChange={handleCategoryChange}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {courseCategories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
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
