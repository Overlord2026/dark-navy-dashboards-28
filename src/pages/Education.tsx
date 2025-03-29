import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CourseCard } from "@/components/education/CourseCard";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";

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
  { id: "advanced-estate-planning", name: "Advanced Estate Planning" },
  { id: "investment-management", name: "Investment Management" },
  { id: "alternative-investments", name: "Alternative Investments" },
  { id: "intelligent-allocation", name: "Intelligent Allocation Models" },
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
      duration: "2 hours",
      ghlUrl: "https://ghl.example.com/courses/retirement-income-fundamentals"
    },
    {
      id: "ri-102",
      title: "Income Planning Strategies",
      description: "Advanced techniques for optimizing your retirement income sources.",
      isPaid: true,
      level: "Intermediate",
      duration: "3 hours",
      ghlUrl: "https://ghl.example.com/courses/income-planning-strategies"
    }
  ],
  "social-security": [
    {
      id: "ss-101",
      title: "Social Security Basics",
      description: "Understanding how Social Security benefits work and when to claim.",
      isPaid: false,
      level: "Beginner",
      duration: "1.5 hours",
      ghlUrl: "https://ghl.example.com/courses/social-security-basics"
    },
    {
      id: "ss-102",
      title: "Maximizing Social Security Benefits",
      description: "Strategies to optimize your Social Security claiming decision.",
      isPaid: true,
      level: "Intermediate",
      duration: "2.5 hours",
      ghlUrl: "https://ghl.example.com/courses/maximizing-social-security"
    }
  ],
  "income-distribution": [
    {
      id: "id-101",
      title: "Distribution Planning 101",
      description: "Learn how to structure withdrawals from your retirement accounts.",
      isPaid: false,
      level: "Beginner",
      duration: "2 hours",
      ghlUrl: "https://ghl.example.com/courses/distribution-planning-101"
    },
    {
      id: "id-102",
      title: "Tax-Efficient Withdrawals",
      description: "Advanced strategies for minimizing taxes during retirement.",
      isPaid: true,
      level: "Advanced",
      duration: "3 hours",
      ghlUrl: "https://ghl.example.com/courses/tax-efficient-withdrawals"
    }
  ],
  "annuities": [
    {
      id: "an-101",
      title: "Annuity Fundamentals",
      description: "Understanding different types of annuities and their benefits.",
      isPaid: false,
      level: "Beginner",
      duration: "1.5 hours",
      ghlUrl: "https://ghl.example.com/courses/annuity-fundamentals"
    },
    {
      id: "an-102",
      title: "Advanced Annuity Strategies",
      description: "How to integrate annuities into your retirement portfolio.",
      isPaid: true,
      level: "Intermediate",
      duration: "2.5 hours",
      comingSoon: true,
      ghlUrl: "https://ghl.example.com/courses/advanced-annuity-strategies"
    }
  ],
  "tax-planning": [
    {
      id: "tp-101",
      title: "Tax Planning Essentials",
      description: "Fundamental strategies to minimize your tax burden.",
      isPaid: false,
      level: "Beginner",
      duration: "2 hours",
      ghlUrl: "https://ghl.example.com/courses/tax-planning-essentials"
    },
    {
      id: "tp-102",
      title: "Tax-Efficient Investing",
      description: "How to structure investments to minimize taxes.",
      isPaid: true,
      level: "Intermediate",
      duration: "2.5 hours",
      ghlUrl: "https://ghl.example.com/courses/tax-efficient-investing"
    }
  ],
  "advanced-tax": [
    {
      id: "at-101",
      title: "Advanced Tax Strategies",
      description: "Complex tax planning techniques for high-net-worth individuals.",
      isPaid: true,
      level: "Advanced",
      duration: "3 hours",
      ghlUrl: "https://ghl.example.com/courses/advanced-tax-strategies"
    },
    {
      id: "at-102",
      title: "Estate Tax Planning",
      description: "Strategies to minimize estate taxes for your heirs.",
      isPaid: true,
      level: "Advanced",
      duration: "3.5 hours",
      comingSoon: true,
      ghlUrl: "https://ghl.example.com/courses/estate-tax-planning"
    }
  ],
  "wealth-management": [
    {
      id: "wm-101",
      title: "Wealth Building Principles",
      description: "Core concepts for building and preserving wealth.",
      isPaid: false,
      level: "Beginner",
      duration: "2 hours",
      ghlUrl: "https://ghl.example.com/courses/wealth-building-principles"
    },
    {
      id: "wm-102",
      title: "Advanced Portfolio Management",
      description: "Sophisticated investment strategies for wealth preservation.",
      isPaid: true,
      level: "Advanced",
      duration: "4 hours",
      comingSoon: true,
      ghlUrl: "https://ghl.example.com/courses/advanced-portfolio-management"
    }
  ],
  "estate-planning": [
    {
      id: "ep-101",
      title: "Estate Planning Basics",
      description: "Essential elements of creating an estate plan.",
      isPaid: false,
      level: "Beginner",
      duration: "2 hours",
      ghlUrl: "https://ghl.example.com/courses/estate-planning-basics"
    },
    {
      id: "ep-102",
      title: "Trust Strategies",
      description: "How to use different types of trusts in estate planning.",
      isPaid: true,
      level: "Intermediate",
      duration: "3 hours",
      ghlUrl: "https://ghl.example.com/courses/trust-strategies"
    }
  ],
  "advanced-estate-planning": [
    {
      id: "aep-101",
      title: "Advanced Estate Planning Strategies",
      description: "Learn sophisticated estate planning techniques for high-net-worth individuals.",
      isPaid: true,
      level: "Advanced",
      duration: "4 hours",
      ghlUrl: "https://ghl.example.com/courses/advanced-estate-planning-strategies"
    },
    {
      id: "aep-102",
      title: "Dynasty Trusts and Family Limited Partnerships",
      description: "Advanced structures for multi-generational wealth transfer.",
      isPaid: true,
      level: "Advanced",
      duration: "3.5 hours",
      ghlUrl: "https://ghl.example.com/courses/dynasty-trusts"
    }
  ],
  "investment-management": [
    {
      id: "im-101",
      title: "Investment Management Fundamentals",
      description: "Core principles of investment management and portfolio construction.",
      isPaid: false,
      level: "Beginner",
      duration: "2.5 hours",
      ghlUrl: "https://ghl.example.com/courses/investment-management-fundamentals"
    },
    {
      id: "im-102",
      title: "Portfolio Optimization Techniques",
      description: "Advanced methods for optimizing investment portfolios.",
      isPaid: true,
      level: "Intermediate",
      duration: "3 hours",
      ghlUrl: "https://ghl.example.com/courses/portfolio-optimization"
    }
  ],
  "alternative-investments": [
    {
      id: "ai-101",
      title: "Introduction to Alternative Investments",
      description: "Overview of private equity, hedge funds, and other alternative asset classes.",
      isPaid: false,
      level: "Beginner",
      duration: "2 hours",
      ghlUrl: "https://ghl.example.com/courses/intro-alternative-investments"
    },
    {
      id: "ai-102",
      title: "Private Market Alpha",
      description: "Understanding sources of alpha in private markets and illiquid investments.",
      isPaid: true,
      level: "Intermediate",
      duration: "3 hours",
      ghlUrl: "https://ghl.example.com/courses/private-market-alpha"
    }
  ],
  "intelligent-allocation": [
    {
      id: "ia-101",
      title: "Intelligent Allocation Models: An Overview",
      description: "Introduction to our proprietary allocation models and their benefits.",
      isPaid: false,
      level: "Beginner",
      duration: "1.5 hours",
      ghlUrl: "https://ghl.example.com/courses/intelligent-allocation-overview"
    },
    {
      id: "ia-102",
      title: "Advanced Allocation Strategies",
      description: "Deep dive into optimizing asset allocation for various market conditions.",
      isPaid: true,
      level: "Advanced",
      duration: "3 hours",
      ghlUrl: "https://ghl.example.com/courses/advanced-allocation-strategies"
    }
  ],
  "florida-residency": [
    {
      id: "fl-101",
      title: "Florida Residency Advantages",
      description: "Tax and financial benefits of Florida residency.",
      isPaid: false,
      level: "Beginner",
      duration: "1.5 hours",
      ghlUrl: "https://ghl.example.com/courses/florida-residency-advantages"
    },
    {
      id: "fl-102",
      title: "Florida Estate Planning",
      description: "Special considerations for Florida residents.",
      isPaid: true,
      level: "Intermediate",
      duration: "2 hours",
      comingSoon: true,
      ghlUrl: "https://ghl.example.com/courses/florida-estate-planning"
    }
  ],
  "texas-residency": [
    {
      id: "tx-101",
      title: "Texas Residency Benefits",
      description: "Tax and financial advantages of Texas residency.",
      isPaid: false,
      level: "Beginner",
      duration: "1.5 hours",
      ghlUrl: "https://ghl.example.com/courses/texas-residency-benefits"
    },
    {
      id: "tx-102",
      title: "Texas Estate Planning",
      description: "Special considerations for Texas residents.",
      isPaid: true,
      level: "Intermediate",
      duration: "2 hours",
      comingSoon: true,
      ghlUrl: "https://ghl.example.com/courses/texas-estate-planning"
    }
  ]
};

const educationalResources = {
  "guides": [
    {
      id: "guide-retirement",
      title: "Comprehensive Retirement Planning Guide",
      description: "Step-by-step guide to creating a robust retirement plan.",
      isPaid: false,
      level: "All Levels",
      duration: "Self-paced",
      ghlUrl: "https://ghl.example.com/guides/retirement-planning"
    },
    {
      id: "guide-estate",
      title: "Estate Planning Checklist",
      description: "Essential estate planning documents and considerations.",
      isPaid: false,
      level: "All Levels",
      duration: "Self-paced",
      ghlUrl: "https://ghl.example.com/guides/estate-planning-checklist"
    }
  ],
  "books": [
    {
      id: "book-wealth",
      title: "The Intelligent Investor",
      description: "Benjamin Graham's timeless advice on value investing.",
      isPaid: false,
      level: "Intermediate",
      author: "Benjamin Graham",
      ghlUrl: "https://ghl.example.com/books/intelligent-investor"
    },
    {
      id: "book-retirement",
      title: "The Power of Zero",
      description: "How to get to the 0% tax bracket in retirement.",
      isPaid: false,
      level: "Beginner",
      author: "David McKnight",
      ghlUrl: "https://ghl.example.com/books/power-of-zero"
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
    isPaid: false,
    ghlUrl: "https://ghl.example.com/courses/financial-fundamentals"
  },
  {
    id: 2,
    title: "Investment Strategies 101",
    description: "Introduction to different investment options and basic strategies.",
    level: "Beginner",
    duration: "3 hours",
    image: "/placeholder.svg",
    isPaid: false,
    ghlUrl: "https://ghl.example.com/courses/investment-strategies-101"
  },
  {
    id: 3,
    title: "Wealth Building for Beginners",
    description: "Start your journey toward building sustainable wealth.",
    level: "Beginner",
    duration: "2.5 hours",
    image: "/placeholder.svg",
    isPaid: false,
    ghlUrl: "https://ghl.example.com/courses/wealth-building-beginners"
  },
  {
    id: 4,
    title: "Advanced Trading",
    description: "Learn advanced trading techniques and market analysis.",
    level: "Advanced",
    duration: "5 hours",
    image: "/placeholder.svg",
    isPaid: true,
    comingSoon: true,
    ghlUrl: "https://ghl.example.com/courses/advanced-trading"
  },
  {
    id: 5,
    title: "Estate Planning",
    description: "Comprehensive guide to estate planning and wealth preservation.",
    level: "Intermediate",
    duration: "4 hours",
    image: "/placeholder.svg",
    isPaid: true,
    comingSoon: true,
    ghlUrl: "https://ghl.example.com/courses/estate-planning"
  }
];

export default function Education() {
  const [searchParams] = useSearchParams();
  const [activeCategory, setActiveCategory] = useState("all-courses");
  const [activeSection, setActiveSection] = useState("courses");
  
  useEffect(() => {
    const category = searchParams.get("category");
    const section = searchParams.get("section");
    
    if (category) {
      setActiveCategory(category);
      setActiveSection("courses");
    } else if (section) {
      setActiveSection(section);
    }
  }, [searchParams]);

  const handleCourseEnrollment = (courseId: string | number, title: string, isPaid: boolean, ghlUrl?: string) => {
    if (ghlUrl) {
      // If we have a GHL URL, we'll open it directly (this is handled in CourseCard now)
      return;
    }
    
    // Fallback for if we somehow get here without a URL
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
      activeSecondaryItem={activeCategory}
      secondaryMenuItems={courseCategories}
    >
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Welcome to the SWAG Education Center</h2>
          <p className="text-muted-foreground mt-2">
            Explore our collection of financial education resources to help you build wealth and achieve your financial goals.
          </p>
          
          <Tabs defaultValue="courses" value={activeSection} className="mt-6">
            <TabsList className="mb-6">
              <TabsTrigger value="courses" onClick={() => setActiveSection("courses")}>Courses</TabsTrigger>
              <TabsTrigger value="guides" onClick={() => setActiveSection("guides")}>Guides</TabsTrigger>
              <TabsTrigger value="books" onClick={() => setActiveSection("books")}>Recommended Reading</TabsTrigger>
              <TabsTrigger value="allocation-models" onClick={() => setActiveSection("allocation-models")}>Allocation Models</TabsTrigger>
            </TabsList>
            
            <TabsContent value="courses">
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
                          onClick={() => setActiveCategory(category.id)}
                        >
                          Explore Courses
                        </Button>
                      </CardContent>
                    </Card>
                  )
                ))}
              </div>

              {activeCategory !== "all-courses" ? (
                <div className="mt-10">
                  <h3 className="text-xl font-semibold mb-4">
                    {courseCategories.find(cat => cat.id === activeCategory)?.name || "Courses"}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {coursesByCategory[activeCategory as keyof typeof coursesByCategory]?.map((course) => (
                      <CourseCard
                        key={course.id}
                        {...course}
                        onClick={() => handleCourseEnrollment(course.id, course.title, course.isPaid, course.ghlUrl)}
                      />
                    ))}
                  </div>
                </div>
              ) : (
                <>
                  {courseCategories.slice(1).map((category) => (
                    <div key={category.id} className="mt-10">
                      <h3 className="text-xl font-semibold mb-4">{category.name}</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {coursesByCategory[category.id as keyof typeof coursesByCategory]?.map((course) => (
                          <CourseCard
                            key={course.id}
                            {...course}
                            onClick={() => handleCourseEnrollment(course.id, course.title, course.isPaid, course.ghlUrl)}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </>
              )}

              <div className="mt-10">
                <h3 className="text-xl font-semibold mb-4">Featured Courses</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {featuredCourses.map((course) => (
                    <CourseCard
                      key={course.id}
                      {...course}
                      onClick={() => handleCourseEnrollment(course.id, course.title, course.isPaid, course.ghlUrl)}
                    />
                  ))}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="guides">
              <div className="space-y-6">
                <h3 className="text-xl font-semibold mb-4">Educational Guides</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {educationalResources.guides.map((guide) => (
                    <CourseCard
                      key={guide.id}
                      {...guide}
                      onClick={() => handleCourseEnrollment(guide.id, guide.title, guide.isPaid, guide.ghlUrl)}
                    />
                  ))}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="books">
              <div className="space-y-6">
                <h3 className="text-xl font-semibold mb-4">Recommended Reading</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {educationalResources.books.map((book) => (
                    <CourseCard
                      key={book.id}
                      title={book.title}
                      description={`${book.description} (Author: ${book.author})`}
                      isPaid={false}
                      level={book.level}
                      ghlUrl={book.ghlUrl}
                      onClick={() => window.open(book.ghlUrl, "_blank", "noopener,noreferrer")}
                    />
                  ))}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="allocation-models">
              <div className="space-y-6">
                <div className="mb-6">
                  <h3 className="text-xl font-semibold mb-2">Intelligent Allocation Models</h3>
                  <p className="text-muted-foreground">
                    Our proprietary allocation models are designed to optimize your portfolio based on your risk tolerance, time horizon, and financial goals.
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {coursesByCategory["intelligent-allocation"]?.map((course) => (
                    <CourseCard
                      key={course.id}
                      {...course}
                      onClick={() => handleCourseEnrollment(course.id, course.title, course.isPaid, course.ghlUrl)}
                    />
                  ))}
                </div>
                
                <div className="mt-8 p-6 bg-accent/10 rounded-lg">
                  <h4 className="text-lg font-semibold mb-2">Video Demonstrations</h4>
                  <p className="mb-4">Watch video demonstrations of our Intelligent Allocation Models in action.</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">Conservative Model</CardTitle>
                        <CardDescription>Suitable for near-term goals or low risk tolerance</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Button 
                          variant="default" 
                          className="w-full"
                          onClick={() => window.open("https://ghl.example.com/videos/conservative-model", "_blank", "noopener,noreferrer")}
                        >
                          Watch Video
                        </Button>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">Moderate Growth Model</CardTitle>
                        <CardDescription>Balanced approach for medium-term goals</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Button 
                          variant="default" 
                          className="w-full"
                          onClick={() => window.open("https://ghl.example.com/videos/moderate-model", "_blank", "noopener,noreferrer")}
                        >
                          Watch Video
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </ThreeColumnLayout>
  );
}
