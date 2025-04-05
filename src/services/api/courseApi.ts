
import { toast } from 'sonner';
import { ApiResponse } from '@/types/api';
import { Course } from '@/types/education';
import { getAllCourses } from '@/data/education/courseUtils';
import { logger } from '@/services/logging/loggingService';

/**
 * Mock API function for fetching all courses
 * In a real implementation, this would make an API call
 */
export const fetchCourses = async (token: string): Promise<ApiResponse<Course[]>> => {
  try {
    logger.info('Fetching courses', {}, 'CourseAPI');
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // For demo purposes, we'll use the local course data
    // In a real implementation, this would be an API call
    const courses = getAllCourses();
    
    // Validate mock token
    if (!token || !token.includes('mock-jwt-token')) {
      logger.warning('Invalid token in fetchCourses', { tokenProvided: !!token }, 'CourseAPI');
      return {
        success: false,
        error: 'Invalid authentication token',
      };
    }
    
    return {
      success: true,
      data: courses,
      message: 'Courses fetched successfully',
    };
  } catch (error) {
    logger.error('Error fetching courses:', error, 'CourseAPI');
    return {
      success: false,
      error: 'Failed to fetch courses. Please try again later.',
    };
  }
};

/**
 * Mock API function for fetching a course by ID
 * In a real implementation, this would make an API call
 */
export const fetchCourseById = async (token: string, courseId: string | number): Promise<ApiResponse<Course>> => {
  try {
    logger.info(`Fetching course by ID: ${courseId}`, {}, 'CourseAPI');
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Validate mock token
    if (!token || !token.includes('mock-jwt-token')) {
      logger.warning('Invalid token in fetchCourseById', { courseId, tokenProvided: !!token }, 'CourseAPI');
      return {
        success: false,
        error: 'Invalid authentication token',
      };
    }
    
    // For demo purposes, we'll use the local course data
    const courses = getAllCourses();
    const course = courses.find(c => c.id.toString() === courseId.toString());
    
    if (!course) {
      logger.warning(`Course not found: ${courseId}`, {}, 'CourseAPI');
      return {
        success: false,
        error: 'Course not found',
      };
    }
    
    return {
      success: true,
      data: course,
      message: 'Course fetched successfully',
    };
  } catch (error) {
    logger.error('Error fetching course by ID:', error, 'CourseAPI');
    return {
      success: false,
      error: 'Failed to fetch course. Please try again later.',
    };
  }
};
