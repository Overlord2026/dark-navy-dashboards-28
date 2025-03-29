
import { Course } from '@/types/education';
import { getAllCourses, getCourseById } from './courseData';
import { toast } from 'sonner';

/**
 * Handle course access based on enrollment status
 */
export const handleCourseAccess = (
  courseId: string | number,
  title: string,
  isPaid: boolean,
  ghlUrl?: string,
  setIsProcessing?: (id: string | number | null) => void
) => {
  if (setIsProcessing) setIsProcessing(courseId);

  if (!isPaid) {
    // For free courses, we can directly enroll
    toast.success(`Successfully enrolled in "${title}"`);
    if (setIsProcessing) setTimeout(() => setIsProcessing(null), 1000);
    return;
  }

  // For paid courses with GHL url, we redirect
  if (ghlUrl) {
    toast.info(`Redirecting to enrollment for "${title}"`);
    window.open(ghlUrl, '_blank');
    if (setIsProcessing) setTimeout(() => setIsProcessing(null), 1000);
    return;
  }

  // For paid courses without GHL url
  toast.info(`Please contact support to enroll in "${title}"`);
  if (setIsProcessing) setTimeout(() => setIsProcessing(null), 1000);
};

/**
 * Get a course by ID and format for display
 */
export const getFormattedCourseById = (id: string | number): Course | null => {
  const course = getCourseById(id);
  if (!course) return null;
  return course;
};

/**
 * Get all courses
 */
export const getFormattedCourses = (): Course[] => {
  return getAllCourses();
};

/**
 * Filter courses by category
 */
export const filterCoursesByCategory = (categoryId: string): Course[] => {
  if (categoryId === 'all-courses') {
    return getAllCourses();
  }
  
  return getAllCourses().filter(
    (course) => course.categoryIds?.includes(categoryId)
  );
};
