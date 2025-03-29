import { GraduationCap, BookOpen, ExternalLink } from "lucide-react";
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
import { toast } from "sonner";

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
    if (comingSoon) {
      toast.info("This course is coming soon. Stay tuned!");
      return;
    }
    
    if (url) {
      e.preventDefault();
      window.open(url, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="flex items-center gap-1 transition-colors hover:bg-accent/20">
          <GraduationCap className="h-5 w-5" />
          <span className="font-medium">SWAG Education Vault</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-72 p-2">
        <DropdownMenuLabel className="text-base font-bold">Course Categories</DropdownMenuLabel>
        <DropdownMenuSeparator className="my-1" />
        
        {courseCategories.map((category) => (
          <Link to={`/education?category=${category.id}`} key={category.id}>
            <DropdownMenuItem className="py-2 cursor-pointer transition-colors">
              <BookOpen className="h-4 w-4 mr-2 opacity-70" />
              {category.name}
            </DropdownMenuItem>
          </Link>
        ))}
        
        <DropdownMenuSeparator className="my-1" />
        <DropdownMenuLabel className="text-base font-bold">Featured Courses</DropdownMenuLabel>
        <DropdownMenuSeparator className="my-1" />
        
        {featuredCourses.map((course) => (
          <DropdownMenuItem 
            key={course.id}
            onClick={(e) => handleExternalLink(e, course.ghlUrl)}
            className="py-2 cursor-pointer transition-colors flex items-center justify-between"
          >
            <span>{course.name}</span>
            <ExternalLink className="h-3 w-3 opacity-70" />
          </DropdownMenuItem>
        ))}
        
        <DropdownMenuSeparator className="my-1" />
        <DropdownMenuLabel className="text-base font-bold">Premium Courses</DropdownMenuLabel>
        <DropdownMenuSeparator className="my-1" />
        
        {premiumCourses.map((course) => (
          <DropdownMenuItem 
            className={`py-2 transition-colors flex items-center justify-between ${course.comingSoon ? "opacity-70" : "cursor-pointer"}`} 
            key={course.id}
            onClick={(e) => handleExternalLink(e, course.ghlUrl, course.comingSoon)}
          >
            <span>{course.name}</span>
            {!course.comingSoon && <ExternalLink className="h-3 w-3 opacity-70" />}
          </DropdownMenuItem>
        ))}
        
        <DropdownMenuSeparator className="my-1" />
        <Link to="/education">
          <DropdownMenuItem className="py-2 mt-1 cursor-pointer transition-colors bg-accent/10 hover:bg-accent/20 text-center font-medium">
            View All Courses
          </DropdownMenuItem>
        </Link>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
