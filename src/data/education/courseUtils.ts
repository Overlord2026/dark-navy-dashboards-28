
import { Course, CourseCategory, SubscriptionTier } from "@/types/education";
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
  
  // Add popular courses if they exist
  if (popularCourses) {
    popularCourses.forEach(course => {
      // Ensure course has a valid level type
      if (isValidCourseLevel(course.level)) {
        coursesMap.set(course.id, course as Course);
      }
    });
  }
  
  // Add courses by category
  Object.values(coursesByCategory || {}).forEach(courses => {
    courses.forEach(course => {
      // Ensure course has a valid level type
      if (isValidCourseLevel(course.level)) {
        coursesMap.set(course.id, course as Course);
      }
    });
  });
  
  return Array.from(coursesMap.values());
};

// Helper function to validate course level
const isValidCourseLevel = (level: string): level is Course['level'] => {
  return ['Beginner', 'Intermediate', 'Advanced', 'All Levels'].includes(level);
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
 * Get courses by subscription tier
 */
export const getCoursesByTier = (tier: SubscriptionTier): Course[] => {
  const tierLevels: Record<SubscriptionTier, number> = {
    "Basic": 1,
    "Premium": 2,
    "Elite": 3
  };
  
  return getAllCourses().filter(course => {
    if (!course.requiredTier) return true;
    const courseTierLevel = tierLevels[course.requiredTier];
    return tierLevels[tier] >= courseTierLevel;
  });
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
