
import { Course } from "@/types/education";
import { logger } from "@/services/logging/loggingService";
import { coursesByCategory, allCourses } from "@/data/education";

// Interface for API responses
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

/**
 * Mock function to fetch courses from the API
 * In the future, this would make actual API calls
 */
export const fetchCourses = async (token: string): Promise<ApiResponse<Course[]>> => {
  try {
    logger.info(`Fetching courses with token: ${token.substring(0, 15)}...`);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // This would be replaced with a real API call in the future
    return {
      success: true,
      data: Object.values(coursesByCategory).flat() as Course[]
    };
  } catch (error) {
    logger.error("Error fetching courses:", error);
    return {
      success: false,
      error: "Failed to fetch courses"
    };
  }
};

/**
 * Mock function to fetch a single course by ID
 */
export const fetchCourseById = async (courseId: string | number, token: string): Promise<ApiResponse<Course>> => {
  try {
    logger.info(`Fetching course ${courseId} with token: ${token.substring(0, 15)}...`);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Find the course in the mock data
    const course = Object.values(coursesByCategory)
      .flat()
      .find(course => course.id === courseId);
      
    if (!course) {
      return {
        success: false,
        error: "Course not found"
      };
    }
    
    return {
      success: true,
      data: course as Course
    };
  } catch (error) {
    logger.error(`Error fetching course ${courseId}:`, error);
    return {
      success: false,
      error: "Failed to fetch course details"
    };
  }
};

/**
 * Mock function to enroll in a course
 */
export const enrollInCourse = async (
  courseId: string | number, 
  userId: string,
  token: string
): Promise<ApiResponse<{enrollmentId: string}>> => {
  try {
    logger.info(`Enrolling user ${userId} in course ${courseId}`);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // This would be replaced with a real API call in the future
    return {
      success: true,
      data: {
        enrollmentId: `enroll-${userId}-${courseId}-${Date.now()}`
      }
    };
  } catch (error) {
    logger.error(`Error enrolling in course ${courseId}:`, error);
    return {
      success: false,
      error: "Failed to enroll in course"
    };
  }
};
