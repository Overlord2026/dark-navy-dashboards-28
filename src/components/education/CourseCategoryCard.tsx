
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Book, BookOpen, GraduationCap, Info } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { CourseCategory } from "@/types/education";
import { useNavigate } from "react-router-dom";

interface CourseCategoryCardProps {
  category: CourseCategory;
  courseCount?: number;
}

// Map of icons for different course categories
const categoryIcons: Record<string, React.ReactNode> = {
  "retirement-income": <Book className="h-6 w-6 text-blue-500" />,
  "social-security": <BookOpen className="h-6 w-6 text-green-500" />,
  "income-distribution": <GraduationCap className="h-6 w-6 text-purple-500" />,
  "annuities": <Info className="h-6 w-6 text-amber-500" />,
  "tax-planning": <Book className="h-6 w-6 text-red-500" />,
  "advanced-tax": <BookOpen className="h-6 w-6 text-orange-500" />,
  "wealth-management": <GraduationCap className="h-6 w-6 text-indigo-500" />,
  "estate-planning": <Info className="h-6 w-6 text-teal-500" />,
  "florida-residency": <Book className="h-6 w-6 text-cyan-500" />,
  "texas-residency": <BookOpen className="h-6 w-6 text-lime-500" />,
};

export function CourseCategoryCard({ category, courseCount = 0 }: CourseCategoryCardProps) {
  const navigate = useNavigate();
  
  const handleClick = () => {
    navigate(`/education?category=${category.id}`);
  };
  
  return (
    <Card 
      className="h-full transition-all duration-200 hover:shadow-md cursor-pointer bg-[#0F1C2E] border-blue-900/30"
      onClick={handleClick}
    >
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center mb-2">
            {categoryIcons[category.id] || <GraduationCap className="h-6 w-6 text-blue-500" />}
          </div>
          {courseCount > 0 && (
            <Badge variant="outline" className="bg-blue-500/10 text-blue-400 border-0">
              {courseCount} courses
            </Badge>
          )}
        </div>
        <CardTitle className="text-lg">{category.name}</CardTitle>
        <CardDescription className="text-muted-foreground">
          {getDescriptionForCategory(category.id)}
        </CardDescription>
      </CardHeader>
      <CardContent className="text-sm text-muted-foreground pb-2">
        <p>Explore courses, guides, and resources</p>
      </CardContent>
      <CardFooter>
        <div className="text-sm text-blue-400 font-medium">View Category →</div>
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
