import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, Download, Star, Quote } from 'lucide-react';

const testimonials = [
  {
    quote: "Our family's future is secure with BFO's Private Market Alpha access.",
    author: "Sarah Chen",
    title: "Family Office Principal",
    rating: 5
  },
  {
    quote: "The due diligence and partner vetting saved us months of research.",
    author: "Michael Torres",
    title: "Investment Committee Chair", 
    rating: 5
  },
  {
    quote: "Access to opportunities we never knew existed. Game changing.",
    author: "Jennifer Walsh",
    title: "Multi-Family Office CIO",
    rating: 5
  }
];

export const PrivateMarketHero = () => {
  const [currentTestimonial, setCurrentTestimonial] = React.useState(0);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const handleDownloadGuide = () => {
    // Track analytics
    console.log('Private Market Alpha Guide download requested');
  };

  const handleWatchVideo = () => {
    // Track analytics
    console.log('Private Market Alpha video play requested');
  };

  const handleSpeakToAdvisor = () => {
    // Track analytics
    console.log('Speak to Fiduciary Advisor requested');
  };

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-primary via-primary/95 to-primary/90 text-primary-foreground">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-gold-premium/5 to-transparent opacity-30" />
      
      <div className="relative max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Content */}
          <div className="space-y-8">
            <div>
              <Badge className="mb-4 bg-gold-premium text-primary font-semibold">
                Exclusive Access
              </Badge>
              <h1 className="text-4xl lg:text-5xl font-bold leading-tight mb-6">
                Private Market Alpha
              </h1>
              <p className="text-xl text-primary-foreground/90 leading-relaxed">
                Discover how families are investing beyond Wall Street. Access curated 
                private equity, real estate, and alternative investments typically reserved for institutions.
              </p>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                className="bg-gold-premium text-primary hover:bg-gold-dark font-semibold"
                onClick={handleDownloadGuide}
              >
                <Download className="w-5 h-5 mr-2" />
                Download Guide
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white/30 text-white hover:bg-white/10"
                onClick={handleSpeakToAdvisor}
              >
                Speak to a Fiduciary Advisor
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-white/20">
              <div className="text-center">
                <div className="text-2xl font-bold text-gold-premium">150+</div>
                <div className="text-sm text-primary-foreground/80">Vetted Partners</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gold-premium">$2.3B+</div>
                <div className="text-sm text-primary-foreground/80">Assets Placed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gold-premium">98%</div>
                <div className="text-sm text-primary-foreground/80">Client Satisfaction</div>
              </div>
            </div>
          </div>

          {/* Right Column - Guide Cover & Video */}
          <div className="space-y-6">
            {/* Guide Cover Mockup */}
            <Card className="relative group cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-2xl">
              <div className="aspect-[3/4] bg-gradient-to-br from-gold-premium via-gold-dark to-primary rounded-lg p-8 flex flex-col justify-between">
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 mx-auto bg-white/20 rounded-full flex items-center justify-center">
                    <Star className="w-8 h-8 text-gold-light" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">Private Market Alpha</h3>
                    <p className="text-white/80 text-sm">The Complete Guide to Alternative Investments</p>
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-white/60 text-xs mb-3">Family Office Marketplace</p>
                  <Button 
                    size="sm" 
                    className="bg-white/20 text-white hover:bg-white/30"
                    onClick={handleDownloadGuide}
                  >
                    Download PDF
                  </Button>
                </div>
              </div>
            </Card>

            {/* Video Preview */}
            <Card className="relative group cursor-pointer" onClick={handleWatchVideo}>
              <div className="aspect-video bg-gradient-to-br from-primary/20 to-primary/40 rounded-lg flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-black/20" />
                <Button 
                  size="lg" 
                  className="relative z-10 bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm"
                >
                  <Play className="w-6 h-6 mr-2" />
                  Watch Introduction
                </Button>
              </div>
            </Card>
          </div>
        </div>

        {/* Testimonial Carousel */}
        <div className="mt-16 pt-12 border-t border-white/20">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h3 className="text-xl font-semibold mb-2">What Families Are Saying</h3>
            </div>
            
            <Card className="relative bg-white/10 backdrop-blur-sm border-white/20 p-8">
              <div className="text-center space-y-4">
                <Quote className="w-8 h-8 text-gold-premium mx-auto" />
                <blockquote className="text-lg italic text-primary-foreground/90">
                  "{testimonials[currentTestimonial].quote}"
                </blockquote>
                <div className="space-y-2">
                  <div className="flex justify-center space-x-1">
                    {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-gold-premium text-gold-premium" />
                    ))}
                  </div>
                  <div>
                    <div className="font-semibold">{testimonials[currentTestimonial].author}</div>
                    <div className="text-sm text-primary-foreground/70">
                      {testimonials[currentTestimonial].title}
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Carousel Indicators */}
            <div className="flex justify-center space-x-2 mt-6">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === currentTestimonial 
                      ? 'bg-gold-premium w-6' 
                      : 'bg-white/40 hover:bg-white/60'
                  }`}
                  onClick={() => setCurrentTestimonial(index)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};