
import { CourseCategory } from "@/types/education";

export const courseCategories: CourseCategory[] = [
  { 
    id: "all-courses", 
    name: "All Courses", 
    description: "Browse our complete catalog of educational resources",
    active: true 
  },
  { 
    id: "financial-basics", 
    name: "Financial Basics",
    description: "Learn the fundamentals of personal finance and money management" 
  },
  { 
    id: "investing", 
    name: "Investing",
    description: "Master investment strategies and portfolio management" 
  },
  { 
    id: "retirement", 
    name: "Retirement Planning",
    description: "Plan for a secure and comfortable retirement" 
  },
  { 
    id: "tax-planning", 
    name: "Tax Planning",
    description: "Understand tax strategies and optimization techniques" 
  },
  { 
    id: "estate-planning", 
    name: "Estate Planning",
    description: "Learn about estate planning and wealth transfer" 
  },
  { 
    id: "debt-management", 
    name: "Debt Management",
    description: "Strategies for managing and eliminating debt" 
  },
  { 
    id: "insurance", 
    name: "Insurance",
    description: "Understanding different types of insurance and coverage" 
  },
  { 
    id: "business", 
    name: "Business Education",
    description: "Business fundamentals and entrepreneurship resources" 
  }
];
