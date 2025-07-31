import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, Clock, User, Star } from 'lucide-react';

interface VideoCourseSectionProps {
  searchQuery?: string;
  category?: string;
  level?: string;
}

const videoCourses = [
  {
    id: 'retirement-basics',
    title: 'Retirement Planning Basics',
    description: 'Complete guide to starting your retirement planning journey',
    instructor: 'Tony Richey',
    duration: '2h 30m',
    level: 'Beginner',
    category: 'retirement',
    rating: 4.9,
    students: 1240,
    thumbnail: '/placeholder.svg',
    isPremium: false
  },
  {
    id: 'advanced-tax-strategies',
    title: 'Advanced Tax Strategies',
    description: 'Professional-level tax optimization techniques',
    instructor: 'Sarah Johnson',
    duration: '3h 45m',
    level: 'Advanced',
    category: 'tax',
    rating: 4.8,
    students: 567,
    thumbnail: '/placeholder.svg',
    isPremium: true
  },
  {
    id: 'estate-planning-essentials',
    title: 'Estate Planning Essentials',
    description: 'Protect your legacy with proper estate planning',
    instructor: 'Michael Chen',
    duration: '1h 50m',
    level: 'Intermediate',
    category: 'estate',
    rating: 4.7,
    students: 892,
    thumbnail: '/placeholder.svg',
    isPremium: false
  }
];

export function VideoCourseSection({ searchQuery = '', category = 'all', level = 'all' }: VideoCourseSectionProps) {
  const filteredCourses = videoCourses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = category === 'all' || course.category === category;
    const matchesLevel = level === 'all' || course.level.toLowerCase() === level;

    return matchesSearch && matchesCategory && matchesLevel;
  });

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">Video Courses</h2>
        <p className="text-muted-foreground">
          Expert-led video courses on financial planning and wealth management
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map((course) => (
          <Card key={course.id} className="h-full hover:shadow-lg transition-all duration-300">
            <CardHeader className="p-0">
              <div className="relative">
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                  <Button size="lg" className="bg-white/90 text-black hover:bg-white">
                    <Play className="h-5 w-5 mr-2" />
                    Play Course
                  </Button>
                </div>
                {course.isPremium && (
                  <Badge className="absolute top-2 right-2 bg-yellow-500 text-black">
                    Premium
                  </Badge>
                )}
              </div>
            </CardHeader>

            <CardContent className="p-4">
              <div className="space-y-3">
                <div>
                  <CardTitle className="text-lg line-clamp-2">{course.title}</CardTitle>
                  <CardDescription className="line-clamp-2">{course.description}</CardDescription>
                </div>

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <User className="h-4 w-4" />
                  {course.instructor}
                </div>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {course.duration}
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      {course.rating}
                    </div>
                  </div>
                  <Badge variant={course.level === 'Beginner' ? 'default' : 
                                course.level === 'Intermediate' ? 'secondary' : 'destructive'}>
                    {course.level}
                  </Badge>
                </div>

                <div className="text-xs text-muted-foreground">
                  {course.students.toLocaleString()} students enrolled
                </div>

                <Button className="w-full">
                  {course.isPremium ? 'Upgrade to Access' : 'Start Course'}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredCourses.length === 0 && (
        <div className="text-center py-12">
          <Play className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-medium mb-2">No video courses found</h3>
          <p className="text-muted-foreground">Try adjusting your search or filter criteria.</p>
        </div>
      )}
    </div>
  );
}