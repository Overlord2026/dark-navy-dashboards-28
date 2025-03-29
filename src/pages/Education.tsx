
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap, BookOpen, BookIcon, Trophy, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

const courseCategories = [
  { id: "all-courses", name: "All Courses", active: true },
  { id: "retirement-income", name: "Retirement Income Planning Basics" },
  { id: "social-security", name: "Social Security Optimization" },
  { id: "income-distribution", name: "Retirement Income Distribution Optimization" },
  { id: "annuities", name: "Understanding Annuities" },
  { id: "tax-planning", name: "Proactive Tax Planning" },
  { id: "advanced-tax", name: "Advanced Tax Planning" },
  { id: "wealth-management", name: "Holistic Wealth Management" },
  { id: "estate-planning", name: "Estate Planning Basics" },
  { id: "florida-residency", name: "Benefits of Florida Residency" },
  { id: "texas-residency", name: "Benefits of Texas Residency" },
];

const featuredCourses = [
  {
    id: 1,
    title: "Financial Fundamentals",
    description: "Learn the basics of personal finance management and budgeting.",
    level: "Beginner",
    duration: "2 hours",
    image: "/placeholder.svg",
    free: true
  },
  {
    id: 2,
    title: "Investment Strategies 101",
    description: "Introduction to different investment options and basic strategies.",
    level: "Beginner",
    duration: "3 hours",
    image: "/placeholder.svg",
    free: true
  },
  {
    id: 3,
    title: "Wealth Building for Beginners",
    description: "Start your journey toward building sustainable wealth.",
    level: "Beginner",
    duration: "2.5 hours",
    image: "/placeholder.svg",
    free: true
  },
  {
    id: 4,
    title: "Advanced Trading",
    description: "Learn advanced trading techniques and market analysis.",
    level: "Advanced",
    duration: "5 hours",
    image: "/placeholder.svg",
    free: false,
    comingSoon: true
  },
  {
    id: 5,
    title: "Estate Planning",
    description: "Comprehensive guide to estate planning and wealth preservation.",
    level: "Intermediate",
    duration: "4 hours",
    image: "/placeholder.svg",
    free: false,
    comingSoon: true
  }
];

export default function Education() {
  return (
    <ThreeColumnLayout 
      title="SWAG Education Center" 
      activeMainItem="education"
      activeSecondaryItem="all-courses"
      secondaryMenuItems={courseCategories}
    >
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Welcome to the SWAG Education Center</h2>
          <p className="text-muted-foreground mt-2">
            Explore our collection of financial education resources to help you build wealth and achieve your financial goals.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {courseCategories.map((category) => (
            category.id !== "all-courses" && (
              <Card key={category.id} className="hover:border-primary hover:shadow-md transition-all">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">{category.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <Button 
                    variant="outline" 
                    className="w-full"
                  >
                    Explore Courses
                  </Button>
                </CardContent>
              </Card>
            )
          ))}
        </div>

        <div className="mt-10">
          <h3 className="text-xl font-semibold mb-4">Featured Courses</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredCourses.map((course) => (
              <Card key={course.id} className={course.comingSoon ? "opacity-70" : ""}>
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{course.title}</CardTitle>
                    {course.free ? (
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded">Free</span>
                    ) : (
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded">Premium</span>
                    )}
                  </div>
                  <CardDescription>{course.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                    <div className="flex items-center">
                      <Trophy className="mr-1 h-4 w-4" />
                      <span>{course.level}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="mr-1 h-4 w-4" />
                      <span>{course.duration}</span>
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    className="w-full" 
                    disabled={course.comingSoon}
                  >
                    {course.comingSoon ? "Coming Soon" : "Start Learning"}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </ThreeColumnLayout>
  );
}
