
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
      return <ShieldIcon className="h-4 w-4 text-blue-500" />;
    case "wills":
    case "living-will":
      return <FileTextIcon className="h-4 w-4 text-green-500" />;
    case "beneficiaries":
      return <UserIcon className="h-4 w-4 text-purple-500" />;
    case "financial-poa":
      return <File className="h-4 w-4 text-yellow-500" />;
    case "medical-poa":
    case "advanced-healthcare":
      return <HeartPulseIcon className="h-4 w-4 text-red-500" />;
    case "guardianship":
      return <BookIcon className="h-4 w-4 text-indigo-500" />;
    case "property-deeds":
    case "lady-bird-deeds":
      return <HomeIcon className="h-4 w-4 text-orange-500" />;
    case "healthcare":
      return <HeartPulseIcon className="h-4 w-4 text-blue-500" />;
    case "insurance-coverage":
      return <ShieldIcon className="h-4 w-4 text-green-500" />;
    case "prescriptions":
      return <FileTextIcon className="h-4 w-4 text-purple-500" />;
    case "physicians":
      return <UserIcon className="h-4 w-4 text-red-500" />;
    case "medical-records":
      return <File className="h-4 w-4 text-orange-500" />;
    default:
      return <FolderIcon className="h-4 w-4 text-gray-500" />;
  }
};

export const CategoryList = ({ 
  categories, 
  activeCategory, 
  onCategorySelect 
}: CategoryListProps) => {
  return (
    <Card className="border shadow-sm">
      <CardContent className="p-0">
        <div className="space-y-0">
          {categories.map((category, index) => (
            <div key={category.id}>
              <Button 
                variant="ghost" 
                className={cn(
                  "w-full justify-start p-3 h-auto rounded-none text-left transition-colors hover:bg-muted/50",
                  activeCategory === category.id && "bg-blue-50 text-blue-700 border-r-2 border-blue-500"
                )}
                onClick={() => onCategorySelect(category.id)}
              >
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center space-x-3 min-w-0 flex-1">
                    <div className="flex-shrink-0">
                      {getCategoryIcon(category.id)}
                    </div>
                    <span className="text-sm font-medium truncate">{category.name}</span>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground flex-shrink-0 ml-2" />
                </div>
              </Button>
              {index < categories.length - 1 && (
                <Separator className="mx-3" />
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
