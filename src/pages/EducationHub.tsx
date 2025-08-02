import React, { useState, useMemo } from 'react';
import { Search, Filter, BookOpen, Video, Award, Users, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useEducationProgress } from '@/hooks/useEducationProgress';
import { LearningPathCards } from '@/components/education/LearningPathCards';
import { EducationalGuidesSection } from '@/components/education/EducationalGuidesSection';
import { VideoCourseSection } from '@/components/education/VideoCourseSection';
import { RecommendedBooksSection } from '@/components/education/RecommendedBooksSection';
import { ProfessionalResourcesSection } from '@/components/education/ProfessionalResourcesSection';
import { ProgressDashboard } from '@/components/education/ProgressDashboard';
import { GettingStartedSection } from '@/components/education/GettingStartedSection';
import { CoachingModule } from '@/components/coaching/CoachingModule';

export default function EducationHub() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLevel, setSelectedLevel] = useState('all');
  const { progressStats, getOverallProgress } = useEducationProgress();

  const categories = [
    { id: 'all', name: 'All Topics' },
    { id: 'retirement', name: 'Retirement Planning' },
    { id: 'investments', name: 'Investment Strategies' },
    { id: 'tax', name: 'Tax Optimization' },
    { id: 'estate', name: 'Estate Planning' },
    { id: 'insurance', name: 'Insurance Planning' },
    { id: 'professional', name: 'Professional Development' }
  ];

  const levels = [
    { id: 'all', name: 'All Levels' },
    { id: 'beginner', name: 'Beginner' },
    { id: 'intermediate', name: 'Intermediate' },
    { id: 'advanced', name: 'Advanced' }
  ];

  const overallProgress = useMemo(() => getOverallProgress(), [getOverallProgress]);

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Header Section */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-foreground">Education Hub</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Comprehensive financial education and professional development resources
        </p>
        
        {/* Overall Progress */}
        <div className="max-w-md mx-auto">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Overall Progress</span>
            <span className="text-sm font-medium">{Math.round(overallProgress)}%</span>
          </div>
          <Progress value={overallProgress} className="h-2" />
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search courses, guides, and resources..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex gap-2">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 border rounded-md bg-background text-foreground"
          >
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
          
          <select
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(e.target.value)}
            className="px-3 py-2 border rounded-md bg-background text-foreground"
          >
            {levels.map(level => (
              <option key={level.id} value={level.id}>{level.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <BookOpen className="h-8 w-8 mx-auto mb-2 text-primary" />
            <p className="text-2xl font-bold">{progressStats.totalModules}</p>
            <p className="text-sm text-muted-foreground">Total Modules</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <Award className="h-8 w-8 mx-auto mb-2 text-primary" />
            <p className="text-2xl font-bold">{progressStats.completedModules}</p>
            <p className="text-sm text-muted-foreground">Completed</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <TrendingUp className="h-8 w-8 mx-auto mb-2 text-primary" />
            <p className="text-2xl font-bold">{progressStats.activePaths}</p>
            <p className="text-sm text-muted-foreground">Active Paths</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <Users className="h-8 w-8 mx-auto mb-2 text-primary" />
            <p className="text-2xl font-bold">{progressStats.completedPaths}</p>
            <p className="text-sm text-muted-foreground">Certificates</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="paths">Learning Paths</TabsTrigger>
          <TabsTrigger value="guides">Guides</TabsTrigger>
          <TabsTrigger value="videos">Videos</TabsTrigger>
          <TabsTrigger value="books">Books</TabsTrigger>
          <TabsTrigger value="professional">Professional</TabsTrigger>
          <TabsTrigger value="coaching">Coaching</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <GettingStartedSection />
          <ProgressDashboard />
          <LearningPathCards featured={true} searchQuery={searchQuery} category={selectedCategory} />
        </TabsContent>

        <TabsContent value="paths">
          <LearningPathCards searchQuery={searchQuery} category={selectedCategory} level={selectedLevel} />
        </TabsContent>

        <TabsContent value="guides">
          <EducationalGuidesSection searchQuery={searchQuery} category={selectedCategory} />
        </TabsContent>

        <TabsContent value="videos">
          <VideoCourseSection searchQuery={searchQuery} category={selectedCategory} level={selectedLevel} />
        </TabsContent>

        <TabsContent value="books">
          <RecommendedBooksSection searchQuery={searchQuery} category={selectedCategory} />
        </TabsContent>

        <TabsContent value="professional">
          <ProfessionalResourcesSection searchQuery={searchQuery} />
        </TabsContent>

        <TabsContent value="coaching">
          <CoachingModule />
        </TabsContent>
      </Tabs>
    </div>
  );
}