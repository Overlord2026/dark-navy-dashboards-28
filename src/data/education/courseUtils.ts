
import { Course, CourseCategory } from '@/types/education';
import { createShuffledArray } from '@/lib/utils';
import { courses } from './coursesByCategory';

export const getRandomCourses = (count: number): Course[] => {
  // Create a flattened array of all courses
  const allCourses = Object.values(courses).flat();
  return createShuffledArray(allCourses).slice(0, count);
};

export const getCoursesByCategory = (categoryId: string): Course[] => {
  return courses[categoryId as CourseCategory] || [];
};

export const getAllCourses = (): Course[] => {
  return Object.values(courses).flat();
};

export const getFeaturedCourses = (count: number = 3): Course[] => {
  // In a real app, you'd have a property on courses to mark them as featured
  // For now, let's just return random courses
  return getRandomCourses(count);
};

export const getPopularCourses = (count: number = 4): Course[] => {
  // In a real app, this would be based on user engagement metrics
  // For now, let's just return different random courses
  return getRandomCourses(count);
};

export const searchCourses = (query: string): Course[] => {
  if (!query) return [];
  
  const searchTerm = query.toLowerCase();
  return getAllCourses().filter(course => 
    course.title.toLowerCase().includes(searchTerm) || 
    course.description.toLowerCase().includes(searchTerm)
  );
};
