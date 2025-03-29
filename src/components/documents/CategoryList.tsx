
import { DocumentCategory } from "@/types/document";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { File, ChevronRight } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface CategoryListProps {
  categories: DocumentCategory[];
  activeCategory: string | null;
  onCategorySelect: (categoryId: string) => void;
}

export const CategoryList = ({ 
  categories, 
  activeCategory, 
  onCategorySelect 
}: CategoryListProps) => {
  return (
    <Card className="bg-[#0a1629] border-none shadow-lg">
      <CardContent className="p-0">
        {categories.map((category, index) => (
          <div key={category.id}>
            <Button 
              variant="ghost" 
              className="w-full p-4 flex items-center justify-between rounded-none text-white"
              onClick={() => onCategorySelect(category.id)}
            >
              <div className="flex items-center space-x-3">
                <File className="h-6 w-6 text-gray-400" />
                <span className="text-lg font-medium">{category.name}</span>
              </div>
              <ChevronRight className="h-5 w-5 text-gray-400" />
            </Button>
            {index < categories.length - 1 && <Separator className="bg-gray-700" />}
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
