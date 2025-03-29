
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
import { useState } from "react";
import { handleCourseAccess } from "./courseUtils";

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
  { id: "advanced-estate-planning", name: "Advanced Estate Planning" },
  { id: "investment-management", name: "Investment Management" },
  { id: "alternative-investments", name: "Alternative Investments" },
  { id: "intelligent-allocation", name: "Intelligent Allocation Models" },
  { id: "florida-residency", name: "Benefits of Florida Residency" },
  { id: "texas-residency", name: "Benefits of Texas Residency" },
];

const featuredCourses = [
  { 
    id: "financial-fundamentals", 
    name: "Financial Fundamentals",
    ghlUrl: "https://ghl.example.com/courses/financial-fundamentals",
    isPaid: false
  },
  { 
    id: "investment-strategies", 
    name: "Investment Strategies 101",
    ghlUrl: "https://ghl.example.com/courses/investment-strategies-101",
    isPaid: false
  },
  { 
    id: "wealth-building", 
    name: "Wealth Building for Beginners",
    ghlUrl: "https://ghl.example.com/courses/wealth-building-beginners",
    isPaid: false
  },
];

const premiumCourses = [
  { 
    id: "advanced-trading", 
    name: "Advanced Trading (Coming Soon)",
    ghlUrl: "https://ghl.example.com/courses/advanced-trading",
    isPaid: true,
    comingSoon: true
  },
  { 
    id: "estate-planning-premium", 
    name: "Estate Planning (Coming Soon)",
    ghlUrl: "https://ghl.example.com/courses/estate-planning",
    isPaid: true,
    comingSoon: true
  },
];

export function SwagEducationMenu() {
  const [isProcessing, setIsProcessing] = useState<string | null>(null);

  const handleExternalLink = (e: React.MouseEvent<HTMLDivElement>, course: any) => {
    e.preventDefault();
    
    if (course.comingSoon) {
      toast.info(`${course.name} is coming soon. Stay tuned!`);
      return;
    }
    
    handleCourseAccess(course.id, course.name, course.isPaid, course.ghlUrl, setIsProcessing);
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
        <DropdownMenuLabel className="text-base font-bold">Resources</DropdownMenuLabel>
        <DropdownMenuSeparator className="my-1" />
        
        <Link to={`/education?section=guides`}>
          <DropdownMenuItem className="py-2 cursor-pointer transition-colors">
            <BookOpen className="h-4 w-4 mr-2 opacity-70" />
            Guides
          </DropdownMenuItem>
        </Link>
        
        <Link to={`/education?section=books`}>
          <DropdownMenuItem className="py-2 cursor-pointer transition-colors">
            <BookOpen className="h-4 w-4 mr-2 opacity-70" />
            Recommended Reading
          </DropdownMenuItem>
        </Link>
        
        <DropdownMenuSeparator className="my-1" />
        <DropdownMenuLabel className="text-base font-bold">Featured Courses</DropdownMenuLabel>
        <DropdownMenuSeparator className="my-1" />
        
        {featuredCourses.map((course) => (
          <DropdownMenuItem 
            key={course.id}
            onClick={(e) => handleExternalLink(e, course)}
            className="py-2 cursor-pointer transition-colors flex items-center justify-between"
          >
            <span>{course.name}</span>
            {isProcessing === course.id ? (
              <svg className="animate-spin h-3 w-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <ExternalLink className="h-3 w-3 opacity-70" />
            )}
          </DropdownMenuItem>
        ))}
        
        <DropdownMenuSeparator className="my-1" />
        <DropdownMenuLabel className="text-base font-bold">Premium Courses</DropdownMenuLabel>
        <DropdownMenuSeparator className="my-1" />
        
        {premiumCourses.map((course) => (
          <DropdownMenuItem 
            className={`py-2 transition-colors flex items-center justify-between ${course.comingSoon ? "opacity-70" : "cursor-pointer"}`} 
            key={course.id}
            onClick={(e) => handleExternalLink(e, course)}
          >
            <span>{course.name}</span>
            {isProcessing === course.id ? (
              <svg className="animate-spin h-3 w-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : !course.comingSoon && (
              <ExternalLink className="h-3 w-3 opacity-70" />
            )}
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
