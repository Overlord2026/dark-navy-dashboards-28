
import React, { useMemo } from 'react';
import { CourseCard } from "./CourseCard";

interface CourseProps {
  id: string | number;
  title: string;
  description: string;
  isPaid: boolean;
  level?: string;
  duration?: string;
  comingSoon?: boolean;
  ghlUrl?: string;
  author?: string;
}

interface CourseListProps {
  title: string;
  courses: CourseProps[];
  onCourseEnrollment: (courseId: string | number, title: string, isPaid: boolean, ghlUrl?: string) => void;
}

export const CourseList = React.memo<CourseListProps>(({ title, courses, onCourseEnrollment }) => {
  const renderedCourses = useMemo(() => 
    courses.map((course) => (
      <CourseCard
        key={course.id}
        {...course}
        onClick={() => onCourseEnrollment(course.id, course.title, course.isPaid, course.ghlUrl)}
      />
    )), [courses, onCourseEnrollment]);

  return (
    <div className="mt-10">
      <h3 className="text-xl font-semibold mb-4">{title}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {renderedCourses}
      </div>
    </div>
  );
});
