
import { GraduationCap } from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const courseCategories = [
  { id: "all-courses", name: "All Courses" },
  { id: "retirement-income", name: "Retirement Income Planning Basics" },
  { id: "social-security", name: "Social Security Optimization" },
  { id: "income-distribution", name: "Retirement Income Distribution Optimization" },
  { id: "annuities", name: "Understanding Annuities" },
  { id: "tax-planning", name: "Proactive Tax Planning" },
  { id: "advanced-tax", name: "Advanced Tax Planning" },
  { id: "wealth-management", name: "Holistic Wealth Management" },
  { id: "estate-planning", name: "Estate Planning Basics" },
  { id: "florida-residency", name: "Benefits of Florida Residency" },
  { id: "texas-residency", name: "Benefits of Texas Residency" },
];

const featuredCourses = [
  { id: "financial-fundamentals", name: "Financial Fundamentals" },
  { id: "investment-strategies", name: "Investment Strategies 101" },
  { id: "wealth-building", name: "Wealth Building for Beginners" },
];

const premiumCourses = [
  { id: "advanced-trading", name: "Advanced Trading (Coming Soon)" },
  { id: "estate-planning-premium", name: "Estate Planning (Coming Soon)" },
];

export function SwagEducationMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="flex items-center gap-1">
          <GraduationCap className="h-5 w-5" />
          <span>SWAG Education Vault</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-72">
        <DropdownMenuLabel>Course Categories</DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        {courseCategories.map((category) => (
          <Link to={`/education?category=${category.id}`} key={category.id}>
            <DropdownMenuItem>
              {category.name}
            </DropdownMenuItem>
          </Link>
        ))}
        
        <DropdownMenuSeparator />
        <DropdownMenuLabel>Featured Courses</DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        {featuredCourses.map((course) => (
          <Link to={`/education?course=${course.id}`} key={course.id}>
            <DropdownMenuItem>
              {course.name}
            </DropdownMenuItem>
          </Link>
        ))}
        
        <DropdownMenuSeparator />
        <DropdownMenuLabel>Premium Courses</DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        {premiumCourses.map((course) => (
          <DropdownMenuItem className="opacity-70" key={course.id}>
            {course.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
