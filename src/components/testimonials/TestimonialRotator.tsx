import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Star, Play, Quote, ChevronLeft, ChevronRight, Users } from 'lucide-react';

interface Testimonial {
  id: string;
  name: string;
  role: string;
  company?: string;
  content: string;
  rating: number;
  image?: string;
  videoUrl?: string;
  metrics?: {
    value: string;
    label: string;
  };
  location?: string;
  featured: boolean;
}

interface TestimonialRotatorProps {
  autoRotate?: boolean;
  showVideo?: boolean;
  variant?: 'default' | 'compact' | 'featured';
  roleFilter?: string[];
}

export const TestimonialRotator: React.FC<TestimonialRotatorProps> = ({
  autoRotate = true,
  showVideo = true,
  variant = 'default',
  roleFilter
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const testimonials: Testimonial[] = [
    {
      id: '1',
      name: 'Dr. Sarah Johnson',
      role: 'Physician',
      company: 'Heart & Vascular Institute',
      content: 'The healthcare-specific tax strategies alone saved me $50K this year. The malpractice insurance optimization was the cherry on top.',
      rating: 5,
      image: '/api/placeholder/64/64',
      metrics: { value: '$50K', label: 'Tax Savings' },
      location: 'San Francisco, CA',
      featured: true
    },
    {
      id: '2',
      name: 'Mark Williams',
      role: 'Financial Advisor',
      company: 'Williams Wealth Management',
      content: 'Since joining this platform, my client retention improved 40% and my AUM grew by $12M. The referral system is phenomenal.',
      rating: 5,
      videoUrl: '/api/placeholder/video',
      metrics: { value: '40%', label: 'Client Retention' },
      location: 'Austin, TX',
      featured: true
    },
    {
      id: '3',
      name: 'Jennifer Chen',
      role: 'CPA',
      company: 'Chen Tax & Advisory',
      content: 'The automated workflows cut my tax prep time in half while improving accuracy. My clients love the integrated portal.',
      rating: 5,
      image: '/api/placeholder/64/64',
      metrics: { value: '50%', label: 'Time Savings' },
      location: 'Seattle, WA',
      featured: false
    },
    {
      id: '4',
      name: 'Robert Martinez',
      role: 'Entrepreneur',
      company: 'Martinez Ventures',
      content: 'The business exit planning tools helped me structure a $20M sale with optimal tax efficiency. Incredible value.',
      rating: 5,
      metrics: { value: '$20M', label: 'Exit Value' },
      location: 'Miami, FL',
      featured: true
    },
    {
      id: '5',
      name: 'Lisa Thompson',
      role: 'Estate Attorney',
      company: 'Thompson Legal',
      content: 'The estate planning automation has revolutionized my practice. I can serve 3x more clients with better outcomes.',
      rating: 5,
      image: '/api/placeholder/64/64',
      metrics: { value: '3x', label: 'Client Capacity' },
      location: 'Boston, MA',
      featured: false
    }
  ];

  const filteredTestimonials = roleFilter?.length 
    ? testimonials.filter(t => roleFilter.includes(t.role.toLowerCase()))
    : testimonials;

  const currentTestimonial = filteredTestimonials[currentIndex];

  useEffect(() => {
    if (autoRotate && !isPlaying) {
      const interval = setInterval(() => {
        setCurrentIndex(prev => (prev + 1) % filteredTestimonials.length);
      }, 6000);
      return () => clearInterval(interval);
    }
  }, [autoRotate, isPlaying, filteredTestimonials.length]);

  const nextTestimonial = () => {
    setCurrentIndex(prev => (prev + 1) % filteredTestimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex(prev => 
      prev === 0 ? filteredTestimonials.length - 1 : prev - 1
    );
  };

  const renderStars = (rating: number) => (
    <div className="flex gap-1">
      {[...Array(5)].map((_, i) => (
        <Star 
          key={i} 
          className={`h-4 w-4 ${
            i < rating ? 'text-yellow-500 fill-current' : 'text-gray-300'
          }`} 
        />
      ))}
    </div>
  );

  if (variant === 'compact') {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold flex items-center gap-2">
            <Users className="h-4 w-4" />
            What Our Users Say
          </h3>
          <div className="flex gap-1">
            <Button variant="ghost" size="sm" onClick={prevTestimonial}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={nextTestimonial}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src={currentTestimonial.image} />
                <AvatarFallback>
                  {currentTestimonial.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <div className="font-medium text-sm">{currentTestimonial.name}</div>
                    <div className="text-xs text-muted-foreground">{currentTestimonial.role}</div>
                  </div>
                  {renderStars(currentTestimonial.rating)}
                </div>
                <p className="text-sm text-muted-foreground">
                  "{currentTestimonial.content}"
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (variant === 'featured') {
    return (
      <div className="relative">
        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <div className="grid md:grid-cols-2">
              {/* Content Side */}
              <div className="p-8 space-y-6">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">Success Story</Badge>
                  {currentTestimonial.featured && (
                    <Badge variant="outline">Featured</Badge>
                  )}
                </div>
                
                <Quote className="h-8 w-8 text-primary/20" />
                
                <blockquote className="text-xl leading-relaxed">
                  "{currentTestimonial.content}"
                </blockquote>
                
                {renderStars(currentTestimonial.rating)}
                
                <div className="flex items-center gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={currentTestimonial.image} />
                    <AvatarFallback>
                      {currentTestimonial.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-semibold">{currentTestimonial.name}</div>
                    <div className="text-muted-foreground">
                      {currentTestimonial.role}
                      {currentTestimonial.company && ` • ${currentTestimonial.company}`}
                    </div>
                    {currentTestimonial.location && (
                      <div className="text-sm text-muted-foreground">
                        {currentTestimonial.location}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Metrics/Video Side */}
              <div className="bg-primary/5 p-8 flex items-center justify-center">
                {currentTestimonial.videoUrl && showVideo ? (
                  <div className="relative cursor-pointer" onClick={() => setIsPlaying(true)}>
                    <div className="w-32 h-32 bg-primary/10 rounded-full flex items-center justify-center">
                      <Play className="h-12 w-12 text-primary ml-1" />
                    </div>
                    <div className="text-center mt-4">
                      <div className="font-semibold">Watch Story</div>
                      <div className="text-sm text-muted-foreground">2:30 video</div>
                    </div>
                  </div>
                ) : currentTestimonial.metrics ? (
                  <div className="text-center">
                    <div className="text-5xl font-bold text-primary mb-2">
                      {currentTestimonial.metrics.value}
                    </div>
                    <div className="text-lg text-muted-foreground">
                      {currentTestimonial.metrics.label}
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Navigation */}
        <div className="flex justify-between items-center mt-6">
          <div className="flex gap-2">
            {filteredTestimonials.map((_, index) => (
              <button
                key={index}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentIndex ? 'bg-primary' : 'bg-muted'
                }`}
                onClick={() => setCurrentIndex(index)}
              />
            ))}
          </div>
          
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={prevTestimonial}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={nextTestimonial}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Default variant
  return (
    <Card className="max-w-4xl mx-auto">
      <CardContent className="p-8">
        <div className="text-center space-y-6">
          {renderStars(currentTestimonial.rating)}
          
          <blockquote className="text-2xl leading-relaxed">
            "{currentTestimonial.content}"
          </blockquote>
          
          <div className="flex items-center justify-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={currentTestimonial.image} />
              <AvatarFallback>
                {currentTestimonial.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div className="text-left">
              <div className="font-semibold text-lg">{currentTestimonial.name}</div>
              <div className="text-muted-foreground">
                {currentTestimonial.role}
                {currentTestimonial.company && ` • ${currentTestimonial.company}`}
              </div>
              {currentTestimonial.location && (
                <div className="text-sm text-muted-foreground">
                  {currentTestimonial.location}
                </div>
              )}
            </div>
          </div>
          
          {currentTestimonial.metrics && (
            <div className="inline-block px-4 py-2 bg-primary/10 rounded-lg">
              <div className="text-2xl font-bold text-primary">
                {currentTestimonial.metrics.value}
              </div>
              <div className="text-sm text-muted-foreground">
                {currentTestimonial.metrics.label}
              </div>
            </div>
          )}
        </div>
        
        {/* Navigation Dots */}
        <div className="flex justify-center mt-8 gap-2">
          {filteredTestimonials.map((_, index) => (
            <button
              key={index}
              className={`w-3 h-3 rounded-full transition-colors ${
                index === currentIndex ? 'bg-primary' : 'bg-muted'
              }`}
              onClick={() => setCurrentIndex(index)}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};