import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Search, Clock, Users, GraduationCap, Building, Trophy, Heart } from 'lucide-react';
import { useEventTracking } from '@/hooks/useEventTracking';

interface Course {
  id: string;
  title: string;
  description: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string;
  isPremium: boolean;
  category: string;
  slug: string;
}

const courses: Course[] = [
  {
    id: '1',
    title: 'Investment Fundamentals',
    description: 'Learn the basics of investing, portfolio theory, and risk management.',
    level: 'Beginner',
    duration: '2 hours',
    isPremium: false,
    category: 'foundation',
    slug: 'investment-fundamentals'
  },
  {
    id: '2',
    title: 'Tax-Efficient Retirement Planning',
    description: 'Advanced strategies for Roth conversions, tax-loss harvesting, and withdrawal sequences.',
    level: 'Advanced',
    duration: '4 hours',
    isPremium: true,
    category: 'advanced',
    slug: 'tax-efficient-retirement'
  },
  {
    id: '3',
    title: 'Longevity Planning & Healthcare Costs',
    description: 'Plan for healthcare expenses and longevity risk in retirement.',
    level: 'Intermediate',
    duration: '3 hours',
    isPremium: true,
    category: 'healthspan',
    slug: 'longevity-planning'
  },
  {
    id: '4',
    title: 'NIL Contract Basics',
    description: 'Understanding Name, Image, and Likeness opportunities for student athletes.',
    level: 'Beginner',
    duration: '1.5 hours',
    isPremium: false,
    category: 'athletes',
    slug: 'nil-basics'
  },
  {
    id: '5',
    title: 'Business Entity Selection',
    description: 'Choose the right entity structure for tax efficiency and asset protection.',
    level: 'Advanced',
    duration: '3.5 hours',
    isPremium: true,
    category: 'business',
    slug: 'entity-selection'
  }
];

const categories = [
  { id: 'foundation', label: 'Foundation', icon: BookOpen },
  { id: 'advanced', label: 'Advanced', icon: GraduationCap },
  { id: 'healthspan', label: 'Healthspan', icon: Heart },
  { id: 'athletes', label: 'Athletes & NIL', icon: Trophy },
  { id: 'business', label: 'Business Owners', icon: Building }
];

export default function EducationHub() {
  const navigate = useNavigate();
  const { trackEvent } = useEventTracking();
  const [activeTab, setActiveTab] = useState('foundation');
  const [searchQuery, setSearchQuery] = useState('');
  const [levelFilter, setLevelFilter] = useState('all');

  const filteredCourses = courses.filter(course => {
    const matchesTab = course.category === activeTab;
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLevel = levelFilter === 'all' || course.level === levelFilter;
    
    return matchesTab && matchesSearch && matchesLevel;
  });

  const handleCourseStart = (course: Course) => {
    trackEvent('course_started', course.slug);
    navigate(`/courses/${course.slug}`);
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-7xl mx-auto py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 flex items-center justify-center gap-3">
            <BookOpen className="h-10 w-10 text-primary" />
            Education Hub
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Comprehensive financial education courses designed for every level and specialty.
          </p>
        </div>

        {/* Search & Filters */}
        <div className="mb-8 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={levelFilter} onValueChange={setLevelFilter}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Levels</SelectItem>
              <SelectItem value="Beginner">Beginner</SelectItem>
              <SelectItem value="Intermediate">Intermediate</SelectItem>
              <SelectItem value="Advanced">Advanced</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Course Categories */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 mb-8">
            {categories.map((category) => {
              const IconComponent = category.icon;
              return (
                <TabsTrigger
                  key={category.id}
                  value={category.id}
                  className="flex items-center gap-2 text-sm"
                >
                  <IconComponent className="h-4 w-4" />
                  <span className="hidden sm:inline">{category.label}</span>
                </TabsTrigger>
              );
            })}
          </TabsList>

          {categories.map((category) => (
            <TabsContent key={category.id} value={category.id} className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCourses.map((course) => (
                  <Card
                    key={course.id}
                    className="group hover:shadow-lg transition-all duration-300 cursor-pointer"
                    onClick={() => handleCourseStart(course)}
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-lg line-clamp-2 group-hover:text-primary transition-colors">
                          {course.title}
                        </CardTitle>
                        <div className="flex flex-col gap-1">
                          <Badge variant={course.isPremium ? 'default' : 'secondary'}>
                            {course.isPremium ? 'Premium' : 'Free'}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {course.level}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground mb-4 line-clamp-3">
                        {course.description}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          {course.duration}
                        </div>
                        
                        <Button 
                          size="sm" 
                          className="group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                        >
                          Start Course
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              {filteredCourses.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No courses found matching your criteria.</p>
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>

        {/* Progress Tracking Placeholder */}
        <div className="mt-12 p-6 bg-muted/20 rounded-lg border-2 border-dashed border-muted-foreground/20">
          <div className="text-center">
            <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Progress Tracking Coming Soon</h3>
            <p className="text-muted-foreground">
              Track your learning progress, earn certificates, and unlock advanced courses.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}