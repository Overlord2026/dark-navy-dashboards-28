
import { CourseCategory } from "@/types/education";
export { featuredCourses } from "./featuredCourses";
export { popularCourses } from "./popularCourses";
export { coursesByCategory } from "./coursesByCategory";
export { educationalResources } from "./educationalResources";
export * from "./courseUtils";

// Course categories consistent across the application
export const courseCategories: CourseCategory[] = [
  { id: "all-courses", name: "All Courses", active: true },
  { id: "retirement-income", name: "Retirement Income" },
  { id: "tax-planning", name: "Tax Planning" },
  { id: "estate-planning", name: "Estate Planning" },
  { id: "wealth-management", name: "Wealth Management" },
  { id: "social-security", name: "Social Security" },
  { id: "income-distribution", name: "Income Distribution" },
  { id: "annuities", name: "Annuities" },
  { id: "advanced-tax", name: "Advanced Tax Strategies" },
  { id: "florida-residency", name: "Florida Residency" },
  { id: "texas-residency", name: "Texas Residency" }
];
