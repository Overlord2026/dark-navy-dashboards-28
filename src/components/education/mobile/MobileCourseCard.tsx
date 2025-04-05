
import React from "react";
import { Course } from "@/types/education";

interface MobileCourseCardProps {
  course: Course;
  onClick?: () => void;
}

export const MobileCourseCard = ({ course, onClick }: MobileCourseCardProps) => {
  return (
    <div 
      className="bg-card rounded-lg overflow-hidden shadow-sm border border-border cursor-pointer"
      onClick={onClick}
    >
      <div 
        className="h-32 bg-cover bg-center" 
        style={{ backgroundImage: `url(${course.image || "/placeholder.svg"})` }}
      ></div>
      <div className="p-3">
        <h3 className="text-base font-medium truncate">{course.title}</h3>
        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{course.description}</p>
        <div className="flex justify-between items-center mt-2">
          <span className="text-xs bg-secondary px-2 py-1 rounded-full">{course.level}</span>
          <span className="text-xs text-muted-foreground">{course.duration}</span>
        </div>
        {course.isPaid && (
          <div className="mt-2">
            <span className="text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 px-2 py-1 rounded-full">Premium</span>
          </div>
        )}
        {course.ghlUrl && (
          <div className="mt-2 opacity-75">
            <span className="text-xs">Tap to access</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default MobileCourseCard;
