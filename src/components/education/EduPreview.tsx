import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, BookOpen, TrendingUp, Shield, Calculator } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const courses = [
  {
    id: 'wealth-preservation',
    title: 'Wealth Preservation Strategies',
    description: 'Learn essential techniques for protecting and growing family wealth across generations.',
    icon: Shield,
    duration: '45 min',
    level: 'Intermediate'
  },
  {
    id: 'estate-planning-basics',
    title: 'Estate Planning Fundamentals',
    description: 'Master the basics of estate planning, trusts, and succession planning for families.',
    icon: BookOpen,
    duration: '60 min',
    level: 'Beginner'
  },
  {
    id: 'investment-strategies',
    title: 'Advanced Investment Strategies',
    description: 'Explore sophisticated investment approaches used by successful family offices.',
    icon: TrendingUp,
    duration: '90 min',
    level: 'Advanced'
  },
  {
    id: 'tax-optimization',
    title: 'Tax Optimization Techniques',
    description: 'Discover proven methods to minimize tax liability and maximize after-tax returns.',
    icon: Calculator,
    duration: '75 min',
    level: 'Intermediate'
  }
];

export function EduPreview() {
  const navigate = useNavigate();

  const handleStartLesson = (courseId: string) => {
    navigate(`/learn/courses/${courseId}`);
  };

  return (
    <section className="py-16 px-4 bg-muted/10">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4 text-foreground">
            Master Family Office <span className="text-brand-gold">Education</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Enhance your wealth management knowledge with our curated courses designed for family offices and high-net-worth individuals.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {courses.map((course) => {
            const IconComponent = course.icon;
            return (
              <Card key={course.id} className="border-border hover:border-brand-gold/50 transition-all duration-300 hover:shadow-lg group">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between mb-3">
                    <IconComponent className="h-8 w-8 text-brand-gold" />
                    <div className="text-xs text-muted-foreground">
                      <span className="bg-muted px-2 py-1 rounded-full">{course.level}</span>
                    </div>
                  </div>
                  <CardTitle className="text-lg group-hover:text-brand-gold transition-colors">
                    {course.title}
                  </CardTitle>
                  <CardDescription className="text-sm">
                    {course.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
                    <span>Duration: {course.duration}</span>
                  </div>
                  <Button 
                    onClick={() => handleStartLesson(course.id)}
                    className="w-full bg-brand-gold hover:bg-brand-gold/90 text-brand-black group-hover:scale-105 transition-transform"
                    size="sm"
                  >
                    Start Free Lesson
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="text-center mt-12">
          <Button 
            variant="outline" 
            size="lg"
            className="border-brand-gold text-brand-gold hover:bg-brand-gold/10"
            onClick={() => navigate('/learn')}
          >
            View All Courses
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </section>
  );
}