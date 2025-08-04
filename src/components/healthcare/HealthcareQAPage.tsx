import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, AlertTriangle, Target } from 'lucide-react';
import { getLogoConfig } from '@/assets/logos';

export function HealthcareQAPage() {
  const treeLogoConfig = getLogoConfig('tree');

  const completedFixes = [
    'Responsive tab navigation with horizontal scroll on mobile',
    'BFO tree logo implementation with navy/gold branding',
    'Touch targets (44px+ minimum) for all interactive elements',
    'Working CTA buttons with functional modals',
    'Confetti celebrations for milestone events',
    'Persona-specific welcome banners',
    'Provider search and filtering functionality',
    'Breadcrumb navigation system',
    'Proper color contrast (navy/gold/emerald theme)',
    'Font improvements (serif for headings, display for CTAs)',
    'Loading states for persona switching',
    'Toast notifications for user feedback'
  ];

  const inProgress = [
    'Complete onboarding modal functionality',
    'Enhanced document management workflows',
    'Advanced search filters and sorting'
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-navy border-b">
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center gap-4 mb-4">
            <img 
              src={treeLogoConfig.src}
              alt={treeLogoConfig.alt}
              className="h-12 w-auto"
            />
            <h1 className="text-3xl font-serif font-bold text-white">
              Healthcare QA Review Summary
            </h1>
          </div>
          <p className="text-white/80">
            Implementation status of critical recommendations for the Healthcare & Longevity Center
          </p>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8 space-y-8">
        {/* Completed Fixes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-serif text-emerald">
              <CheckCircle className="h-6 w-6" />
              Completed Fixes ({completedFixes.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {completedFixes.map((fix, index) => (
                <div key={index} className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-emerald flex-shrink-0" />
                  <span className="text-sm">{fix}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* In Progress */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-serif text-gold">
              <AlertTriangle className="h-6 w-6" />
              In Progress ({inProgress.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {inProgress.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-gold flex-shrink-0" />
                  <span className="text-sm">{item}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Branding Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-serif">
              <Target className="h-6 w-6 text-navy" />
              Branding Implementation
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-navy rounded-lg">
                <div className="text-white font-serif">Navy Background</div>
                <div className="text-white/70 text-sm">#14213D</div>
              </div>
              <div className="text-center p-4 bg-gold rounded-lg">
                <div className="text-navy font-serif">Gold Accents</div>
                <div className="text-navy/70 text-sm">#FFD700</div>
              </div>
              <div className="text-center p-4 bg-emerald rounded-lg">
                <div className="text-white font-serif">Emerald Success</div>
                <div className="text-white/70 text-sm">#169873</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <img 
                src={treeLogoConfig.src}
                alt="BFO Tree Logo"
                className="h-8 w-auto"
              />
              <span className="font-serif">BFO Tree Logo implemented throughout</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}