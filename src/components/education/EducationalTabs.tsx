
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
      <TabsList className="mb-6 grid grid-cols-4 gap-1 w-full max-w-lg">
        <TabsTrigger value="courses" onClick={() => setActiveSection("courses")}>Courses</TabsTrigger>
        <TabsTrigger value="guides" onClick={() => setActiveSection("guides")}>Guides</TabsTrigger>
        <TabsTrigger value="books" onClick={() => setActiveSection("books")}>Recommended Reading</TabsTrigger>
        <TabsTrigger value="allocation-models" onClick={() => setActiveSection("allocation-models")}>Allocation Models</TabsTrigger>
      </TabsList>
      
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
