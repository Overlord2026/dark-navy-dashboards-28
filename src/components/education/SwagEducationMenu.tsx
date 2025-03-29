
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
  { 
    id: "financial-fundamentals", 
    name: "Financial Fundamentals",
    ghlUrl: "https://ghl.example.com/courses/financial-fundamentals" 
  },
  { 
    id: "investment-strategies", 
    name: "Investment Strategies 101",
    ghlUrl: "https://ghl.example.com/courses/investment-strategies-101" 
  },
  { 
    id: "wealth-building", 
    name: "Wealth Building for Beginners",
    ghlUrl: "https://ghl.example.com/courses/wealth-building-beginners" 
  },
];

const premiumCourses = [
  { 
    id: "advanced-trading", 
    name: "Advanced Trading (Coming Soon)",
    ghlUrl: "https://ghl.example.com/courses/advanced-trading",
    comingSoon: true
  },
  { 
    id: "estate-planning-premium", 
    name: "Estate Planning (Coming Soon)",
    ghlUrl: "https://ghl.example.com/courses/estate-planning",
    comingSoon: true
  },
];

export function SwagEducationMenu() {
  const handleExternalLink = (e: React.MouseEvent<HTMLDivElement>, url?: string, comingSoon?: boolean) => {
    if (url && !comingSoon) {
      e.preventDefault();
      window.open(url, "_blank", "noopener,noreferrer");
    }
  };

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
          <DropdownMenuItem 
            key={course.id}
            onClick={(e) => handleExternalLink(e, course.ghlUrl)}
            className="cursor-pointer"
          >
            {course.name}
          </DropdownMenuItem>
        ))}
        
        <DropdownMenuSeparator />
        <DropdownMenuLabel>Premium Courses</DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        {premiumCourses.map((course) => (
          <DropdownMenuItem 
            className={`${course.comingSoon ? "opacity-70" : "cursor-pointer"}`} 
            key={course.id}
            onClick={(e) => handleExternalLink(e, course.ghlUrl, course.comingSoon)}
          >
            {course.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
