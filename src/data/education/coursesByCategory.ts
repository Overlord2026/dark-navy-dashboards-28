
import { Course } from "@/types/education";
import { coursesByCategory as courseByCategoryData } from "./coursesByCategory";

// Create a flat array of all courses from all categories for general use
export const allCourses: Course[] = Object.values(courseByCategoryData).flat();

// Re-export the coursesByCategory data
export { coursesByCategory } from "./coursesByCategory";
