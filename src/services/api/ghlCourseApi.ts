
import { Course } from '@/types/education';
import { ApiResponse, UserToken } from '@/types/api';
import { toast } from 'sonner';
import { getAllCourses } from '@/data/education/courseUtils';

// Function to verify JWT token - shared with courseApi.ts
export const verifyToken = (token: string): UserToken | null => {
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

// Interface for detailed course content
export interface CourseContent {
  sections: CourseSection[];
  totalDuration: string;
  completionCriteria?: string;
}

export interface CourseSection {
  id: string;
  title: string;
  description?: string;
  lessons: CourseLesson[];
}

export interface CourseLesson {
  id: string;
  title: string;
  duration: string;
  type: 'video' | 'text' | 'quiz' | 'assignment';
  completed?: boolean;
}

// Extended course interface with detailed content
export interface DetailedCourse extends Course {
  instructor?: string;
  enrollmentCount?: number;
  rating?: number;
  content?: CourseContent;
  prerequisites?: string[];
  objectives?: string[];
  lastUpdated?: string;
}

// GET /api/courses/{courseId} endpoint handler
export const fetchCourseDetailsById = async (
  token: string,
  courseId: string | number
): Promise<ApiResponse<DetailedCourse>> => {
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
    const baseCourse = courses.find(c => c.id.toString() === courseId.toString());
    
    if (!baseCourse) {
      return {
        success: false,
        error: 'Course not found',
      };
    }
    
    // In a real application, we would fetch additional details from GHL API
    // For demonstration, we'll enhance the course with mock detailed data
    const detailedCourse: DetailedCourse = {
      ...baseCourse,
      instructor: "Dr. Financial Expert",
      enrollmentCount: 1250,
      rating: 4.8,
      lastUpdated: "2025-03-15",
      prerequisites: [
        "Basic understanding of finance",
        "Familiarity with investment concepts"
      ],
      objectives: [
        "Understand core financial principles",
        "Learn practical investment strategies",
        "Develop a personalized financial plan"
      ],
      content: {
        totalDuration: "8 hours 30 minutes",
        completionCriteria: "Complete all lessons and pass final quiz with score of 80% or higher",
        sections: [
          {
            id: "section-1",
            title: "Introduction to Financial Planning",
            description: "Fundamentals of financial planning and goal setting",
            lessons: [
              {
                id: "lesson-1-1",
                title: "Understanding Your Financial Goals",
                duration: "45 minutes",
                type: "video"
              },
              {
                id: "lesson-1-2",
                title: "Financial Health Assessment",
                duration: "30 minutes",
                type: "assignment"
              }
            ]
          },
          {
            id: "section-2",
            title: "Investment Strategies",
            description: "Core investment approaches for different goals",
            lessons: [
              {
                id: "lesson-2-1",
                title: "Asset Allocation Fundamentals",
                duration: "60 minutes",
                type: "video"
              },
              {
                id: "lesson-2-2",
                title: "Risk Management Techniques",
                duration: "45 minutes",
                type: "video"
              },
              {
                id: "lesson-2-3",
                title: "Investment Strategy Quiz",
                duration: "25 minutes",
                type: "quiz"
              }
            ]
          }
        ]
      }
    };
    
    return {
      success: true,
      data: detailedCourse,
      message: 'Course details retrieved successfully',
    };
  } catch (error) {
    console.error('Error fetching course details:', error);
    return {
      success: false,
      error: 'Failed to retrieve course details. Please try again later.',
    };
  }
};
