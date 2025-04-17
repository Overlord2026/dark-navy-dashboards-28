
import { featuredCourses } from '../featuredCourses';
import { popularCourses } from '../popularCourses';
import { Course } from '@/types/education';

describe('Course Data Structure', () => {
  test('featured courses should match Course interface', () => {
    featuredCourses.forEach((course: Course) => {
      expect(course).toHaveProperty('id');
      expect(typeof course.id).toBe('string');
      expect(course).toHaveProperty('title');
      expect(course).toHaveProperty('description');
      expect(course).toHaveProperty('categoryId');
      expect(course).toHaveProperty('instructor');
      expect(course).toHaveProperty('duration');
      expect(course).toHaveProperty('level');
      expect(course).toHaveProperty('price');
    });
  });

  test('popular courses should match Course interface', () => {
    popularCourses.forEach((course: Course) => {
      expect(course).toHaveProperty('id');
      expect(typeof course.id).toBe('string');
      expect(course).toHaveProperty('title');
      expect(course).toHaveProperty('description');
      expect(course).toHaveProperty('categoryId');
      expect(course).toHaveProperty('instructor');
      expect(course).toHaveProperty('duration');
      expect(course).toHaveProperty('level');
      expect(course).toHaveProperty('price');
    });
  });
});
