
import { Course, CourseCategory } from "@/types/education";
import { featuredCourses } from "./featuredCourses";
import { popularCourses } from "./popularCourses";
import { coursesByCategory } from "./coursesByCategory";

/**
 * Get all courses from all course lists
 */
export const getAllCourses = (): Course[] => {
  // Create a map to deduplicate courses by ID
  const coursesMap = new Map<string | number, Course>();
  
  // Add featured courses
  featuredCourses.forEach(course => {
    coursesMap.set(course.id, course);
  });
  
  // Add popular courses
  popularCourses.forEach(course => {
    coursesMap.set(course.id, course);
  });
  
  // Add courses by category
  Object.values(coursesByCategory).forEach(courses => {
    courses.forEach(course => {
      coursesMap.set(course.id, course);
    });
  });
  
  return Array.from(coursesMap.values());
};

/**
 * Filter courses by category ID
 */
export const getCoursesByCategory = (categoryId: string): Course[] => {
  if (categoryId === "all-courses") {
    return getAllCourses();
  }
  
  return coursesByCategory[categoryId] || [];
};

/**
 * Get free courses only
 */
export const getFreeCourses = (): Course[] => {
  return getAllCourses().filter(course => !course.isPaid);
};

/**
 * Get paid courses only
 */
export const getPaidCourses = (): Course[] => {
  return getAllCourses().filter(course => course.isPaid);
};

/**
 * Get courses by difficulty level
 */
export const getCoursesByLevel = (level: Course['level']): Course[] => {
  return getAllCourses().filter(course => course.level === level);
};

/**
 * Search courses by title or description
 */
export const searchCourses = (query: string): Course[] => {
  const lowerCaseQuery = query.toLowerCase();
  return getAllCourses().filter(
    course => 
      course.title.toLowerCase().includes(lowerCaseQuery) || 
      course.description.toLowerCase().includes(lowerCaseQuery)
  );
};
