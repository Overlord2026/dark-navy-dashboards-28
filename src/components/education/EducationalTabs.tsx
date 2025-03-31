
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
            Recommended Reading
          </TabsTrigger>
          <TabsTrigger 
            value="allocation-models" 
            onClick={() => setActiveSection("allocation-models")}
            className={`${activeSection === "allocation-models" ? "bg-background shadow-sm" : ""} px-6 py-2 text-sm font-medium transition-colors`}
          >
            Allocation Models
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
          <h3 className="text-xl font-semibold mb-4">Recommended Reading</h3>
          
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
      
      <TabsContent value="allocation-models" className="animate-fade-in">
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
          
          <div className="mt-8 p-6 bg-primary/5 rounded-lg border border-primary/10">
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
  );
}
