
import { DocumentCategory } from "@/types/document";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { File, ChevronRight, FolderIcon, ShieldIcon, FileTextIcon, UserIcon, HeartPulseIcon, BookIcon, HomeIcon } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

interface CategoryListProps {
  categories: DocumentCategory[];
  activeCategory: string | null;
  onCategorySelect: (categoryId: string) => void;
}

// Helper function to get appropriate icon for category
const getCategoryIcon = (categoryId: string) => {
  switch (categoryId) {
    case "trusts":
    case "florida-trusts":
    case "charitable-trusts":
      return <ShieldIcon className="h-5 w-5 text-blue-400" />;
    case "wills":
    case "living-will":
      return <FileTextIcon className="h-5 w-5 text-green-400" />;
    case "beneficiaries":
      return <UserIcon className="h-5 w-5 text-purple-400" />;
    case "financial-poa":
      return <File className="h-5 w-5 text-yellow-400" />;
    case "medical-poa":
    case "advanced-healthcare":
      return <HeartPulseIcon className="h-5 w-5 text-red-400" />;
    case "guardianship":
      return <BookIcon className="h-5 w-5 text-indigo-400" />;
    case "property-deeds":
    case "lady-bird-deeds":
      return <HomeIcon className="h-5 w-5 text-orange-400" />;
    default:
      return <FolderIcon className="h-5 w-5 text-gray-400" />;
  }
};

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
              className={cn(
                "w-full p-4 flex items-center justify-between rounded-none text-white transition-colors",
                activeCategory === category.id && "bg-blue-900/30"
              )}
              onClick={() => onCategorySelect(category.id)}
            >
              <div className="flex items-center space-x-3">
                {getCategoryIcon(category.id)}
                <span className="text-base font-medium">{category.name}</span>
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
