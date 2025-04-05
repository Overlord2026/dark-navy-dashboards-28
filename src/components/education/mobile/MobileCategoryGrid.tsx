
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CourseCategory } from "@/types/education";
import { 
  Book, 
  PieChart,
  BarChart,
  FileText,
  GraduationCap
} from "lucide-react";
import { toast } from "sonner";

interface MobileCategoryGridProps {
  categories: CourseCategory[];
  onSelectCategory?: (categoryId: string) => void;
}

export function MobileCategoryGrid({ categories, onSelectCategory }: MobileCategoryGridProps) {
  const getCategoryIcon = (categoryId: string) => {
    switch (categoryId) {
      case "retirement-income":
        return <Book className="h-5 w-5 text-blue-400" />;
      case "tax-planning":
        return <PieChart className="h-5 w-5 text-green-400" />;
      case "wealth-management":
        return <BarChart className="h-5 w-5 text-purple-400" />;
      case "estate-planning":
        return <FileText className="h-5 w-5 text-orange-400" />;
      default:
        return <GraduationCap className="h-5 w-5 text-primary" />;
    }
  };

  const handleCategoryClick = (categoryId: string) => {
    if (onSelectCategory) {
      onSelectCategory(categoryId);
    } else {
      toast.info("Category browsing coming soon");
    }
  };

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-medium">Browse by Topic</h3>
      <div className="grid grid-cols-2 gap-3">
        {categories.slice(0, 6).map((category) => (
          category.id !== "all-courses" && (
            <Card 
              key={category.id} 
              className="bg-[#1B1B32] border border-[#2A2A45] cursor-pointer" 
              onClick={() => handleCategoryClick(category.id)}
            >
              <CardContent className="p-3">
                <div className="flex flex-col items-center text-center">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                    {getCategoryIcon(category.id)}
                  </div>
                  <h4 className="text-sm font-medium">{category.name}</h4>
                </div>
              </CardContent>
            </Card>
          )
        ))}
      </div>
      <Button variant="outline" className="w-full" onClick={() => toast.info("More categories coming soon")}>
        View All Categories
      </Button>
    </div>
  );
}

export default MobileCategoryGrid;
