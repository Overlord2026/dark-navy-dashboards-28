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
import { ExternalLink, Book } from "lucide-react";

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
          <p className="text-muted-foreground mb-6">
            Access our collection of comprehensive financial guides designed to help you navigate complex financial topics.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="overflow-hidden group hover:shadow-lg transition-all">
              <div className="relative pb-[140%] bg-muted">
                <img 
                  src="/lovable-uploads/4a56e07f-ef12-47b6-b112-b240aba59bdf.png" 
                  alt="Bitcoin and Blockchain Guide" 
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>
              <CardHeader className="py-3">
                <CardTitle className="text-lg">Bitcoin and Blockchain</CardTitle>
                <CardDescription>A Retiree's Guide to Modern Wealth Management</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-sm text-muted-foreground mb-4">Learn about cryptocurrency, blockchain technology, and its role in modern portfolio strategies.</p>
                <Button 
                  variant="default" 
                  className="w-full"
                  onClick={() => window.open("https://awmfl1-my.sharepoint.com/personal/rosielle_awmfl_com/_layouts/15/onedrive.aspx?id=%2Fpersonal%2Frosielle%5Fawmfl%5Fcom%2FDocuments%2FAWMFL%20Guides%20%2D%20Final%20Draft%2FSecured%20Guides%202025&ct=1743196082829&or=OWA%2DNT%2DMail&ga=1&ls=true", "_blank", "noopener,noreferrer")}
                >
                  Access Guide <ExternalLink className="h-3 w-3 ml-1" />
                </Button>
              </CardContent>
            </Card>
            
            <Card className="overflow-hidden group hover:shadow-lg transition-all">
              <div className="relative pb-[140%] bg-muted">
                <img 
                  src="/lovable-uploads/07bdac7d-9165-48f5-ab06-ade475828c83.png" 
                  alt="13 Retirement Investment Blunders" 
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>
              <CardHeader className="py-3">
                <CardTitle className="text-lg">13 Retirement Investment Blunders</CardTitle>
                <CardDescription>What Affluent Investors Need to Know</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-sm text-muted-foreground mb-4">Essential advice on avoiding common investment mistakes that can derail your retirement plans.</p>
                <Button 
                  variant="default" 
                  className="w-full"
                  onClick={() => window.open("https://awmfl1-my.sharepoint.com/personal/rosielle_awmfl_com/_layouts/15/onedrive.aspx?id=%2Fpersonal%2Frosielle%5Fawmfl%5Fcom%2FDocuments%2FAWMFL%20Guides%20%2D%20Final%20Draft%2FSecured%20Guides%202025&ct=1743196082829&or=OWA%2DNT%2DMail&ga=1&ls=true", "_blank", "noopener,noreferrer")}
                >
                  Access Guide <ExternalLink className="h-3 w-3 ml-1" />
                </Button>
              </CardContent>
            </Card>
            
            <Card className="overflow-hidden group hover:shadow-lg transition-all">
              <div className="relative pb-[140%] bg-muted">
                <img 
                  src="/lovable-uploads/8a734eac-b185-496b-8582-cc78d296a796.png" 
                  alt="15 Risks That Can Derail Your Retirement" 
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>
              <CardHeader className="py-3">
                <CardTitle className="text-lg">15 Risks That Can Derail Retirement</CardTitle>
                <CardDescription>Protect your financial future</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-sm text-muted-foreground mb-4">Comprehensive overview of potential retirement risks and strategies to mitigate them.</p>
                <Button 
                  variant="default" 
                  className="w-full"
                  onClick={() => window.open("https://awmfl1-my.sharepoint.com/personal/rosielle_awmfl_com/_layouts/15/onedrive.aspx?id=%2Fpersonal%2Frosielle%5Fawmfl%5Fcom%2FDocuments%2FAWMFL%20Guides%20%2D%20Final%20Draft%2FSecured%20Guides%202025&ct=1743196082829&or=OWA%2DNT%2DMail&ga=1&ls=true", "_blank", "noopener,noreferrer")}
                >
                  Access Guide <ExternalLink className="h-3 w-3 ml-1" />
                </Button>
              </CardContent>
            </Card>
            
            <Card className="overflow-hidden group hover:shadow-lg transition-all">
              <div className="relative pb-[140%] bg-muted">
                <img 
                  src="/lovable-uploads/7d0f32fc-56fb-4bcb-a678-2f473a1ef54c.png" 
                  alt="When to Retire Guide" 
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>
              <CardHeader className="py-3">
                <CardTitle className="text-lg">When to Retire</CardTitle>
                <CardDescription>A Quick and Easy Planning Guide</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-sm text-muted-foreground mb-4">Practical advice on timing your retirement for maximum financial security and lifestyle satisfaction.</p>
                <Button 
                  variant="default" 
                  className="w-full"
                  onClick={() => window.open("https://awmfl1-my.sharepoint.com/personal/rosielle_awmfl_com/_layouts/15/onedrive.aspx?id=%2Fpersonal%2Frosielle%5Fawmfl%5Fcom%2FDocuments%2FAWMFL%20Guides%20%2D%20Final%20Draft%2FSecured%20Guides%202025&ct=1743196082829&or=OWA%2DNT%2DMail&ga=1&ls=true", "_blank", "noopener,noreferrer")}
                >
                  Access Guide <ExternalLink className="h-3 w-3 ml-1" />
                </Button>
              </CardContent>
            </Card>
            
            <Card className="overflow-hidden group hover:shadow-lg transition-all">
              <div className="relative pb-[140%] bg-muted">
                <img 
                  src="/lovable-uploads/06a287d8-9047-4181-8e04-88a782c65c19.png" 
                  alt="Estate Planning Simplified" 
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>
              <CardHeader className="py-3">
                <CardTitle className="text-lg">Estate Planning Simplified</CardTitle>
                <CardDescription>A Step-by-Step Guide</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-sm text-muted-foreground mb-4">Clear guidance on creating an effective estate plan to protect your assets and legacy.</p>
                <Button 
                  variant="default" 
                  className="w-full"
                  onClick={() => window.open("https://awmfl1-my.sharepoint.com/personal/rosielle_awmfl_com/_layouts/15/onedrive.aspx?id=%2Fpersonal%2Frosielle%5Fawmfl%5Fcom%2FDocuments%2FAWMFL%20Guides%20%2D%20Final%20Draft%2FSecured%20Guides%202025&ct=1743196082829&or=OWA%2DNT%2DMail&ga=1&ls=true", "_blank", "noopener,noreferrer")}
                >
                  Access Guide <ExternalLink className="h-3 w-3 ml-1" />
                </Button>
              </CardContent>
            </Card>
            
            <Card className="overflow-hidden group hover:shadow-lg transition-all">
              <div className="relative pb-[140%] bg-muted">
                <img 
                  src="/lovable-uploads/d5b2e677-56c7-4359-85f0-d716de4168fa.png" 
                  alt="Optimizing Social Security Benefits" 
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>
              <CardHeader className="py-3">
                <CardTitle className="text-lg">Optimizing Social Security Benefits</CardTitle>
                <CardDescription>Maximize your retirement income</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-sm text-muted-foreground mb-4">Strategies to maximize your Social Security benefits as part of your overall retirement plan.</p>
                <Button 
                  variant="default" 
                  className="w-full"
                  onClick={() => window.open("https://awmfl1-my.sharepoint.com/personal/rosielle_awmfl_com/_layouts/15/onedrive.aspx?id=%2Fpersonal%2Frosielle%5Fawmfl%5Fcom%2FDocuments%2FAWMFL%20Guides%20%2D%20Final%20Draft%2FSecured%20Guides%202025&ct=1743196082829&or=OWA%2DNT%2DMail&ga=1&ls=true", "_blank", "noopener,noreferrer")}
                >
                  Access Guide <ExternalLink className="h-3 w-3 ml-1" />
                </Button>
              </CardContent>
            </Card>
            
            <Card className="overflow-hidden group hover:shadow-lg transition-all">
              <div className="relative pb-[140%] bg-muted">
                <img 
                  src="/lovable-uploads/49235156-73d8-46ca-9404-c34512c3fafc.png" 
                  alt="GPS to Retirement Hidden Tax Secrets" 
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>
              <CardHeader className="py-3">
                <CardTitle className="text-lg">GPS to Retirement Hidden Tax Secrets</CardTitle>
                <CardDescription>Tax optimization strategies</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-sm text-muted-foreground mb-4">Insider tax planning strategies to minimize your tax burden during retirement.</p>
                <Button 
                  variant="default" 
                  className="w-full"
                  onClick={() => window.open("https://awmfl1-my.sharepoint.com/personal/rosielle_awmfl_com/_layouts/15/onedrive.aspx?id=%2Fpersonal%2Frosielle%5Fawmfl%5Fcom%2FDocuments%2FAWMFL%20Guides%20%2D%20Final%20Draft%2FSecured%20Guides%202025&ct=1743196082829&or=OWA%2DNT%2DMail&ga=1&ls=true", "_blank", "noopener,noreferrer")}
                >
                  Access Guide <ExternalLink className="h-3 w-3 ml-1" />
                </Button>
              </CardContent>
            </Card>
            
            <Card className="overflow-hidden group hover:shadow-lg transition-all">
              <div className="relative pb-[140%] bg-muted">
                <img 
                  src="/lovable-uploads/94f35b13-8595-4066-b37f-2fb62be96029.png" 
                  alt="Your GPS to Retirement Income Planning" 
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>
              <CardHeader className="py-3">
                <CardTitle className="text-lg">GPS to Retirement Income Planning</CardTitle>
                <CardDescription>Secure your financial future</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-sm text-muted-foreground mb-4">Comprehensive approach to creating sustainable income streams throughout retirement.</p>
                <Button 
                  variant="default" 
                  className="w-full"
                  onClick={() => window.open("https://awmfl1-my.sharepoint.com/personal/rosielle_awmfl_com/_layouts/15/onedrive.aspx?id=%2Fpersonal%2Frosielle%5Fawmfl%5Fcom%2FDocuments%2FAWMFL%20Guides%20%2D%20Final%20Draft%2FSecured%20Guides%202025&ct=1743196082829&or=OWA%2DNT%2DMail&ga=1&ls=true", "_blank", "noopener,noreferrer")}
                >
                  Access Guide <ExternalLink className="h-3 w-3 ml-1" />
                </Button>
              </CardContent>
            </Card>
            
            <Card className="overflow-hidden group hover:shadow-lg transition-all">
              <div className="relative pb-[140%] bg-muted">
                <img 
                  src="/lovable-uploads/63f104f0-65d0-47eb-b3ef-74ea0fb998e4.png" 
                  alt="12 Common Estate Planning Mistakes" 
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>
              <CardHeader className="py-3">
                <CardTitle className="text-lg">12 Common Estate Planning Mistakes</CardTitle>
                <CardDescription>And How to Avoid Them</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-sm text-muted-foreground mb-4">Critical guidance on avoiding the most common pitfalls in estate planning that can cost your family.</p>
                <Button 
                  variant="default" 
                  className="w-full"
                  onClick={() => window.open("https://awmfl1-my.sharepoint.com/personal/rosielle_awmfl_com/_layouts/15/onedrive.aspx?id=%2Fpersonal%2Frosielle%5Fawmfl%5Fcom%2FDocuments%2FAWMFL%20Guides%20%2D%20Final%20Draft%2FSecured%20Guides%202025&ct=1743196082829&or=OWA%2DNT%2DMail&ga=1&ls=true", "_blank", "noopener,noreferrer")}
                >
                  Access Guide <ExternalLink className="h-3 w-3 ml-1" />
                </Button>
              </CardContent>
            </Card>
          </div>
          
          <div className="mt-8 p-6 bg-primary/5 rounded-lg border border-primary/10">
            <h4 className="text-lg font-semibold mb-2">Need a Personalized Guide?</h4>
            <p className="mb-4">Our team can create custom financial guides tailored to your specific situation and goals.</p>
            <Button 
              variant="outline" 
              className="w-full md:w-auto"
              onClick={() => window.open("https://ghl.example.com/request-custom-guide", "_blank", "noopener,noreferrer")}
            >
              Request Custom Guide
            </Button>
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
              <Card className="overflow-hidden">
                <div className="relative h-[400px] bg-muted flex justify-center">
                  <img 
                    src="/lovable-uploads/c99b3253-fc75-4097-ad44-9ef520280206.png" 
                    alt="Life Integrated Financial Freedom by Tony Gomes" 
                    className="h-full object-contain"
                  />
                </div>
                <CardHeader>
                  <CardTitle className="text-base">Life Integrated Financial Freedom</CardTitle>
                  <CardDescription>By Tony Gomes</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">An Advanced Holistic Plan For Retirement - Published Feb 14, 2023</p>
                  <div className="flex items-center mb-3">
                    <div className="flex text-amber-500">
                      <span>★★★★★</span>
                    </div>
                    <span className="text-sm ml-1">14 reviews</span>
                  </div>
                  <p className="text-lg font-semibold mb-3">$17.99</p>
                  <div className="flex gap-2">
                    <Button 
                      variant="default" 
                      className="w-full"
                      onClick={() => window.open("https://www.amazon.com/Life-Integrated-Financial-Freedom-Advanced/dp/B0BVRGDMQJ/", "_blank", "noopener,noreferrer")}
                    >
                      Buy Now
                    </Button>
                    <Button 
                      variant="outline" 
                      className="flex-shrink-0"
                      onClick={() => window.open("https://www.amazon.com/Life-Integrated-Financial-Freedom-Advanced/dp/B0BVRGDMQJ/#customerReviews", "_blank", "noopener,noreferrer")}
                    >
                      View Reviews
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <div className="relative h-[400px] bg-muted flex justify-center">
                  <img 
                    src="/lovable-uploads/4f186128-9b08-4965-a540-64cf9b0ec9ee.png" 
                    alt="The 5 pillars of Wealth Creation by Tony Gomes" 
                    className="h-full object-contain"
                  />
                </div>
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
                <div className="relative h-[400px] bg-muted flex justify-center">
                  <img 
                    src="/lovable-uploads/7f52d8e5-bf6b-4533-8c1b-f933a43cfce7.png" 
                    alt="Legacy Planning Mastery by Tony Gomes" 
                    className="h-full object-contain"
                  />
                </div>
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
