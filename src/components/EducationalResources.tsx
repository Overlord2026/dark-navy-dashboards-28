import React, { useState, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ExternalLink, BookOpen, Mail, FileText } from 'lucide-react';
import { toast } from 'sonner';
import { EducationErrorBoundary } from '@/components/education/EducationErrorBoundary';
import { EducationalResourcesSkeleton } from '@/components/ui/skeletons/EducationSkeletons';
import { csvGuides, CSVGuide } from '@/data/csvGuides';

// Placeholder image for guides without cover images
const getPlaceholderImage = (title: string): string => {
  // Use different Unsplash images based on guide content
  if (title.toLowerCase().includes('retirement')) return 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=400&h=600&fit=crop';
  if (title.toLowerCase().includes('estate')) return 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=600&fit=crop';
  if (title.toLowerCase().includes('tax')) return 'https://images.unsplash.com/photo-1554224154-26032fced8bd?w=400&h=600&fit=crop';
  if (title.toLowerCase().includes('bitcoin') || title.toLowerCase().includes('blockchain')) return 'https://images.unsplash.com/photo-1518546305927-5a555bb7020d?w=400&h=600&fit=crop';
  if (title.toLowerCase().includes('physician') || title.toLowerCase().includes('doctor')) return 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=600&fit=crop';
  if (title.toLowerCase().includes('business')) return 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop';
  return 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=600&fit=crop'; // Default book image
};

export function EducationalResources() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle guide view
  const handleViewGuide = useCallback((guide: CSVGuide) => {
    if (guide.guideURL) {
      window.open(guide.guideURL, '_blank');
      toast.success(`Opening "${guide.title}"`);
    } else {
      toast.info('Guide will be available soon. Enter your email to be notified!');
    }
  }, []);

  // Handle email submission for guides without URLs
  const handleEmailSubmit = useCallback(async (guideTitle: string) => {
    if (!email) {
      toast.error('Please enter your email address to be notified');
      return;
    }

    setIsSubmitting(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success(`You'll be notified when "${guideTitle}" is available`);
      setEmail('');
    } catch (error) {
      toast.error('Failed to submit. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }, [email]);

  return (
    <EducationErrorBoundary componentName="Educational Resources">
      <div className="space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Educational Guides Library
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Browse our comprehensive collection of financial guides and resources
          </p>
        </div>

        {/* Email Input for notifications */}
        <EducationErrorBoundary componentName="Email Input">
          <div className="max-w-md mx-auto space-y-2">
            <Label htmlFor="email" className="text-foreground">Get Notified of New Guides</Label>
            <div className="flex gap-2">
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1"
              />
              <Button variant="outline" size="icon">
                <Mail className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </EducationErrorBoundary>

        {/* Bookshelf Layout */}
        <EducationErrorBoundary componentName="Guides Bookshelf">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
            {csvGuides.map((guide, index) => (
              <Card 
                key={index} 
                className="group overflow-hidden bg-card border-border hover:border-primary/30 transition-all duration-200 hover:shadow-lg hover:-translate-y-1"
              >
                {/* Book Cover */}
                <div className="aspect-[3/4] relative overflow-hidden">
                  <img
                    src={guide.coverImageURL || getPlaceholderImage(guide.title)}
                    alt={guide.title}
                    className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = getPlaceholderImage(guide.title);
                    }}
                  />
                  {/* Overlay for guides without URLs */}
                  {!guide.guideURL && (
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="text-white text-xs bg-black/50 px-2 py-1 rounded">
                        Coming Soon
                      </span>
                    </div>
                  )}
                </div>

                {/* Book Info */}
                <div className="p-3 space-y-2">
                  <h3 className="font-medium text-sm leading-tight text-foreground line-clamp-2 min-h-[2.5rem]">
                    {guide.title}
                  </h3>
                  
                  {guide.description && (
                    <p className="text-xs text-muted-foreground line-clamp-2 min-h-[2rem]">
                      {guide.description}
                    </p>
                  )}

                  {/* Action Button */}
                  <Button 
                    variant={guide.guideURL ? "default" : "outline"} 
                    size="sm"
                    className="w-full text-xs"
                    onClick={() => guide.guideURL ? handleViewGuide(guide) : handleEmailSubmit(guide.title)}
                    disabled={isSubmitting}
                  >
                    {guide.guideURL ? (
                      <>
                        <ExternalLink className="h-3 w-3 mr-1" />
                        View Guide
                      </>
                    ) : (
                      <>
                        <FileText className="h-3 w-3 mr-1" />
                        Notify Me
                      </>
                    )}
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </EducationErrorBoundary>

        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            More guides added regularly. Subscribe to stay updated.
          </p>
        </div>
      </div>
    </EducationErrorBoundary>
  );
}