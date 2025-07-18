
import React, { useState, useCallback, useMemo } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Star, Users, BookOpen, FileText, Download, Play, Award, TrendingUp, DollarSign, Shield } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  educationalResources, 
  featuredCourses, 
  popularCourses, 
  courseCategories,
  getResourcesByCategory,
  getCoursesByCategory 
} from "@/data/education";

interface EducationalTabsProps {
  activeSection: string;
  activeCategory: string;
  setActiveSection: (section: string) => void;
  setActiveCategory: (category: string) => void;
  handleCourseEnrollment: (courseId: string | number, title: string, isPaid: boolean, ghlUrl?: string) => void;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { 
      duration: 0.3,
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

export const EducationalTabs = React.memo(({ 
  activeSection, 
  activeCategory, 
  setActiveSection, 
  setActiveCategory, 
  handleCourseEnrollment 
}: EducationalTabsProps) => {
  const [isLoading, setIsLoading] = useState(false);

  // Memoize filtered data to prevent unnecessary recalculations
  const filteredResources = useMemo(() => {
    if (activeCategory === "all-courses") return educationalResources;
    return getResourcesByCategory(activeCategory);
  }, [activeCategory]);

  const filteredCourses = useMemo(() => {
    if (activeCategory === "all-courses") return { featured: featuredCourses, popular: popularCourses };
    return getCoursesByCategory(activeCategory);
  }, [activeCategory]);

  // Memoize event handlers to prevent unnecessary re-renders
  const handleSectionChange = useCallback((section: string) => {
    setIsLoading(true);
    setActiveSection(section);
    // Small delay to prevent flickering
    setTimeout(() => setIsLoading(false), 100);
  }, [setActiveSection]);

  const handleCategoryChange = useCallback((category: string) => {
    setIsLoading(true);
    setActiveCategory(category);
    setTimeout(() => setIsLoading(false), 100);
  }, [setActiveCategory]);

  const handleEnrollment = useCallback((courseId: string | number, title: string, isPaid: boolean, ghlUrl?: string) => {
    handleCourseEnrollment(courseId, title, isPaid, ghlUrl);
  }, [handleCourseEnrollment]);

  // Memoize category options to prevent re-renders
  const categoryOptions = useMemo(() => courseCategories, []);

  return (
    <div className="w-full space-y-6">
      {/* Main Section Tabs */}
      <Tabs value={activeSection} onValueChange={handleSectionChange} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="learn-discover">Learn & Discover</TabsTrigger>
          <TabsTrigger value="solutions-services">Solutions & Services</TabsTrigger>
          <TabsTrigger value="who-we-serve">Who We Serve</TabsTrigger>
        </TabsList>

        <AnimatePresence mode="wait">
          <TabsContent value="learn-discover" className="space-y-6">
            <LearnDiscoverSection 
              activeCategory={activeCategory}
              categoryOptions={categoryOptions}
              filteredResources={filteredResources}
              filteredCourses={filteredCourses}
              onCategoryChange={handleCategoryChange}
              onEnrollment={handleEnrollment}
              isLoading={isLoading}
            />
          </TabsContent>

          <TabsContent value="solutions-services" className="space-y-6">
            <SolutionsServicesSection 
              activeCategory={activeCategory}
              categoryOptions={categoryOptions}
              filteredResources={filteredResources}
              onCategoryChange={handleCategoryChange}
              isLoading={isLoading}
            />
          </TabsContent>

          <TabsContent value="who-we-serve" className="space-y-6">
            <WhoWeServeSection isLoading={isLoading} />
          </TabsContent>
        </AnimatePresence>
      </Tabs>
    </div>
  );
});

// Separate memoized components for each section
const LearnDiscoverSection = React.memo(({ 
  activeCategory, 
  categoryOptions, 
  filteredResources, 
  filteredCourses, 
  onCategoryChange, 
  onEnrollment,
  isLoading 
}: any) => (
  <motion.div 
    variants={containerVariants}
    initial="hidden"
    animate="visible"
    className="space-y-6"
  >
    {/* Category Selection */}
    <div className="flex flex-wrap gap-2">
      {categoryOptions.map((category: any) => (
        <Button
          key={category.id}
          variant={activeCategory === category.id ? "default" : "outline"}
          size="sm"
          onClick={() => onCategoryChange(category.id)}
          disabled={isLoading}
        >
          {category.name}
        </Button>
      ))}
    </div>

    {/* Content Tabs */}
    <Tabs defaultValue="courses" className="w-full">
      <TabsList className="grid w-full grid-cols-5">
        <TabsTrigger value="courses">Courses</TabsTrigger>
        <TabsTrigger value="guides">Guides</TabsTrigger>
        <TabsTrigger value="books">Books</TabsTrigger>
        <TabsTrigger value="whitepapers">Whitepapers</TabsTrigger>
        <TabsTrigger value="resources">Resources</TabsTrigger>
      </TabsList>

      <TabsContent value="courses">
        <CoursesGrid courses={filteredCourses} onEnrollment={onEnrollment} isLoading={isLoading} />
      </TabsContent>

      <TabsContent value="guides">
        <ResourcesGrid resources={filteredResources.guides} type="guides" isLoading={isLoading} />
      </TabsContent>

      <TabsContent value="books">
        <ResourcesGrid resources={filteredResources.books} type="books" isLoading={isLoading} />
      </TabsContent>

      <TabsContent value="whitepapers">
        <ResourcesGrid resources={filteredResources.whitepapers} type="whitepapers" isLoading={isLoading} />
      </TabsContent>

      <TabsContent value="resources">
        <ResourcesGrid resources={filteredResources.resources} type="resources" isLoading={isLoading} />
      </TabsContent>
    </Tabs>
  </motion.div>
));

const SolutionsServicesSection = React.memo(({ 
  activeCategory, 
  categoryOptions, 
  filteredResources, 
  onCategoryChange,
  isLoading 
}: any) => (
  <motion.div 
    variants={containerVariants}
    initial="hidden"
    animate="visible"
    className="space-y-6"
  >
    {/* Category Selection */}
    <div className="flex flex-wrap gap-2">
      {categoryOptions.map((category: any) => (
        <Button
          key={category.id}
          variant={activeCategory === category.id ? "default" : "outline"}
          size="sm"
          onClick={() => onCategoryChange(category.id)}
          disabled={isLoading}
        >
          {category.name}
        </Button>
      ))}
    </div>

    {/* Solutions Grid */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {getSolutionsByCategory(activeCategory).map((solution, index) => (
        <SolutionCard key={`solution-${index}`} solution={solution} />
      ))}
    </div>
  </motion.div>
));

const WhoWeServeSection = React.memo(({ isLoading }: { isLoading: boolean }) => (
  <motion.div 
    variants={containerVariants}
    initial="hidden"
    animate="visible"
    className="space-y-6"
  >
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {getClientTypes().map((clientType, index) => (
        <ClientTypeCard key={`client-${index}`} clientType={clientType} />
      ))}
    </div>
  </motion.div>
));

// Memoized grid components
const CoursesGrid = React.memo(({ courses, onEnrollment, isLoading }: any) => {
  if (isLoading) return <div className="text-center py-8">Loading courses...</div>;
  
  const allCourses = [...(courses.featured || []), ...(courses.popular || [])];
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {allCourses.map((course, index) => (
        <CourseCard 
          key={`course-${course.id}-${index}`}
          course={course} 
          onEnrollment={onEnrollment}
        />
      ))}
    </div>
  );
});

const ResourcesGrid = React.memo(({ resources, type, isLoading }: any) => {
  if (isLoading) return <div className="text-center py-8">Loading resources...</div>;
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {resources?.map((resource: any, index: number) => (
        <ResourceCard 
          key={`${type}-${resource.id}-${index}`}
          resource={resource} 
          type={type}
        />
      ))}
    </div>
  );
});

// Memoized card components
const CourseCard = React.memo(({ course, onEnrollment }: any) => (
  <motion.div variants={itemVariants}>
    <Card className="h-full hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            <Badge variant={course.isPaid ? "default" : "secondary"}>
              {course.isPaid ? "Paid" : "Free"}
            </Badge>
          </div>
          {course.comingSoon && (
            <Badge variant="outline">Coming Soon</Badge>
          )}
        </div>
        <CardTitle className="text-lg">{course.title}</CardTitle>
        <CardDescription className="line-clamp-2">{course.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
          <div className="flex items-center gap-1">
            <Award className="h-4 w-4" />
            {course.level}
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            {course.duration}
          </div>
        </div>
        <Button 
          className="w-full"
          onClick={() => onEnrollment(course.id, course.title, course.isPaid, course.ghlUrl)}
          disabled={course.comingSoon}
        >
          {course.comingSoon ? "Coming Soon" : course.isPaid ? "Enroll Now" : "Start Learning"}
        </Button>
      </CardContent>
    </Card>
  </motion.div>
));

const ResourceCard = React.memo(({ resource, type }: any) => (
  <motion.div variants={itemVariants}>
    <Card className="h-full hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            {getResourceIcon(type)}
            <Badge variant={resource.isPaid ? "default" : "secondary"}>
              {resource.isPaid ? "Paid" : "Free"}
            </Badge>
          </div>
        </div>
        <CardTitle className="text-lg">{resource.title}</CardTitle>
        <CardDescription className="line-clamp-2">{resource.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
          <div className="flex items-center gap-1">
            <Award className="h-4 w-4" />
            {resource.level}
          </div>
          {resource.author && (
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              {resource.author}
            </div>
          )}
        </div>
        <Button 
          className="w-full"
          onClick={() => window.open(resource.ghlUrl, '_blank')}
        >
          <Download className="h-4 w-4 mr-2" />
          {resource.isPaid ? "Purchase" : "Download"}
        </Button>
      </CardContent>
    </Card>
  </motion.div>
));

const SolutionCard = React.memo(({ solution }: any) => (
  <motion.div variants={itemVariants}>
    <Card className="h-full hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-center gap-2">
          {solution.icon}
          <CardTitle className="text-lg">{solution.title}</CardTitle>
        </div>
        <CardDescription>{solution.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <Button className="w-full">
          Learn More
        </Button>
      </CardContent>
    </Card>
  </motion.div>
));

const ClientTypeCard = React.memo(({ clientType }: any) => (
  <motion.div variants={itemVariants}>
    <Card className="h-full hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-center gap-2">
          {clientType.icon}
          <CardTitle className="text-lg">{clientType.title}</CardTitle>
        </div>
        <CardDescription>{clientType.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {clientType.features.map((feature: string, index: number) => (
            <div key={index} className="flex items-center gap-2 text-sm">
              <div className="w-2 h-2 bg-primary rounded-full" />
              {feature}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  </motion.div>
));

// Helper functions
const getResourceIcon = (type: string) => {
  switch (type) {
    case 'guides': return <FileText className="h-5 w-5 text-blue-500" />;
    case 'books': return <BookOpen className="h-5 w-5 text-green-500" />;
    case 'whitepapers': return <FileText className="h-5 w-5 text-purple-500" />;
    case 'resources': return <Download className="h-5 w-5 text-orange-500" />;
    default: return <FileText className="h-5 w-5 text-gray-500" />;
  }
};

const getSolutionsByCategory = (category: string) => [
  {
    title: "Wealth Management",
    description: "Comprehensive wealth management solutions for high-net-worth individuals",
    icon: <TrendingUp className="h-6 w-6 text-primary" />
  },
  {
    title: "Tax Planning",
    description: "Advanced tax strategies and planning services",
    icon: <DollarSign className="h-6 w-6 text-primary" />
  },
  {
    title: "Estate Planning",
    description: "Comprehensive estate planning and legacy management",
    icon: <Shield className="h-6 w-6 text-primary" />
  }
];

const getClientTypes = () => [
  {
    title: "High Net Worth Individuals",
    description: "Comprehensive wealth management for individuals with significant assets",
    icon: <Users className="h-6 w-6 text-primary" />,
    features: ["Portfolio Management", "Tax Planning", "Estate Planning"]
  },
  {
    title: "Business Owners",
    description: "Specialized financial services for business owners and entrepreneurs",
    icon: <TrendingUp className="h-6 w-6 text-primary" />,
    features: ["Business Succession", "Tax Optimization", "Retirement Planning"]
  },
  {
    title: "Retirees",
    description: "Retirement income strategies and wealth preservation",
    icon: <Shield className="h-6 w-6 text-primary" />,
    features: ["Income Planning", "Healthcare Costs", "Legacy Planning"]
  }
];

EducationalTabs.displayName = "EducationalTabs";
