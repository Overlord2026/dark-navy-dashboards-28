import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight, Download, Share2, Play, Presentation, Settings } from 'lucide-react';
import { CoverSlide } from '@/components/advisor-deck/CoverSlide';
import { WhyFamilyCFOSlide } from '@/components/advisor-deck/WhyFamilyCFOSlide';
import { SwagPhasesSlide } from '@/components/advisor-deck/SwagPhasesSlide';
import { StressTestSlide } from '@/components/advisor-deck/StressTestSlide';
import { ScenarioModelingSlide } from '@/components/advisor-deck/ScenarioModelingSlide';
import { TaxPlanningSlide } from '@/components/advisor-deck/TaxPlanningSlide';
import { ClientPortalSlide } from '@/components/advisor-deck/ClientPortalSlide';
import { CaseStudySlide } from '@/components/advisor-deck/CaseStudySlide';
import { WhiteLabelSlide } from '@/components/advisor-deck/WhiteLabelSlide';
import { CallToActionSlide } from '@/components/advisor-deck/CallToActionSlide';

export default function AdvisorDeck() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [presentationMode, setPresentationMode] = useState(false);
  const [liveDemoMode, setLiveDemoMode] = useState(false);
  const [whiteLabelEnabled, setWhiteLabelEnabled] = useState(false);

  const slides = [
    { id: 0, title: 'Cover', component: CoverSlide },
    { id: 1, title: 'Why Every Family Needs a CFO', component: WhyFamilyCFOSlide },
    { id: 2, title: 'The Four SWAG™ Phases', component: SwagPhasesSlide },
    { id: 3, title: 'The Stress-Test Advantage', component: StressTestSlide },
    { id: 4, title: 'Scenario Modeling', component: ScenarioModelingSlide },
    { id: 5, title: 'Tax-Efficient Planning', component: TaxPlanningSlide },
    { id: 6, title: 'The Client Portal', component: ClientPortalSlide },
    { id: 7, title: 'Before & After Case Study', component: CaseStudySlide },
    { id: 8, title: 'White-Label Ready', component: WhiteLabelSlide },
    { id: 9, title: 'Call to Action', component: CallToActionSlide },
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
              <h1 className="text-xl font-bold">SWAG™ Advisor Deck</h1>
              <Badge variant="secondary">{currentSlide + 1} / {slides.length}</Badge>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                variant={presentationMode ? "default" : "outline"}
                size="sm"
                onClick={() => setPresentationMode(!presentationMode)}
              >
                <Presentation className="h-4 w-4 mr-2" />
                Present
              </Button>
              
              <Button
                variant={liveDemoMode ? "default" : "outline"}
                size="sm"
                onClick={() => setLiveDemoMode(!liveDemoMode)}
              >
                <Play className="h-4 w-4 mr-2" />
                Live Demo
              </Button>
              
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                PDF
              </Button>
              
              <Button variant="outline" size="sm">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => setWhiteLabelEnabled(!whiteLabelEnabled)}
              >
                <Settings className="h-4 w-4 mr-2" />
                Brand
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
            <CurrentSlideComponent 
              liveDemoMode={liveDemoMode}
              whiteLabelEnabled={whiteLabelEnabled}
              presentationMode={presentationMode}
            />
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