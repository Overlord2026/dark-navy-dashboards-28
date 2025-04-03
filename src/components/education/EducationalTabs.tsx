
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CourseList } from "./CourseList";
import { 
  categoryCourses,
  allCourses, 
  popularCourses, 
  taxCourses,
  investingCourses,
  retirementCourses,
  estatePlanningCourses,
  businessCourses
} from "@/data/education";
import { ProfessionalsProvider } from "@/hooks/useProfessionals";
import { ProfessionalsDirectory } from "@/components/professionals/ProfessionalsDirectory";

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
  
  // Get the courses for the selected category
  const getCoursesByCategoryId = (categoryId: string) => {
    switch(categoryId) {
      case "all-courses":
        return allCourses;
      case "popular":
        return popularCourses;
      case "tax-planning":
        return taxCourses;
      case "investing":
        return investingCourses;
      case "retirement":
        return retirementCourses;
      case "estate-planning":
        return estatePlanningCourses;
      case "business":
        return businessCourses;
      default:
        // Try to get from the dynamic categories
        const categoryData = categoryCourses[categoryId];
        return categoryData?.courses || allCourses;
    }
  };

  // Get the title for the selected category
  const getCategoryTitle = (categoryId: string) => {
    switch(categoryId) {
      case "all-courses":
        return "All Courses";
      case "popular":
        return "Popular Courses";
      case "tax-planning":
        return "Tax Planning Courses";
      case "investing":
        return "Investing Courses";
      case "retirement":
        return "Retirement Planning";
      case "estate-planning":
        return "Estate Planning";
      case "business":
        return "Business Courses";
      default:
        // Try to get from the dynamic categories
        const categoryData = categoryCourses[categoryId];
        return categoryData?.title || "Courses";
    }
  };

  const currentCourses = getCoursesByCategoryId(activeCategory);
  const categoryTitle = getCategoryTitle(activeCategory);

  return (
    <Tabs defaultValue={activeSection} value={activeSection} onValueChange={setActiveSection} className="w-full">
      <TabsList className="mb-4">
        <TabsTrigger value="courses">Courses</TabsTrigger>
        <TabsTrigger value="guides">Guides</TabsTrigger>
        <TabsTrigger value="books">Books</TabsTrigger>
        <TabsTrigger value="consultants">Consultants</TabsTrigger>
      </TabsList>
      
      <TabsContent value="courses" className="pt-4">
        {currentCourses && (
          <CourseList 
            title={categoryTitle}
            courses={currentCourses}
            onCourseEnrollment={handleCourseEnrollment}
          />
        )}
      </TabsContent>
      
      <TabsContent value="guides" className="pt-4">
        <div className="text-center py-8">
          <h3 className="text-xl font-semibold mb-2">Financial Guides Coming Soon</h3>
          <p className="text-muted-foreground">
            We're working on comprehensive guides to help you navigate various financial topics.
          </p>
        </div>
      </TabsContent>
      
      <TabsContent value="books" className="pt-4">
        <div className="text-center py-8">
          <h3 className="text-xl font-semibold mb-2">Recommended Books Coming Soon</h3>
          <p className="text-muted-foreground">
            We're curating a list of the best financial literature to support your learning journey.
          </p>
        </div>
      </TabsContent>
      
      <TabsContent value="consultants" className="pt-4">
        <h3 className="text-xl font-semibold mb-4">Financial Education Consultants</h3>
        <p className="text-muted-foreground mb-6">
          Connect with professionals who can provide personalized financial education and guidance.
        </p>
        
        <ProfessionalsProvider>
          <ProfessionalsDirectory />
        </ProfessionalsProvider>
      </TabsContent>
    </Tabs>
  );
}
