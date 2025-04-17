
import React, { useState } from "react";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  GraduationCap, 
  Book, 
  ArrowRight, 
  PieChart,
  BarChart,
  FileText,
  Info,
  BookOpen,
  Search
} from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { featuredCourses, popularCourses } from "@/data/education";
import { toast } from "sonner";
import { courseCategories } from "@/data/education";
import { handleCourseAccess } from "@/components/education/courseUtils";
import { Course } from "@/types/education";

export default function MobileEducation() {
  const [activeTab, setActiveTab] = useState<string>("featured");
  const [activeCategory, setActiveCategory] = useState<string>("all-courses");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const handleCourseEnrollment = (courseId: string | number, title: string, isPaid: boolean, ghlUrl?: string) => {
    handleCourseAccess(courseId, title, isPaid, ghlUrl);
  };

  return (
    <MobileLayout title="Education Center" showAddButton={false}>
      <div className="p-4 space-y-6 pb-20">
        {/* Welcome Section */}
        <div>
          <h2 className="text-xl font-bold mb-2">Financial Education Center</h2>
          <p className="text-gray-400 text-sm">
            Build wealth and achieve your financial goals with our educational resources.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <div className="absolute inset-y-0 left-2 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search courses and guides..."
            className="w-full py-2 pl-8 pr-4 bg-[#1B1B32] border border-[#2A2A45] rounded-lg text-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Tabs */}
        <Tabs defaultValue="featured" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-2 w-full bg-[#1B1B32] border border-[#2A2A45]">
            <TabsTrigger value="featured" className="text-sm">Featured</TabsTrigger>
            <TabsTrigger value="popular" className="text-sm">Popular</TabsTrigger>
          </TabsList>
          
          <TabsContent value="featured" className="space-y-4 mt-4">
            {featuredCourses.map((course) => (
              <CourseCard 
                key={course.id}
                title={course.title}
                description={course.description}
                level={course.level}
                duration={course.duration}
                isPaid={course.isPaid || false}
                onClick={() => handleCourseEnrollment(course.id, course.title, course.isPaid || false, course.ghlUrl)}
              />
            ))}
          </TabsContent>
          
          <TabsContent value="popular" className="space-y-4 mt-4">
            {popularCourses.map((course) => (
              <CourseCard 
                key={course.id}
                title={course.title}
                description={course.description}
                level={course.level}
                duration={course.duration}
                isPaid={course.isPaid || false}
                onClick={() => handleCourseEnrollment(course.id, course.title, course.isPaid || false, course.ghlUrl)}
              />
            ))}
          </TabsContent>
        </Tabs>

        {/* Categories */}
        <div className="space-y-3">
          <h3 className="text-lg font-medium">Browse by Topic</h3>
          <div className="grid grid-cols-2 gap-3">
            {courseCategories.slice(0, 6).map((category) => (
              category.id !== "all-courses" && (
                <Card key={category.id} className="bg-[#1B1B32] border border-[#2A2A45]">
                  <CardContent className="p-3">
                    <div className="flex flex-col items-center text-center">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                        {getCategoryIcon(category.id)}
                      </div>
                      <h4 className="text-sm font-medium">{category.name}</h4>
                    </div>
                  </CardContent>
                </Card>
              )
            ))}
          </div>
          <Button variant="outline" className="w-full" onClick={() => toast.info("More categories coming soon")}>
            View All Categories
          </Button>
        </div>

        {/* Education Resources */}
        <div className="space-y-3">
          <h3 className="text-lg font-medium">Other Resources</h3>
          <Card className="bg-[#1B1B32] border border-[#2A2A45]">
            <CardContent className="p-4">
              <div className="flex items-center">
                <div className="mr-4 p-2 bg-[#2A2A45] rounded-full">
                  <FileText className="h-5 w-5 text-blue-400" />
                </div>
                <div>
                  <h3 className="font-medium">Financial Guides</h3>
                  <p className="text-xs text-gray-400">
                    Essential guides for financial planning
                  </p>
                </div>
                <Button variant="ghost" size="sm" className="ml-auto">
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#1B1B32] border border-[#2A2A45]">
            <CardContent className="p-4">
              <div className="flex items-center">
                <div className="mr-4 p-2 bg-[#2A2A45] rounded-full">
                  <BookOpen className="h-5 w-5 text-green-400" />
                </div>
                <div>
                  <h3 className="font-medium">Recommended Books</h3>
                  <p className="text-xs text-gray-400">
                    Essential financial literature
                  </p>
                </div>
                <Button variant="ghost" size="sm" className="ml-auto">
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#1B1B32] border border-[#2A2A45]">
            <CardContent className="p-4">
              <div className="flex items-center">
                <div className="mr-4 p-2 bg-[#2A2A45] rounded-full">
                  <Info className="h-5 w-5 text-purple-400" />
                </div>
                <div>
                  <h3 className="font-medium">Financial Calculators</h3>
                  <p className="text-xs text-gray-400">
                    Tools to help with financial decisions
                  </p>
                </div>
                <Button variant="ghost" size="sm" className="ml-auto">
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MobileLayout>
  );
}

// Helper function to get icons for categories
function getCategoryIcon(categoryId: string) {
  switch (categoryId) {
    case "retirement-income":
      return <Book className="h-5 w-5 text-blue-400" />;
    case "tax-planning":
      return <PieChart className="h-5 w-5 text-green-400" />;
    case "wealth-management":
      return <BarChart className="h-5 w-5 text-purple-400" />;
    case "estate-planning":
      return <FileText className="h-5 w-5 text-orange-400" />;
    default:
      return <GraduationCap className="h-5 w-5 text-primary" />;
  }
}

interface CourseCardProps {
  title: string;
  description: string;
  level: string;
  duration: string;
  isPaid: boolean;
  onClick: () => void;
}

function CourseCard({ title, description, level, duration, isPaid, onClick }: CourseCardProps) {
  return (
    <Card className="bg-[#1B1B32] border border-[#2A2A45] overflow-hidden">
      <CardHeader className="p-4 pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-base">{title}</CardTitle>
          <div className={`text-xs px-2 py-1 rounded ${isPaid ? 'bg-[#3A3A60]' : 'bg-[#2A4A3A]'}`}>
            {isPaid ? 'Paid' : 'Free'}
          </div>
        </div>
        <CardDescription className="text-sm line-clamp-2 mt-1">
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4 pt-2">
        <div className="flex items-center justify-between text-xs text-gray-400 mb-3">
          <div>{level}</div>
          <div>{duration}</div>
        </div>
        <Button 
          variant={isPaid ? "default" : "outline"} 
          size="sm" 
          className="w-full"
          onClick={onClick}
        >
          {isPaid ? 'Enroll Now' : 'Start Learning'}
        </Button>
      </CardContent>
    </Card>
  );
}
