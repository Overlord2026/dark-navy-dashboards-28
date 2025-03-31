
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Book, BookOpen, GraduationCap, Info } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface CourseCategoryCardProps {
  category: {
    id: string;
    name: string;
  };
  courseCount?: number;
}

// Map of icons for different course categories
const categoryIcons: Record<string, React.ReactNode> = {
  "retirement-income": <Book className="h-6 w-6 text-primary" />,
  "social-security": <BookOpen className="h-6 w-6 text-primary" />,
  "income-distribution": <GraduationCap className="h-6 w-6 text-primary" />,
  "annuities": <Info className="h-6 w-6 text-primary" />,
  "tax-planning": <Book className="h-6 w-6 text-primary" />,
  "advanced-tax": <BookOpen className="h-6 w-6 text-primary" />,
  "wealth-management": <GraduationCap className="h-6 w-6 text-primary" />,
  "estate-planning": <Info className="h-6 w-6 text-primary" />,
  "florida-residency": <Book className="h-6 w-6 text-primary" />,
  "texas-residency": <BookOpen className="h-6 w-6 text-primary" />,
};

export function CourseCategoryCard({ category, courseCount = 0 }: CourseCategoryCardProps) {
  return (
    <Card className="h-full transition-all duration-200 hover:shadow-md cursor-pointer">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-2">
            {categoryIcons[category.id] || <GraduationCap className="h-6 w-6 text-primary" />}
          </div>
          {courseCount > 0 && (
            <Badge variant="outline" className="bg-primary/10 text-primary border-0">
              {courseCount} courses
            </Badge>
          )}
        </div>
        <CardTitle className="text-lg">{category.name}</CardTitle>
        <CardDescription className="text-muted-foreground line-clamp-2">
          {getDescriptionForCategory(category.id)}
        </CardDescription>
      </CardHeader>
      <CardContent className="text-sm text-muted-foreground pb-2">
        <p>Explore courses, guides, and resources</p>
      </CardContent>
      <CardFooter>
        <div className="text-sm text-primary font-medium">View Category →</div>
      </CardFooter>
    </Card>
  );
}

// Helper function to get descriptions for each category
function getDescriptionForCategory(categoryId: string): string {
  const descriptions: Record<string, string> = {
    "retirement-income": "Learn how to create sustainable income streams for retirement",
    "social-security": "Maximize your Social Security benefits with optimal claiming strategies",
    "income-distribution": "Optimize your retirement income distribution for tax efficiency",
    "annuities": "Understand different types of annuities and their role in retirement planning",
    "tax-planning": "Implement strategies to minimize taxes and maximize your wealth",
    "advanced-tax": "Advanced tax strategies for high-net-worth individuals",
    "wealth-management": "Comprehensive approach to growing and protecting your wealth",
    "estate-planning": "Essential estate planning concepts to protect your legacy",
    "florida-residency": "Financial advantages of establishing Florida residency",
    "texas-residency": "Tax benefits and financial considerations for Texas residents",
    "all-courses": "Browse our complete catalog of educational resources",
  };
  
  return descriptions[categoryId] || "Expand your financial knowledge with our educational resources";
}
