
import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Course } from "@/types/education";
import { MobileCourseCard } from "./MobileCourseCard";

interface MobileCourseTabsProps {
  featuredCourses: Course[];
  popularCourses: Course[];
  onCourseClick: (courseId: string | number, title: string, isPaid: boolean, ghlUrl?: string) => void;
}

export function MobileCourseTabs({
  featuredCourses,
  popularCourses,
  onCourseClick
}: MobileCourseTabsProps) {
  const [activeTab, setActiveTab] = useState<string>("featured");

  return (
    <Tabs defaultValue="featured" value={activeTab} onValueChange={setActiveTab}>
      <TabsList className="grid grid-cols-2 w-full bg-[#1B1B32] border border-[#2A2A45]">
        <TabsTrigger value="featured" className="text-sm">Featured</TabsTrigger>
        <TabsTrigger value="popular" className="text-sm">Popular</TabsTrigger>
      </TabsList>
      
      <TabsContent value="featured" className="space-y-4 mt-4">
        {featuredCourses.map((course) => (
          <MobileCourseCard 
            key={course.id}
            title={course.title}
            description={course.description}
            level={course.level}
            duration={course.duration}
            isPaid={course.isPaid}
            onClick={() => onCourseClick(course.id, course.title, course.isPaid, course.ghlUrl)}
          />
        ))}
      </TabsContent>
      
      <TabsContent value="popular" className="space-y-4 mt-4">
        {popularCourses.map((course) => (
          <MobileCourseCard 
            key={course.id}
            title={course.title}
            description={course.description}
            level={course.level}
            duration={course.duration}
            isPaid={course.isPaid}
            onClick={() => onCourseClick(course.id, course.title, course.isPaid, course.ghlUrl)}
          />
        ))}
      </TabsContent>
    </Tabs>
  );
}
