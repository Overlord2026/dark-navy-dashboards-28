
import { Course, CourseCategory } from '@/types/education';
import { coursesByCategory } from './coursesByCategory';
import { featuredCourses } from './featuredCourses';
import { popularCourses } from './popularCourses';

export const getCoursesByCategory = (category: CourseCategory): Course[] => {
  return coursesByCategory[category] || [];
};

export const getAllCourses = (): Course[] => {
  const allCourses: Course[] = [];
  
  Object.values(coursesByCategory).forEach((categoryCourses) => {
    allCourses.push(...categoryCourses);
  });
  
  return allCourses;
};

export const getFeaturedCourses = (): Course[] => {
  return featuredCourses;
};

export const getPopularCourses = (): Course[] => {
  return popularCourses;
};

export const getRelatedCourses = (courseId: string, category: CourseCategory): Course[] => {
  const categoryCourses = getCoursesByCategory(category);
  return categoryCourses.filter(course => course.id !== courseId).slice(0, 3);
};
