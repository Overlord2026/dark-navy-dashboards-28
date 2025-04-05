
import React from "react";
import { useParams } from "react-router-dom";
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { PlayIcon, BookOpenIcon, ClockIcon, GraduationCapIcon } from "lucide-react";

interface CourseData {
  id: string;
  title: string;
  description: string;
  coverImage: string;
  instructor: {
    name: string;
    role: string;
    avatar: string;
  };
  duration: string;
  level: string;
  sections: {
    id: string;
    title: string;
    lessons: {
      id: string;
      title: string;
      duration: string;
      type: "video" | "quiz" | "reading";
      completed: boolean;
    }[];
  }[];
}

const CourseDetail = () => {
  const { courseId } = useParams<{ courseId: string }>();

  // Mock data fetching with react-query
  const { data: course, isLoading, error } = useQuery({
    queryKey: ['course', courseId],
    queryFn: async () => {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Mock course data
      const mockCourse: CourseData = {
        id: courseId || "unknown",
        title: "Understanding Investment Strategies",
        description: "This comprehensive course covers all aspects of investment strategies, from basic concepts to advanced techniques. Learn how to build a portfolio that aligns with your financial goals and risk tolerance.",
        coverImage: "/lovable-uploads/e4ac2159-1b66-4f15-9257-68a0f00c8311.png",
        instructor: {
          name: "Dr. Sarah Johnson",
          role: "Chief Investment Strategist",
          avatar: "/lovable-uploads/e4ac2159-1b66-4f15-9257-68a0f00c8311.png"
        },
        duration: "6 hours",
        level: "Intermediate",
        sections: [
          {
            id: "s1",
            title: "Introduction to Investment Strategies",
            lessons: [
              {
                id: "l1",
                title: "Welcome to the Course",
                duration: "5:30",
                type: "video",
                completed: true
              },
              {
                id: "l2",
                title: "Investment Basics",
                duration: "15:45",
                type: "video",
                completed: true
              },
              {
                id: "l3",
                title: "Understanding Risk and Return",
                duration: "18:20",
                type: "video",
                completed: false
              }
            ]
          },
          {
            id: "s2",
            title: "Building Your Portfolio",
            lessons: [
              {
                id: "l4",
                title: "Asset Allocation Fundamentals",
                duration: "22:15",
                type: "video",
                completed: false
              },
              {
                id: "l5",
                title: "Diversification Strategies",
                duration: "19:30",
                type: "video",
                completed: false
              },
              {
                id: "l6",
                title: "Module 1 Assessment",
                duration: "20:00",
                type: "quiz",
                completed: false
              }
            ]
          },
          {
            id: "s3",
            title: "Advanced Investment Strategies",
            lessons: [
              {
                id: "l7",
                title: "Alternative Investments",
                duration: "25:10",
                type: "video",
                completed: false
              },
              {
                id: "l8",
                title: "Tax-Efficient Investing",
                duration: "23:45",
                type: "video",
                completed: false
              },
              {
                id: "l9",
                title: "Sustainable Investing",
                duration: "17:30",
                type: "reading",
                completed: false
              },
              {
                id: "l10",
                title: "Final Course Assessment",
                duration: "30:00",
                type: "quiz",
                completed: false
              }
            ]
          }
        ]
      };
      
      return mockCourse;
    }
  });

  if (isLoading) {
    return (
      <ThreeColumnLayout title="Course Details">
        <div className="p-4">Loading course details...</div>
      </ThreeColumnLayout>
    );
  }

  if (error) {
    return (
      <ThreeColumnLayout title="Course Details">
        <div className="p-4 text-red-600">Error loading course details.</div>
      </ThreeColumnLayout>
    );
  }

  return (
    <ThreeColumnLayout title={course?.title || 'Course Details'}>
      <div className="container py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Course Overview */}
          <div className="md:col-span-2">
            <Card className="p-6">
              <div className="aspect-video w-full overflow-hidden rounded-md mb-6">
                <img 
                  src={course?.coverImage || "/placeholder.svg"} 
                  alt={course?.title} 
                  className="w-full h-full object-cover"
                />
              </div>
              
              <h1 className="text-3xl font-bold mb-4">{course?.title}</h1>
              
              <div className="flex items-center mb-6">
                <div className="h-12 w-12 rounded-full overflow-hidden mr-4">
                  <img 
                    src={course?.instructor.avatar} 
                    alt={course?.instructor.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <p className="font-medium">{course?.instructor.name}</p>
                  <p className="text-sm text-muted-foreground">{course?.instructor.role}</p>
                </div>
              </div>
              
              <div className="flex items-center mb-6 space-x-6">
                <div className="flex items-center">
                  <ClockIcon className="h-5 w-5 mr-2 text-muted-foreground" />
                  <span>{course?.duration}</span>
                </div>
                <div className="flex items-center">
                  <GraduationCapIcon className="h-5 w-5 mr-2 text-muted-foreground" />
                  <span>{course?.level} Level</span>
                </div>
              </div>
              
              <Separator className="my-6" />
              
              <h2 className="text-xl font-semibold mb-4">About this Course</h2>
              <p className="text-muted-foreground mb-6">{course?.description}</p>
            </Card>
          </div>
          
          {/* Course Progress */}
          <div className="md:col-span-1">
            <Card className="p-6 sticky top-6">
              <h2 className="text-xl font-semibold mb-4">Course Content</h2>
              
              <div className="mb-6">
                <div className="relative h-2 bg-muted rounded-full overflow-hidden">
                  <div className="absolute top-0 left-0 h-full bg-primary" style={{ width: '20%' }} />
                </div>
                <div className="flex justify-between mt-2">
                  <span className="text-sm text-muted-foreground">20% Complete</span>
                  <span className="text-sm font-medium">2/10 Lessons</span>
                </div>
              </div>
              
              <Button className="w-full mb-4 flex items-center justify-center">
                <PlayIcon className="h-4 w-4 mr-2" /> Continue Learning
              </Button>
              
              <Button variant="outline" className="w-full mb-6">
                Download Materials
              </Button>
              
              <Separator className="my-6" />
              
              <h3 className="font-medium mb-4">Course Structure</h3>
              
              <div className="space-y-4">
                {course?.sections.map((section) => (
                  <div key={section.id} className="space-y-2">
                    <h4 className="font-medium">{section.title}</h4>
                    <ul className="space-y-1">
                      {section.lessons.map((lesson) => (
                        <li key={lesson.id} className="flex justify-between items-center text-sm py-1">
                          <div className="flex items-center">
                            {lesson.type === 'video' && <PlayIcon className="h-3 w-3 mr-2" />}
                            {lesson.type === 'reading' && <BookOpenIcon className="h-3 w-3 mr-2" />}
                            {lesson.type === 'quiz' && <GraduationCapIcon className="h-3 w-3 mr-2" />}
                            <span className={lesson.completed ? "line-through text-muted-foreground" : ""}>{lesson.title}</span>
                          </div>
                          <span className="text-muted-foreground">{lesson.duration}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </ThreeColumnLayout>
  );
};

export default CourseDetail;
