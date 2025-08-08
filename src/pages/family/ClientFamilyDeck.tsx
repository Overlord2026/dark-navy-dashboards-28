import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight, Download, Share2, Calendar, Users } from 'lucide-react';
import { CoverSlideFamily } from '@/components/family-deck/CoverSlideFamily';
import { WhyFamilyCFOSlideFamily } from '@/components/family-deck/WhyFamilyCFOSlideFamily';
import { SwagRoadmapSlideFamily } from '@/components/family-deck/SwagRoadmapSlideFamily';
import { StressTestingSlideFamily } from '@/components/family-deck/StressTestingSlideFamily';
import { WealthPortalSlideFamily } from '@/components/family-deck/WealthPortalSlideFamily';
import { IncomeGapSlideFamily } from '@/components/family-deck/IncomeGapSlideFamily';
import { HealthWealthSlideFamily } from '@/components/family-deck/HealthWealthSlideFamily';
import { FamilyOfficeTeamSlide } from '@/components/family-deck/FamilyOfficeTeamSlide';
import { PrivacySecuritySlide } from '@/components/family-deck/PrivacySecuritySlide';
import { FirstStepSlideFamily } from '@/components/family-deck/FirstStepSlideFamily';

export default function ClientFamilyDeck() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [presentationMode, setPresentationMode] = useState(false);

  const slides = [
    { id: 0, title: 'Your Family\'s CFO', component: CoverSlideFamily },
    { id: 1, title: 'Why Every Family Needs a CFO', component: WhyFamilyCFOSlideFamily },
    { id: 2, title: 'The SWAG™ Retirement Roadmap', component: SwagRoadmapSlideFamily },
    { id: 3, title: 'Stress-Testing & Scenario Modeling', component: StressTestingSlideFamily },
    { id: 4, title: 'Your Custom Family Wealth Portal', component: WealthPortalSlideFamily },
    { id: 5, title: 'Income Gap & Longevity Planning', component: IncomeGapSlideFamily },
    { id: 6, title: 'Health & Wealth Integration', component: HealthWealthSlideFamily },
    { id: 7, title: 'Your Family Office Team', component: FamilyOfficeTeamSlide },
    { id: 8, title: 'Privacy & Security', component: PrivacySecuritySlide },
    { id: 9, title: 'Your First Step', component: FirstStepSlideFamily },
  ];

  const CurrentSlideComponent = slides[currentSlide].component;

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      {/* Navigation Header */}
      <div className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Users className="h-6 w-6 text-primary" />
              <h1 className="text-xl font-bold">Family CFO Presentation</h1>
              <Badge variant="secondary">{currentSlide + 1} / {slides.length}</Badge>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                variant={presentationMode ? "default" : "outline"}
                size="sm"
                onClick={() => setPresentationMode(!presentationMode)}
              >
                Present
              </Button>
              
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                PDF
              </Button>
              
              <Button variant="outline" size="sm">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
              
              <Button variant="default" size="sm">
                <Calendar className="h-4 w-4 mr-2" />
                Schedule Demo
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Slide Navigation */}
      {!presentationMode && (
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-center space-x-2 mb-6">
            {slides.map((slide, index) => (
              <Button
                key={slide.id}
                variant={currentSlide === index ? "default" : "outline"}
                size="sm"
                onClick={() => goToSlide(index)}
                className="min-w-[40px]"
              >
                {index + 1}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Main Slide Content */}
      <div className={`container mx-auto px-4 ${presentationMode ? 'py-0' : 'py-8'}`}>
        <Card className={`${presentationMode ? 'min-h-[80vh]' : ''} overflow-hidden`}>
          <CardContent className="p-0">
            <CurrentSlideComponent presentationMode={presentationMode} />
          </CardContent>
        </Card>
      </div>

      {/* Navigation Controls */}
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
        <div className="flex items-center space-x-4 bg-background/95 backdrop-blur-sm border rounded-full px-4 py-2 shadow-lg">
          <Button
            variant="outline"
            size="sm"
            onClick={prevSlide}
            disabled={currentSlide === 0}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          <span className="text-sm font-medium px-2">
            {slides[currentSlide].title}
          </span>
          
          <Button
            variant="outline"
            size="sm"
            onClick={nextSlide}
            disabled={currentSlide === slides.length - 1}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}