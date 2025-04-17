
import { CourseCard } from "./CourseCard";
import { Course } from "@/types/education";

interface CourseListProps {
  title: string;
  courses: Course[];
  onCourseEnrollment: (courseId: string | number, title: string, isPaid: boolean, ghlUrl?: string) => void;
}

export function CourseList({ title, courses, onCourseEnrollment }: CourseListProps) {
  return (
    <div className="mt-10">
      <h3 className="text-xl font-semibold mb-4">{title}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <CourseCard
            key={course.id}
            id={course.id}
            title={course.title}
            description={course.description}
            isPaid={course.isPaid || false}
            level={course.level}
            duration={course.duration}
            comingSoon={course.comingSoon}
            ghlUrl={course.ghlUrl}
            onClick={() => onCourseEnrollment(course.id, course.title, course.isPaid || false, course.ghlUrl)}
          />
        ))}
      </div>
    </div>
  );
}
