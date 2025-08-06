import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Play, ArrowRight } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAuth } from '@/context/AuthContext';
import { abTesting } from '@/lib/abTesting';

export const EducationResources = () => {
  const { user } = useAuth();
  
  // A/B Test for education CTA
  const educationVariant = abTesting.getVariant('education_cta', user?.id || 'anonymous');
  const ctaText = educationVariant?.config.buttonText || 'Start Learning';

  const resources = [
    {
      title: 'Wealth Preservation Strategies',
      type: 'Course',
      duration: '2h 30m',
      image: '/placeholder.svg',
      isNew: true,
      recommended: true
    },
    {
      title: 'Estate Planning Fundamentals',
      type: 'Guide',
      duration: '45m read',
      image: '/placeholder.svg',
      isNew: false,
      recommended: true
    },
    {
      title: 'Tax Optimization Techniques',
      type: 'Video Series',
      duration: '3h 15m',
      image: '/placeholder.svg',
      isNew: true,
      recommended: false
    },
    {
      title: 'Family Governance Best Practices',
      type: 'Webinar',
      duration: '1h 20m',
      image: '/placeholder.svg',
      isNew: false,
      recommended: true
    },
    {
      title: 'Investment Due Diligence',
      type: 'Course',
      duration: '4h 10m',
      image: '/placeholder.svg',
      isNew: false,
      recommended: false
    }
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            Education & Resources
          </CardTitle>
          <Button 
            variant="outline" 
            size="sm" 
            className="gap-2"
            onClick={() => {
              abTesting.trackConversion('education_cta', educationVariant?.id || 'unknown', user?.id || 'anonymous', 'education_cta_click');
            }}
          >
            {ctaText}
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-sm text-muted-foreground">Recommended for You</p>
      </CardHeader>
      <CardContent>
        <ScrollArea className="w-full">
          <div className="flex gap-4 pb-4">
            {resources.map((resource, index) => (
              <Card 
                key={index}
                className="min-w-[280px] hover:shadow-md transition-shadow cursor-pointer"
              >
                <CardContent className="p-4">
                  <div className="aspect-video bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg mb-3 flex items-center justify-center relative">
                    <Play className="h-8 w-8 text-primary/60" />
                    {resource.isNew && (
                      <Badge className="absolute top-2 right-2 text-xs">
                        NEW
                      </Badge>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {resource.type}
                      </Badge>
                      {resource.recommended && (
                        <Badge variant="secondary" className="text-xs">
                          Recommended
                        </Badge>
                      )}
                    </div>
                    
                    <h4 className="font-medium text-sm leading-tight">{resource.title}</h4>
                    <p className="text-xs text-muted-foreground">{resource.duration}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};