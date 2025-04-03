
import { Course, CourseCategory } from '@/types/education';
import { ApiResponse, CourseFilter, UserToken } from '@/types/api';
import { toast } from 'sonner';
import { getAllCourses } from '@/data/education/courseUtils';

// Mock function to verify JWT token
const verifyToken = (token: string): UserToken | null => {
  try {
    // In a real app, this would validate the JWT signature and decode it
    // For demonstration, we'll do a simple check
    if (!token || !token.startsWith('Bearer ')) {
      return null;
    }
    
    // Mock user data - in a real app, this would come from decoding the JWT
    return {
      id: 'user-123',
      email: 'user@example.com',
      role: 'user',
      exp: Date.now() + 3600000 // 1 hour from now
    };
  } catch (error) {
    console.error('Token verification error:', error);
    return null;
  }
};

// Function to simulate the GET /api/courses endpoint
export const fetchCourses = async (
  token: string,
  filters?: CourseFilter
): Promise<ApiResponse<Course[]>> => {
  try {
    // Verify authentication token
    const user = verifyToken(token);
    
    if (!user) {
      return {
        success: false,
        error: 'Unauthorized access. Invalid or expired token.',
      };
    }
    
    // Get all courses from our data
    let courses = getAllCourses();
    
    // Apply filters if provided
    if (filters) {
      if (filters.category) {
        courses = courses.filter(course => 
          course.categoryIds?.includes(filters.category!)
        );
      }
      
      if (filters.tag) {
        // Assuming we have tags in the future, we would filter here
        // For now, just a placeholder
      }
      
      if (filters.level) {
        courses = courses.filter(course => 
          course.level === filters.level
        );
      }
      
      if (filters.isPaid !== undefined) {
        courses = courses.filter(course => 
          course.isPaid === filters.isPaid
        );
      }
    }
    
    // In a real API, we'd probably want to paginate results
    // For simplicity, we'll return all courses
    return {
      success: true,
      data: courses,
      message: 'Courses retrieved successfully',
    };
  } catch (error) {
    console.error('Error fetching courses:', error);
    return {
      success: false,
      error: 'Failed to retrieve courses. Please try again later.',
    };
  }
};

// Simulate a GET /api/courses/:id endpoint
export const fetchCourseById = async (
  token: string,
  courseId: string | number
): Promise<ApiResponse<Course>> => {
  try {
    // Verify authentication token
    const user = verifyToken(token);
    
    if (!user) {
      return {
        success: false,
        error: 'Unauthorized access. Invalid or expired token.',
      };
    }
    
    // Get all courses and find the specific one
    const courses = getAllCourses();
    const course = courses.find(c => c.id.toString() === courseId.toString());
    
    if (!course) {
      return {
        success: false,
        error: 'Course not found',
      };
    }
    
    return {
      success: true,
      data: course,
      message: 'Course retrieved successfully',
    };
  } catch (error) {
    console.error('Error fetching course:', error);
    return {
      success: false,
      error: 'Failed to retrieve course. Please try again later.',
    };
  }
};
