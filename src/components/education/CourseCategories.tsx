
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface CourseCategoryProps {
  categories: Array<{ id: string, name: string, active?: boolean }>;
  onSelectCategory: (categoryId: string) => void;
}

export function CourseCategories({ categories, onSelectCategory }: CourseCategoryProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {categories.map((category) => (
        category.id !== "all-courses" && (
          <Card key={category.id} className="hover:border-primary hover:shadow-md transition-all">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">{category.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => onSelectCategory(category.id)}
              >
                Explore Courses
              </Button>
            </CardContent>
          </Card>
        )
      ))}
    </div>
  );
}
