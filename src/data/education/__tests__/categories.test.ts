
import { courseCategories } from '../categories';
import { CourseCategory } from '@/types/education';

describe('Course Categories', () => {
  test('each category should have required properties', () => {
    courseCategories.forEach((category: CourseCategory) => {
      expect(category).toHaveProperty('id');
      expect(category).toHaveProperty('name');
      expect(category).toHaveProperty('description');
      expect(typeof category.description).toBe('string');
      expect(category.description.length).toBeGreaterThan(0);
    });
  });

  test('active property should be boolean when present', () => {
    courseCategories.forEach((category: CourseCategory) => {
      if ('active' in category) {
        expect(typeof category.active).toBe('boolean');
      }
    });
  });

  test('category IDs should be unique', () => {
    const ids = courseCategories.map(cat => cat.id);
    const uniqueIds = new Set(ids);
    expect(ids.length).toBe(uniqueIds.size);
  });
});
