import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  familyOfficeBlueprint, 
  advisorDueDiligence, 
  privateMarketsGuide, 
  multigenerationalWealth, 
  diyToDelegated 
} from "@/data/education/hnwModules";
import { targetPlanningCourse } from "@/data/education/targetPlanningCourse";
import { PersonaSelector } from "./PersonaSelector";
import { InteractiveModuleCard } from "./InteractiveModuleCard";
import { AdvancedCalculators } from "./AdvancedCalculators";
import { CertificateGenerator } from "./CertificateGenerator";
import { WorkshopHub } from "./WorkshopHub";
import { ModuleFeedback } from "./ModuleFeedback";
import { VIPRoadmapOffer } from "./VIPRoadmapOffer";
import { useEducationProgress } from "@/hooks/useEducationProgress";
import { 
  GraduationCap, 
  BookOpen, 
  Calculator, 
  TrendingUp, 
  Award,
  Search,
  Filter,
  CheckCircle,
  Shield,
  Users,
  Video,
  Calendar
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function EnhancedEducationHub() {
  const {
    selectedPersona,
    moduleProgress,
    learningPaths: userPaths,
    getModuleProgress,
    completeModule,
    bookmarkModule,
    getOverallProgress,
    getCompletedModules
  } = useEducationProgress();

  const [showCertificate, setShowCertificate] = useState(false);
  const [showVIPOffer, setShowVIPOffer] = useState(false);
  const [completedAdvancedModules, setCompletedAdvancedModules] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");

  // Check for certificate and VIP offer eligibility
  useEffect(() => {
    const completed = getCompletedModules();
    const advancedCompleted = completed.filter(m => 
      allModules.some(module => module.id === m.id && module.level === "Advanced")
    ).length;
    
    setCompletedAdvancedModules(advancedCompleted);
    
    // Show VIP offer if user completed 3+ advanced modules
    if (advancedCompleted >= 3 && !showVIPOffer) {
      setShowVIPOffer(true);
    }
  }, [moduleProgress, getCompletedModules, showVIPOffer]);

  const allModules = [...familyOfficeBlueprint, ...advisorDueDiligence, ...privateMarketsGuide, ...multigenerationalWealth, ...diyToDelegated];
  
  const filteredModules = allModules.filter(module => {
    const matchesSearch = module.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         module.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = activeFilter === "all" || 
                         module.level.toLowerCase() === activeFilter.toLowerCase() ||
                         module.persona?.includes(activeFilter);
    
    return matchesSearch && matchesFilter;
  });

  const handleFeedbackSubmit = (moduleId: string, rating: number, feedback: string) => {
    // In a real implementation, this would send feedback to your system
    console.log("Feedback submitted:", { moduleId, rating, feedback });
  };

  const handleDownloadCertificate = () => {
    // In a real implementation, this would generate and download a PDF certificate
    console.log("Certificate downloaded");
  };

  const handleScheduleVIPCall = () => {
    // In a real implementation, this would open calendar booking
    console.log("VIP call scheduled");
  };

  return (
    <div className="space-y-8">
      {/* Hero Section with Fiduciary Messaging */}
      <div className="text-center space-y-4 py-8 bg-gradient-to-r from-primary/5 to-accent/5 rounded-lg border border-primary/10">
        <div className="flex items-center justify-center gap-4 mb-4">
          <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
            <Shield className="h-3 w-3 mr-1" />
            CFP® Professional
          </Badge>
          <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100">
            <CheckCircle className="h-3 w-3 mr-1" />
            Fiduciary Standard
          </Badge>
          <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100">
            <Users className="h-3 w-3 mr-1" />
            25+ Years Experience
          </Badge>
        </div>
        
        <h1 className="text-4xl font-bold text-primary">Financial Education Excellence</h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          No sales agenda—real education. Our CFP® professionals have created this comprehensive 
          curriculum exclusively for sophisticated investors and families seeking financial clarity.
        </p>
        <p className="text-sm text-muted-foreground italic">
          "Education first, relationship second" - Our fiduciary promise to you
        </p>
      </div>

      {/* VIP Roadmap Offer */}
      {showVIPOffer && (
        <VIPRoadmapOffer
          completedCourses={completedAdvancedModules}
          trackType="Advanced"
          onScheduleCall={handleScheduleVIPCall}
        />
      )}

      {/* Start Here Section */}
      <PersonaSelector onPersonaSelect={() => {}} selectedPersona={selectedPersona} />

      {/* Progress Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Overall Progress</p>
                <p className="text-2xl font-bold">{getOverallProgress()}%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Completed</p>
                <p className="text-2xl font-bold">{getCompletedModules().length}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Learning Path</p>
                <p className="text-sm font-medium">{selectedPersona || "Not Selected"}</p>
              </div>
              <GraduationCap className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Certificates</p>
                <p className="text-2xl font-bold">{completedAdvancedModules >= 3 ? 1 : 0}</p>
              </div>
              <Award className="h-8 w-8 text-amber-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search courses, modules, and guides..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Select value={activeFilter} onValueChange={setActiveFilter}>
          <SelectTrigger className="w-48">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Filter by..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Content</SelectItem>
            <SelectItem value="beginner">Beginner</SelectItem>
            <SelectItem value="intermediate">Intermediate</SelectItem>
            <SelectItem value="advanced">Advanced</SelectItem>
            <SelectItem value="business-owner">Business Owner</SelectItem>
            <SelectItem value="multi-generational">Multi-Gen Family</SelectItem>
            <SelectItem value="pre-retiree">Pre-Retiree</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="courses" className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="courses" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            Courses & Modules
          </TabsTrigger>
          <TabsTrigger value="target-planning" className="flex items-center gap-2">
            <Video className="h-4 w-4" />
            Target Planning
          </TabsTrigger>
          <TabsTrigger value="workshops" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Workshops
          </TabsTrigger>
          <TabsTrigger value="calculators" className="flex items-center gap-2">
            <Calculator className="h-4 w-4" />
            Advanced Tools
          </TabsTrigger>
          <TabsTrigger value="progress" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            My Progress
          </TabsTrigger>
          <TabsTrigger value="certificates" className="flex items-center gap-2">
            <Award className="h-4 w-4" />
            Certificates
          </TabsTrigger>
        </TabsList>

        <TabsContent value="courses" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredModules.map((module) => (
              <div key={module.id} className="space-y-4">
                <InteractiveModuleCard
                  module={module}
                  progress={getModuleProgress(module.id).progress}
                  onComplete={(quizScore) => completeModule(module.id, quizScore)}
                  onBookmark={(bookmarked) => bookmarkModule(module.id, bookmarked)}
                />
                {getModuleProgress(module.id).completed && (
                  <ModuleFeedback
                    moduleId={module.id}
                    moduleName={module.title}
                    onFeedbackSubmit={(rating, feedback) => 
                      handleFeedbackSubmit(module.id, rating, feedback)
                    }
                  />
                )}
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="target-planning" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <CardTitle className="text-2xl">{targetPlanningCourse.title}</CardTitle>
                  <p className="text-muted-foreground">{targetPlanningCourse.description}</p>
                </div>
                <Badge variant="secondary">{targetPlanningCourse.level}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{targetPlanningCourse.moduleCount}</div>
                  <div className="text-sm text-muted-foreground">Modules</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{targetPlanningCourse.duration}</div>
                  <div className="text-sm text-muted-foreground">Total Time</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">CFP®</div>
                  <div className="text-sm text-muted-foreground">Instructor</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">Free</div>
                  <div className="text-sm text-muted-foreground">Full Access</div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h4 className="font-semibold">Learning Objectives:</h4>
                <ul className="space-y-2">
                  {targetPlanningCourse.learningObjectives.map((objective, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">{objective}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex gap-4">
                <Button size="lg" className="flex-1">
                  <Video className="h-5 w-5 mr-2" />
                  Start Course
                </Button>
                <Button variant="outline" size="lg">
                  <BookOpen className="h-5 w-5 mr-2" />
                  Preview Syllabus
                </Button>
              </div>

              <div className="bg-primary/5 rounded-lg p-4">
                <p className="text-sm text-center">
                  <strong>Course Completion Benefit:</strong> {targetPlanningCourse.nextSteps.description}
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="workshops" className="space-y-6">
          <WorkshopHub />
        </TabsContent>

        <TabsContent value="calculators" className="space-y-6">
          <AdvancedCalculators />
        </TabsContent>

        <TabsContent value="progress" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {userPaths.map((path) => (
              <Card key={path.id}>
                <CardHeader>
                  <CardTitle className="text-lg">{path.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">{path.description}</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>{path.totalProgress}%</span>
                    </div>
                    <Progress value={path.totalProgress} className="w-full" />
                    <p className="text-xs text-muted-foreground">
                      {path.completedModules.length} of {path.modules.length} modules completed
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="certificates" className="space-y-6">
          {completedAdvancedModules >= 3 ? (
            <div className="space-y-6">
              <CertificateGenerator
                courseName="Advanced Wealth Management Track"
                completionDate={new Date().toISOString()}
                trackType="Advanced"
                onDownload={handleDownloadCertificate}
              />
              {showCertificate && (
                <div className="text-center py-8">
                  <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Congratulations!</h3>
                  <p className="text-muted-foreground">
                    You've earned your certificate in Advanced Wealth Management
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <Award className="h-16 w-16 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Earn Your Certificate</h3>
              <p className="text-muted-foreground mb-6">
                Complete 3 or more advanced modules to earn your professional certificate
              </p>
              <div className="max-w-md mx-auto">
                <Progress value={(completedAdvancedModules / 3) * 100} className="mb-2" />
                <p className="text-sm text-muted-foreground">
                  {completedAdvancedModules} of 3 required modules completed
                </p>
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}