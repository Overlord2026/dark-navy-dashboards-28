import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Clock, BookOpen, Play, Award, TrendingUp } from 'lucide-react';
import { useEducationProgress } from '@/hooks/useEducationProgress';
import { motion } from 'framer-motion';

interface LearningPathCardsProps {
  featured?: boolean;
  searchQuery?: string;
  category?: string;
  level?: string;
}

const learningPaths = [
  {
    id: 'retirement-planning-beginner',
    title: 'Retirement Planning Fundamentals',
    description: 'Learn the basics of retirement planning, 401(k)s, and building wealth for your future.',
    level: 'Beginner',
    category: 'retirement',
    duration: '4 hours',
    modules: 8,
    featured: true,
    completionRate: 0,
    color: 'bg-blue-500'
  },
  {
    id: 'investment-strategies-intermediate',
    title: 'Advanced Investment Strategies',
    description: 'Portfolio diversification, risk management, and advanced investment techniques.',
    level: 'Intermediate',
    category: 'investments',
    duration: '6 hours',
    modules: 12,
    featured: true,
    completionRate: 0,
    color: 'bg-green-500'
  },
  {
    id: 'tax-optimization-advanced',
    title: 'Tax Optimization Mastery',
    description: 'Advanced tax strategies, deductions, and wealth preservation techniques.',
    level: 'Advanced',
    category: 'tax',
    duration: '5 hours',
    modules: 10,
    featured: true,
    completionRate: 0,
    color: 'bg-purple-500'
  },
  {
    id: 'estate-planning-intermediate',
    title: 'Estate Planning Essentials',
    description: 'Wills, trusts, and legacy planning for your family\'s future.',
    level: 'Intermediate',
    category: 'estate',
    duration: '3 hours',
    modules: 6,
    featured: false,
    completionRate: 0,
    color: 'bg-orange-500'
  },
  {
    id: 'professional-development',
    title: 'Financial Advisor Excellence',
    description: 'Professional skills and compliance for financial advisors.',
    level: 'Advanced',
    category: 'professional',
    duration: '8 hours',
    modules: 16,
    featured: false,
    completionRate: 0,
    color: 'bg-red-500'
  }
];

export function LearningPathCards({ featured = false, searchQuery = '', category = 'all', level = 'all' }: LearningPathCardsProps) {
  const { createLearningPath, progressStats } = useEducationProgress();

  const filteredPaths = learningPaths.filter(path => {
    const matchesSearch = path.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         path.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = category === 'all' || path.category === category;
    const matchesLevel = level === 'all' || path.level.toLowerCase() === level;
    const matchesFeatured = !featured || path.featured;

    return matchesSearch && matchesCategory && matchesLevel && matchesFeatured;
  });

  const handleStartPath = (pathId: string) => {
    // Create learning path with sample modules
    const modules = Array.from({ length: learningPaths.find(p => p.id === pathId)?.modules || 5 }, 
      (_, i) => `${pathId}-module-${i + 1}`);
    createLearningPath(pathId, modules);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">
          {featured ? 'Featured Learning Paths' : 'All Learning Paths'}
        </h2>
        <Badge variant="secondary">{filteredPaths.length} paths</Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPaths.map((path, index) => (
          <motion.div
            key={path.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="h-full hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <Badge variant={path.level === 'Beginner' ? 'default' : 
                                path.level === 'Intermediate' ? 'secondary' : 'destructive'}>
                    {path.level}
                  </Badge>
                  {path.featured && <Badge variant="outline">Featured</Badge>}
                </div>
                <CardTitle className="text-lg">{path.title}</CardTitle>
                <CardDescription>{path.description}</CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {path.duration}
                  </div>
                  <div className="flex items-center gap-1">
                    <BookOpen className="h-4 w-4" />
                    {path.modules} modules
                  </div>
                </div>

                {path.completionRate > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Progress</span>
                      <span>{Math.round(path.completionRate)}%</span>
                    </div>
                    <Progress value={path.completionRate} />
                  </div>
                )}

                <Button 
                  className="w-full" 
                  onClick={() => handleStartPath(path.id)}
                  variant={path.completionRate > 0 ? "secondary" : "default"}
                >
                  {path.completionRate > 0 ? (
                    <>
                      <Play className="h-4 w-4 mr-2" />
                      Continue Path
                    </>
                  ) : (
                    <>
                      <TrendingUp className="h-4 w-4 mr-2" />
                      Start Learning
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {filteredPaths.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-medium mb-2">No learning paths found</h3>
          <p className="text-muted-foreground">Try adjusting your search or filter criteria.</p>
        </div>
      )}
    </div>
  );
}