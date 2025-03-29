
import React, { useState } from 'react';
import { GraduationCapIcon } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CourseCard } from "./CourseCard";
import { CourseList } from "./CourseList";
import { handleCourseAccess } from './courseUtils';
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { courseCategories, featuredCourses, popularCourses } from "@/data/courseData";

export const SwagEducationMenu = () => {
  const [activeTab, setActiveTab] = useState<string>("featured");
  const [activeCategory, setActiveCategory] = useState<string>("all-courses");
  const [isProcessing, setIsProcessing] = useState<string | number | null>(null);

  // Handler for course enrollment that's compatible with our components
  const handleCourseEnrollment = (courseId: string | number, title: string, isPaid: boolean, ghlUrl?: string) => {
    handleCourseAccess(courseId, title, isPaid, ghlUrl, setIsProcessing);
  };

  // Handler for category selection - separate from enrollment
  const handleCategorySelect = (id: string) => {
    setActiveCategory(id);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative flex items-center gap-1 transition-colors hover:bg-accent/20">
          <GraduationCapIcon className="h-5 w-5" />
          <span className="font-medium">Education</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[380px] md:w-[500px] p-4" align="end">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <h4 className="text-lg font-semibold">SWAG Education Center</h4>
            <p className="text-sm text-muted-foreground">
              Access financial education resources
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <Tabs defaultValue="featured" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full mb-4">
            <TabsTrigger value="featured" className="flex-1">Featured Courses</TabsTrigger>
            <TabsTrigger value="popular" className="flex-1">Popular Courses</TabsTrigger>
          </TabsList>
          
          <div className={activeTab === "featured" ? "block" : "hidden"}>
            <CourseList 
              title="Featured Courses" 
              courses={featuredCourses} 
              onCourseEnrollment={handleCourseEnrollment} 
            />
          </div>
          
          <div className={activeTab === "popular" ? "block" : "hidden"}>
            <CourseList 
              title="Popular Courses" 
              courses={popularCourses} 
              onCourseEnrollment={handleCourseEnrollment} 
            />
          </div>
        </Tabs>
        <DropdownMenuSeparator className="my-4" />
        <DropdownMenuGroup>
          <Link to="/education">
            <DropdownMenuItem className="cursor-pointer flex justify-center">
              <Button className="w-full">View All Courses</Button>
            </DropdownMenuItem>
          </Link>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
