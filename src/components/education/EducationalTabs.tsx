
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CourseCategories } from "./CourseCategories";
import { CourseList } from "./CourseList";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  courseCategories, 
  coursesByCategory, 
  educationalResources, 
  featuredCourses 
} from "@/data/education";
import { CourseCard } from "./CourseCard";
import { FeaturedCategories } from "./FeaturedCategories";
import { ExternalLink } from "lucide-react";

interface EducationalTabsProps {
  activeSection: string;
  activeCategory: string;
  setActiveSection: (section: string) => void;
  setActiveCategory: (category: string) => void;
  handleCourseEnrollment: (courseId: string | number, title: string, isPaid: boolean, ghlUrl?: string) => void;
}

export function EducationalTabs({ 
  activeSection, 
  activeCategory, 
  setActiveSection, 
  setActiveCategory,
  handleCourseEnrollment 
}: EducationalTabsProps) {
  return (
    <Tabs defaultValue="courses" value={activeSection} className="mt-6">
      <div className="bg-muted rounded-md p-1 mb-6">
        <TabsList className="grid grid-cols-4 gap-1 w-full">
          <TabsTrigger 
            value="courses" 
            onClick={() => setActiveSection("courses")}
            className={`${activeSection === "courses" ? "bg-background shadow-sm" : ""} px-6 py-2 text-sm font-medium transition-colors`}
          >
            Courses
          </TabsTrigger>
          <TabsTrigger 
            value="guides" 
            onClick={() => setActiveSection("guides")}
            className={`${activeSection === "guides" ? "bg-background shadow-sm" : ""} px-6 py-2 text-sm font-medium transition-colors`}
          >
            Guides
          </TabsTrigger>
          <TabsTrigger 
            value="books" 
            onClick={() => setActiveSection("books")}
            className={`${activeSection === "books" ? "bg-background shadow-sm" : ""} px-6 py-2 text-sm font-medium transition-colors`}
          >
            Books
          </TabsTrigger>
          <TabsTrigger 
            value="whitepapers" 
            onClick={() => setActiveSection("whitepapers")}
            className={`${activeSection === "whitepapers" ? "bg-background shadow-sm" : ""} px-6 py-2 text-sm font-medium transition-colors`}
          >
            Whitepapers
          </TabsTrigger>
        </TabsList>
      </div>
      
      <TabsContent value="courses" className="animate-fade-in">
        {activeCategory === "all-courses" ? (
          <>
            <FeaturedCategories 
              categories={courseCategories} 
              onSelectCategory={setActiveCategory} 
            />
            
            <CourseList 
              title="Featured Courses" 
              courses={featuredCourses}
              onCourseEnrollment={handleCourseEnrollment}
            />
          </>
        ) : (
          <>
            <div className="mb-8">
              <Button 
                variant="ghost" 
                className="mb-4 text-primary hover:bg-primary/10 hover:text-primary"
                onClick={() => setActiveCategory("all-courses")}
              >
                ← Back to All Categories
              </Button>
            </div>

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
          </>
        )}
      </TabsContent>
      
      <TabsContent value="guides" className="animate-fade-in">
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
      
      <TabsContent value="books" className="animate-fade-in">
        <div className="space-y-6">
          <h3 className="text-xl font-semibold mb-4">Recommended Books</h3>
          
          <div className="mb-8">
            <div className="flex items-center mb-4">
              <h4 className="text-lg font-medium">Tony Gomes Books</h4>
              <Button 
                variant="link" 
                className="ml-2 text-primary flex items-center gap-1"
                onClick={() => window.open("https://www.amazon.com/s?k=tony+gomes", "_blank", "noopener,noreferrer")}
              >
                View on Amazon <ExternalLink className="h-4 w-4" />
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">The 5 pillars of Wealth Creation</CardTitle>
                  <CardDescription>By Tony Gomes</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">A comprehensive guide to building sustainable wealth through five fundamental principles.</p>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => window.open("https://www.amazon.com/s?k=tony+gomes", "_blank", "noopener,noreferrer")}
                  >
                    View on Amazon
                  </Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Legacy Planning Mastery</CardTitle>
                  <CardDescription>By Tony Gomes</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">Essential strategies to preserve your wealth and create a lasting legacy for future generations.</p>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => window.open("https://www.amazon.com/s?k=tony+gomes", "_blank", "noopener,noreferrer")}
                  >
                    View on Amazon
                  </Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Tax-Efficient Investing</CardTitle>
                  <CardDescription>By Tony Gomes</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">Advanced strategies to minimize tax burden and maximize returns on your investments.</p>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => window.open("https://www.amazon.com/s?k=tony+gomes", "_blank", "noopener,noreferrer")}
                  >
                    View on Amazon
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {educationalResources.books.map((book) => (
              <CourseCard
                key={book.id}
                id={book.id}
                title={book.title}
                description={`${book.description} (Author: ${book.author})`}
                isPaid={false}
                level={book.level}
                ghlUrl={book.ghlUrl}
                onClick={() => handleCourseEnrollment(book.id, book.title, false, book.ghlUrl)}
              />
            ))}
          </div>
        </div>
      </TabsContent>
      
      <TabsContent value="whitepapers" className="animate-fade-in">
        <div className="space-y-6">
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-2">Research & Whitepapers</h3>
            <p className="text-muted-foreground">
              Access our collection of in-depth research papers and whitepapers on various financial topics.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Retirement Income Planning</CardTitle>
                <CardDescription>Published: June 2023</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">An in-depth analysis of sustainable retirement income strategies in the current economic environment.</p>
                <Button 
                  variant="default" 
                  className="w-full"
                  onClick={() => window.open("https://ghl.example.com/whitepapers/retirement-income", "_blank", "noopener,noreferrer")}
                >
                  Download PDF
                </Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Tax Optimization Strategies</CardTitle>
                <CardDescription>Published: March 2023</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">Research on advanced tax planning techniques for high net worth individuals.</p>
                <Button 
                  variant="default" 
                  className="w-full"
                  onClick={() => window.open("https://ghl.example.com/whitepapers/tax-optimization", "_blank", "noopener,noreferrer")}
                >
                  Download PDF
                </Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Estate Planning Best Practices</CardTitle>
                <CardDescription>Published: January 2023</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">Comprehensive research on modern estate planning strategies for wealth preservation.</p>
                <Button 
                  variant="default" 
                  className="w-full"
                  onClick={() => window.open("https://ghl.example.com/whitepapers/estate-planning", "_blank", "noopener,noreferrer")}
                >
                  Download PDF
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="mt-8">
            <h4 className="text-lg font-semibold mb-4">Featured Research Papers</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Vanguard: The Value of an Advisor</CardTitle>
                  <CardDescription>Published: 2023</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">Demonstrates the importance of tax planning, behavioral coaching, and rebalancing in financial advisory services.</p>
                  <Button 
                    variant="default" 
                    className="w-full"
                    onClick={() => window.open("https://advisors.vanguard.com/insights/article/IWE_ResPuttingAValueOnValue", "_blank", "noopener,noreferrer")}
                  >
                    View Research <ExternalLink className="h-3 w-3 ml-1" />
                  </Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Morningstar: Optimal Withdrawal Strategies</CardTitle>
                  <CardDescription>Published: 2022</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">Highlights withdrawal strategies to extend portfolio longevity and optimize tax efficiency in retirement planning.</p>
                  <Button 
                    variant="default" 
                    className="w-full"
                    onClick={() => window.open("https://www.morningstar.com/lp/withdrawal-strategies", "_blank", "noopener,noreferrer")}
                  >
                    View Research <ExternalLink className="h-3 w-3 ml-1" />
                  </Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Russell Investments: The Financial Impact of Holistic Advice</CardTitle>
                  <CardDescription>Published: 2023</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">Quantifies the value of holistic financial advice in tax-aware investing and risk management frameworks.</p>
                  <Button 
                    variant="default" 
                    className="w-full"
                    onClick={() => window.open("https://russellinvestments.com/us/financial-professional/value-of-advisor", "_blank", "noopener,noreferrer")}
                  >
                    View Research <ExternalLink className="h-3 w-3 ml-1" />
                  </Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Kitces: Goals-Based Planning and Risk Mitigation</CardTitle>
                  <CardDescription>Published: 2022</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">Focuses on goals-based planning methodologies to mitigate risks and maximize retirement outcomes for clients.</p>
                  <Button 
                    variant="default" 
                    className="w-full"
                    onClick={() => window.open("https://www.kitces.com/blog/category/retirement-planning/", "_blank", "noopener,noreferrer")}
                  >
                    View Research <ExternalLink className="h-3 w-3 ml-1" />
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
          
          <div className="mt-8 p-6 bg-primary/5 rounded-lg border border-primary/10">
            <h4 className="text-lg font-semibold mb-2">Request Custom Research</h4>
            <p className="mb-4">Need information on a specific financial topic? Our team can prepare custom research papers tailored to your needs.</p>
            <Button 
              variant="outline" 
              className="w-full md:w-auto"
              onClick={() => window.open("https://ghl.example.com/request-research", "_blank", "noopener,noreferrer")}
            >
              Request Custom Research
            </Button>
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );
}
