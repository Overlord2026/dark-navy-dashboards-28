
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CourseCard } from "@/components/education/CourseCard";
import { toast } from "sonner";

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

const coursesByCategory = {
  "retirement-income": [
    {
      id: "ri-101",
      title: "Retirement Income Fundamentals",
      description: "Learn the basic principles of creating sustainable retirement income.",
      isPaid: false,
      level: "Beginner",
      duration: "2 hours"
    },
    {
      id: "ri-102",
      title: "Income Planning Strategies",
      description: "Advanced techniques for optimizing your retirement income sources.",
      isPaid: true,
      level: "Intermediate",
      duration: "3 hours"
    }
  ],
  "social-security": [
    {
      id: "ss-101",
      title: "Social Security Basics",
      description: "Understanding how Social Security benefits work and when to claim.",
      isPaid: false,
      level: "Beginner",
      duration: "1.5 hours"
    },
    {
      id: "ss-102",
      title: "Maximizing Social Security Benefits",
      description: "Strategies to optimize your Social Security claiming decision.",
      isPaid: true,
      level: "Intermediate",
      duration: "2.5 hours"
    }
  ],
  "income-distribution": [
    {
      id: "id-101",
      title: "Distribution Planning 101",
      description: "Learn how to structure withdrawals from your retirement accounts.",
      isPaid: false,
      level: "Beginner",
      duration: "2 hours"
    },
    {
      id: "id-102",
      title: "Tax-Efficient Withdrawals",
      description: "Advanced strategies for minimizing taxes during retirement.",
      isPaid: true,
      level: "Advanced",
      duration: "3 hours"
    }
  ],
  "annuities": [
    {
      id: "an-101",
      title: "Annuity Fundamentals",
      description: "Understanding different types of annuities and their benefits.",
      isPaid: false,
      level: "Beginner",
      duration: "1.5 hours"
    },
    {
      id: "an-102",
      title: "Advanced Annuity Strategies",
      description: "How to integrate annuities into your retirement portfolio.",
      isPaid: true,
      level: "Intermediate",
      duration: "2.5 hours",
      comingSoon: true
    }
  ],
  "tax-planning": [
    {
      id: "tp-101",
      title: "Tax Planning Essentials",
      description: "Fundamental strategies to minimize your tax burden.",
      isPaid: false,
      level: "Beginner",
      duration: "2 hours"
    },
    {
      id: "tp-102",
      title: "Tax-Efficient Investing",
      description: "How to structure investments to minimize taxes.",
      isPaid: true,
      level: "Intermediate",
      duration: "2.5 hours"
    }
  ],
  "advanced-tax": [
    {
      id: "at-101",
      title: "Advanced Tax Strategies",
      description: "Complex tax planning techniques for high-net-worth individuals.",
      isPaid: true,
      level: "Advanced",
      duration: "3 hours"
    },
    {
      id: "at-102",
      title: "Estate Tax Planning",
      description: "Strategies to minimize estate taxes for your heirs.",
      isPaid: true,
      level: "Advanced",
      duration: "3.5 hours",
      comingSoon: true
    }
  ],
  "wealth-management": [
    {
      id: "wm-101",
      title: "Wealth Building Principles",
      description: "Core concepts for building and preserving wealth.",
      isPaid: false,
      level: "Beginner",
      duration: "2 hours"
    },
    {
      id: "wm-102",
      title: "Advanced Portfolio Management",
      description: "Sophisticated investment strategies for wealth preservation.",
      isPaid: true,
      level: "Advanced",
      duration: "4 hours",
      comingSoon: true
    }
  ],
  "estate-planning": [
    {
      id: "ep-101",
      title: "Estate Planning Basics",
      description: "Essential elements of creating an estate plan.",
      isPaid: false,
      level: "Beginner",
      duration: "2 hours"
    },
    {
      id: "ep-102",
      title: "Trust Strategies",
      description: "How to use different types of trusts in estate planning.",
      isPaid: true,
      level: "Intermediate",
      duration: "3 hours"
    }
  ],
  "florida-residency": [
    {
      id: "fl-101",
      title: "Florida Residency Advantages",
      description: "Tax and financial benefits of Florida residency.",
      isPaid: false,
      level: "Beginner",
      duration: "1.5 hours"
    },
    {
      id: "fl-102",
      title: "Florida Estate Planning",
      description: "Special considerations for Florida residents.",
      isPaid: true,
      level: "Intermediate",
      duration: "2 hours",
      comingSoon: true
    }
  ],
  "texas-residency": [
    {
      id: "tx-101",
      title: "Texas Residency Benefits",
      description: "Tax and financial advantages of Texas residency.",
      isPaid: false,
      level: "Beginner",
      duration: "1.5 hours"
    },
    {
      id: "tx-102",
      title: "Texas Estate Planning",
      description: "Special considerations for Texas residents.",
      isPaid: true,
      level: "Intermediate",
      duration: "2 hours",
      comingSoon: true
    }
  ]
};

const featuredCourses = [
  {
    id: 1,
    title: "Financial Fundamentals",
    description: "Learn the basics of personal finance management and budgeting.",
    level: "Beginner",
    duration: "2 hours",
    image: "/placeholder.svg",
    isPaid: false
  },
  {
    id: 2,
    title: "Investment Strategies 101",
    description: "Introduction to different investment options and basic strategies.",
    level: "Beginner",
    duration: "3 hours",
    image: "/placeholder.svg",
    isPaid: false
  },
  {
    id: 3,
    title: "Wealth Building for Beginners",
    description: "Start your journey toward building sustainable wealth.",
    level: "Beginner",
    duration: "2.5 hours",
    image: "/placeholder.svg",
    isPaid: false
  },
  {
    id: 4,
    title: "Advanced Trading",
    description: "Learn advanced trading techniques and market analysis.",
    level: "Advanced",
    duration: "5 hours",
    image: "/placeholder.svg",
    isPaid: true,
    comingSoon: true
  },
  {
    id: 5,
    title: "Estate Planning",
    description: "Comprehensive guide to estate planning and wealth preservation.",
    level: "Intermediate",
    duration: "4 hours",
    image: "/placeholder.svg",
    isPaid: true,
    comingSoon: true
  }
];

export default function Education() {
  const handleCourseEnrollment = (courseId: string | number, title: string, isPaid: boolean) => {
    if (isPaid) {
      toast.info(`Redirecting to payment page for ${title}`);
    } else {
      toast.success(`Successfully enrolled in ${title}`);
    }
  };

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

        {courseCategories.slice(1).map((category) => (
          <div key={category.id} className="mt-10">
            <h3 className="text-xl font-semibold mb-4">{category.name}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {coursesByCategory[category.id as keyof typeof coursesByCategory]?.map((course) => (
                <CourseCard
                  key={course.id}
                  {...course}
                  onClick={() => handleCourseEnrollment(course.id, course.title, course.isPaid)}
                />
              ))}
            </div>
          </div>
        ))}

        <div className="mt-10">
          <h3 className="text-xl font-semibold mb-4">Featured Courses</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredCourses.map((course) => (
              <CourseCard
                key={course.id}
                {...course}
                onClick={() => handleCourseEnrollment(course.id, course.title, course.isPaid)}
              />
            ))}
          </div>
        </div>
      </div>
    </ThreeColumnLayout>
  );
}
