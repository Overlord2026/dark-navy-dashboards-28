
import { Course, CourseCategory } from '@/types/education';
import { coursesByCategory } from './coursesByCategory';
import { featuredCourses } from './featuredCourses';
import { popularCourses } from './popularCourses';

export const getCoursesByCategory = (categoryId: string): Course[] => {
  // Type-safe access to coursesByCategory using categoryId as index
  return (coursesByCategory as any)[categoryId] || [];
};

export const getAllCourses = (): Course[] => {
  const allCourses: Course[] = [];
  
  // Safely iterate over the coursesByCategory object
  Object.keys(coursesByCategory).forEach((categoryId) => {
    allCourses.push(...(coursesByCategory as any)[categoryId]);
  });
  
  return allCourses;
};

export const getFeaturedCourses = (): Course[] => {
  return featuredCourses;
};

export const getPopularCourses = (): Course[] => {
  return popularCourses as Course[];
};

export const getRelatedCourses = (courseId: string, categoryId: string): Course[] => {
  const categoryCourses = getCoursesByCategory(categoryId);
  return categoryCourses.filter(course => course.id !== courseId).slice(0, 3);
};
