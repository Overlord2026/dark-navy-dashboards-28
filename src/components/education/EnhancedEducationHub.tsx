import React, { useState, useMemo, useCallback } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, 
  Filter, 
  BookOpen, 
  Clock, 
  Award, 
  Users,
  TrendingUp,
  Shield,
  Star,
  Bookmark,
  Download,
  Play,
  CheckCircle2,
  GraduationCap,
  Building2
} from "lucide-react";
import { PersonaSelector, Persona } from "./PersonaSelector";
import { InteractiveModuleCard } from "./InteractiveModuleCard";
import { 
  familyOfficeBlueprint, 
  advisorDueDiligence, 
  privateMarketsGuide, 
  multigenerationalWealth, 
  diyToDelegated,
  moduleTestimonials 
} from "@/data/education/hnwModules";
import { TrustBadges } from "@/components/ui/TrustBadges";
import { toast } from "sonner";

interface FilterOptions {
  level: string;
  timeCommitment: string;
  topic: string;
  track: string;
}

export const EnhancedEducationHub = () => {
  const [activeTab, setActiveTab] = useState("start-here");
  const [selectedPersona, setSelectedPersona] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<FilterOptions>({
    level: "all",
    timeCommitment: "all",
    topic: "all",
    track: "all"
  });
  const [bookmarkedModules, setBookmarkedModules] = useState<string[]>([]);
  const [completedModules, setCompletedModules] = useState<string[]>([]);

  // Combine all HNW modules
  const allModules = useMemo(() => [
    ...familyOfficeBlueprint.map(m => ({ ...m, series: "family-office-blueprint", track: "advanced" })),
    ...advisorDueDiligence.map(m => ({ ...m, series: "advisor-due-diligence", track: "foundation" })),
    ...privateMarketsGuide.map(m => ({ ...m, series: "private-markets", track: "advanced" })),
    ...multigenerationalWealth.map(m => ({ ...m, series: "multigenerational-wealth", track: "advanced" })),
    ...diyToDelegated.map(m => ({ ...m, series: "diy-to-delegated", track: "foundation" }))
  ], []);

  // Filter modules based on search and filters
  const filteredModules = useMemo(() => {
    return allModules.filter(module => {
      const matchesSearch = module.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           module.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesLevel = filters.level === "all" || 
                          module.level.toLowerCase() === filters.level.toLowerCase();
      
      const matchesTrack = filters.track === "all" || module.track === filters.track;
      
      const matchesTopic = filters.topic === "all" || module.series.includes(filters.topic);

      return matchesSearch && matchesLevel && matchesTrack && matchesTopic;
    });
  }, [allModules, searchQuery, filters]);

  // Get persona-specific recommendations
  const getPersonaRecommendations = useCallback((persona: string) => {
    switch (persona) {
      case "business-owner":
        return [
          ...diyToDelegated,
          ...privateMarketsGuide,
          ...advisorDueDiligence.slice(0, 1)
        ];
      case "multi-generational":
        return familyOfficeBlueprint;
      case "pre-retiree":
        return [
          ...advisorDueDiligence,
          ...familyOfficeBlueprint.slice(0, 3)
        ];
      default:
        return [];
    }
  }, []);

  const handlePersonaSelect = (persona: string) => {
    setSelectedPersona(persona);
    setActiveTab("learning-paths");
    toast.success("Great choice! Your personalized learning path is ready.");
  };

  const handleBookmark = (moduleId: string) => {
    setBookmarkedModules(prev => 
      prev.includes(moduleId) 
        ? prev.filter(id => id !== moduleId)
        : [...prev, moduleId]
    );
  };

  const handleModuleComplete = (moduleId: string) => {
    setCompletedModules(prev => [...prev, moduleId]);
  };

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

  return (
    <motion.div 
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Hero Section with Trust Indicators */}
      <motion.div variants={itemVariants} className="text-center space-y-6">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold text-foreground">
            High-Net-Worth Education Center
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Sophisticated wealth management education designed by CFP® professionals. 
            No sales agenda—just real education for serious investors.
          </p>
        </div>
        
        <TrustBadges />
        
        <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Star className="h-4 w-4 text-yellow-500" />
            <span>4.8/5 from 2,847 clients</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-primary" />
            <span>12,000+ hours of content delivered</span>
          </div>
          <div className="flex items-center gap-2">
            <Award className="h-4 w-4 text-primary" />
            <span>Created by CFP® professionals</span>
          </div>
        </div>
      </motion.div>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="start-here">Start Here</TabsTrigger>
          <TabsTrigger value="learning-paths">Learning Paths</TabsTrigger>
          <TabsTrigger value="all-modules">All Modules</TabsTrigger>
          <TabsTrigger value="my-progress">My Progress</TabsTrigger>
        </TabsList>

        {/* Start Here Tab */}
        <TabsContent value="start-here" className="space-y-6">
          <PersonaSelector 
            onPersonaSelect={handlePersonaSelect}
            selectedPersona={selectedPersona}
          />
        </TabsContent>

        {/* Learning Paths Tab */}
        <TabsContent value="learning-paths" className="space-y-6">
          <AnimatePresence mode="wait">
            {selectedPersona ? (
              <motion.div
                key="persona-content"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-primary/10 rounded-full">
                        {selectedPersona === "business-owner" && <Building2 className="h-6 w-6 text-primary" />}
                        {selectedPersona === "multi-generational" && <Users className="h-6 w-6 text-primary" />}
                        {selectedPersona === "pre-retiree" && <GraduationCap className="h-6 w-6 text-primary" />}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold">
                          Your Personalized Learning Path
                        </h3>
                        <p className="text-muted-foreground">
                          Curated specifically for {selectedPersona.replace("-", " ")} needs
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {getPersonaRecommendations(selectedPersona).map((module, index) => (
                    <InteractiveModuleCard
                      key={module.id}
                      resource={module}
                      testimonial={moduleTestimonials[module.series as keyof typeof moduleTestimonials]}
                      progress={completedModules.includes(module.id) ? 100 : 0}
                      isCompleted={completedModules.includes(module.id)}
                      onEnroll={() => handleModuleComplete(module.id)}
                    />
                  ))}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="no-persona"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-12"
              >
                <GraduationCap className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Choose Your Learning Path</h3>
                <p className="text-muted-foreground mb-4">
                  Select your persona from the "Start Here" tab to see personalized recommendations.
                </p>
                <Button onClick={() => setActiveTab("start-here")}>
                  Choose Your Path
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </TabsContent>

        {/* All Modules Tab */}
        <TabsContent value="all-modules" className="space-y-6">
          {/* Search and Filter Controls */}
          <motion.div variants={itemVariants} className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search modules..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <div className="flex gap-2">
                <Select value={filters.level} onValueChange={(value) => setFilters(prev => ({ ...prev, level: value }))}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Levels</SelectItem>
                    <SelectItem value="foundation">Foundation</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={filters.track} onValueChange={(value) => setFilters(prev => ({ ...prev, track: value }))}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Track" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Tracks</SelectItem>
                    <SelectItem value="foundation">Foundation</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Filter summary */}
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>{filteredModules.length} modules found</span>
              {(searchQuery || filters.level !== "all" || filters.track !== "all") && (
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => {
                    setSearchQuery("");
                    setFilters({ level: "all", timeCommitment: "all", topic: "all", track: "all" });
                  }}
                >
                  Clear filters
                </Button>
              )}
            </div>
          </motion.div>

          {/* Modules Grid */}
          <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredModules.map((module) => (
              <InteractiveModuleCard
                key={module.id}
                resource={module}
                testimonial={moduleTestimonials[module.series as keyof typeof moduleTestimonials]}
                progress={completedModules.includes(module.id) ? 100 : 0}
                isCompleted={completedModules.includes(module.id)}
                onEnroll={() => handleModuleComplete(module.id)}
              />
            ))}
          </motion.div>
        </TabsContent>

        {/* My Progress Tab */}
        <TabsContent value="my-progress" className="space-y-6">
          <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                  Completed
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600 mb-2">
                  {completedModules.length}
                </div>
                <p className="text-sm text-muted-foreground">Modules completed</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bookmark className="h-5 w-5 text-blue-600" />
                  Bookmarked
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  {bookmarkedModules.length}
                </div>
                <p className="text-sm text-muted-foreground">Modules saved</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-orange-600" />
                  Learning Time
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-orange-600 mb-2">
                  {Math.round(completedModules.length * 32)}
                </div>
                <p className="text-sm text-muted-foreground">Minutes invested</p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Completed Modules */}
          {completedModules.length > 0 && (
            <motion.div variants={itemVariants} className="space-y-4">
              <h3 className="text-lg font-semibold">Completed Modules</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {allModules
                  .filter(module => completedModules.includes(module.id))
                  .map(module => (
                    <InteractiveModuleCard
                      key={module.id}
                      resource={module}
                      progress={100}
                      isCompleted={true}
                      showInteractiveElements={false}
                    />
                  ))}
              </div>
            </motion.div>
          )}
        </TabsContent>
      </Tabs>
    </motion.div>
  );
};