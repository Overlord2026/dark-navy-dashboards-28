
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface CourseCategoryProps {
  categories: Array<{ id: string, name: string, active?: boolean }>;
  onSelectCategory: (categoryId: string) => void;
}

export function CourseCategories({ categories, onSelectCategory }: CourseCategoryProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1 
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {categories.map((category) => (
        category.id !== "all-courses" && (
          <motion.div key={category.id} variants={itemVariants}>
            <Card className="h-full hover:border-primary hover:shadow-md transition-all duration-300">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">{category.name}</CardTitle>
              </CardHeader>
              <CardContent className="flex items-end pb-6">
                <Button 
                  variant="outline" 
                  className="w-full hover:bg-primary hover:text-primary-foreground transition-colors duration-300"
                  onClick={() => onSelectCategory(category.id)}
                >
                  Explore Courses
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )
      ))}
    </motion.div>
  );
}
