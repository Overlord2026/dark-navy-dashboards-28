import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Users, Heart, BookOpen, ArrowRight, DollarSign, Shield } from 'lucide-react';
import { usePersona } from '@/hooks/usePersona';

export const MarketplaceHighlights = () => {
  const [currentCard, setCurrentCard] = useState(0);
  const { personaConfig } = usePersona();

  const getPersonalizedHighlights = () => {
    const allHighlights = {
      'Private Investments': {
        title: 'Private Investments',
        description: 'Exclusive opportunities for qualified investors',
        icon: DollarSign,
        color: 'from-amber-500 to-amber-600',
        action: 'View Opportunities'
      },
      'Estate Planning': {
        title: 'Estate Planning Services',
        description: 'Comprehensive legacy and succession planning',
        icon: Shield,
        color: 'from-blue-500 to-blue-600',
        action: 'Schedule Consultation'
      },
      'Retirement Planning': {
        title: 'Retirement Planning',
        description: 'Comprehensive retirement income strategies',
        icon: BookOpen,
        color: 'from-green-500 to-green-600',
        action: 'Start Planning'
      },
      'Annuities & Insurance': {
        title: 'Annuities & Insurance',
        description: 'Income protection and guaranteed returns',
        icon: Shield,
        color: 'from-purple-500 to-purple-600',
        action: 'Compare Options'
      },
      'Personal Finance 101': {
        title: 'Personal Finance 101',
        description: 'Start your financial journey with confidence',
        icon: BookOpen,
        color: 'from-emerald-500 to-emerald-600',
        action: 'Begin Learning'
      },
      'Family Coordination': {
        title: 'Family Coordination Tools',
        description: 'Manage your entire family\'s wealth together',
        icon: Users,
        color: 'from-indigo-500 to-indigo-600',
        action: 'Setup Family Access'
      },
      'Health & Wellness': {
        title: 'Health & Wellness',
        description: 'Holistic wealth and wellbeing services',
        icon: Heart,
        color: 'from-pink-500 to-pink-600',
        action: 'Explore Programs'
      },
      'Professional Services': {
        title: 'Professional Network',
        description: 'Connect with vetted advisors and specialists',
        icon: Users,
        color: 'from-teal-500 to-teal-600',
        action: 'Find Professionals'
      }
    };

    return personaConfig.marketplaceOrder.slice(0, 3).map(key => allHighlights[key]).filter(Boolean);
  };

  const highlights = getPersonalizedHighlights();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentCard((prev) => (prev + 1) % highlights.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [highlights.length]);

  const nextCard = () => {
    setCurrentCard((prev) => (prev + 1) % highlights.length);
  };

  const prevCard = () => {
    setCurrentCard((prev) => (prev - 1 + highlights.length) % highlights.length);
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Marketplace Highlights</h3>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={prevCard}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={nextCard}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          {highlights.map((highlight, index) => {
            const Icon = highlight.icon;
            const isActive = index === currentCard;
            
            return (
              <Card 
                key={index}
                className={`transition-all duration-300 ${
                  isActive ? 'ring-2 ring-primary scale-105' : 'opacity-75'
                }`}
              >
                <CardContent className="p-4">
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${highlight.color} flex items-center justify-center mb-3`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <h4 className="font-semibold mb-2">{highlight.title}</h4>
                  <p className="text-sm text-muted-foreground mb-3">{highlight.description}</p>
                  <Button variant="outline" size="sm" className="w-full">
                    {highlight.action}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="flex justify-center">
          <Button className="gap-2">
            View Marketplace
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};