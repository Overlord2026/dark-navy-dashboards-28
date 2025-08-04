import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Heart, 
  Users, 
  Brain, 
  Award, 
  Shield, 
  Star,
  TrendingUp,
  Calendar,
  Briefcase,
  Target,
  Users2
} from 'lucide-react';
import { getLogoConfig } from '@/assets/logos';

type Persona = 'client' | 'family' | 'advisor' | 'consultant' | 'influencer' | 'agent';

interface PersonaWelcomeBannerProps {
  persona: Persona;
  onDismiss?: () => void;
  onCTAClick: (action: string) => void;
}

export function PersonaWelcomeBanner({ persona, onDismiss, onCTAClick }: PersonaWelcomeBannerProps) {
  const treeLogoConfig = getLogoConfig('tree');

  const getPersonaContent = (persona: Persona) => {
    switch (persona) {
      case 'consultant':
        return {
          title: 'Welcome, Healthcare Consultant!',
          message: 'Your professional profile is ready. Start connecting with families seeking trusted longevity guidance and grow your practice.',
          icon: Brain,
          gradient: 'from-emerald to-emerald/80',
          ctaButtons: [
            { label: 'Set My Consultation Rates', action: 'set-rates', variant: 'default' as const },
            { label: 'Upload Credentials', action: 'upload-credentials', variant: 'outline' as const },
            { label: 'Join Longevity Network', action: 'join-network', variant: 'ghost' as const }
          ]
        };
      
      case 'advisor':
        return {
          title: 'Welcome, Medical Director!',
          message: 'Transform family health outcomes through our integrated platform. Access client summaries and share evidence-based protocols.',
          icon: Users,
          gradient: 'from-navy to-navy/80',
          ctaButtons: [
            { label: 'Access Client Health Dashboard', action: 'client-dashboard', variant: 'default' as const },
            { label: 'Share Medical Protocols', action: 'share-protocols', variant: 'outline' as const },
            { label: 'Schedule Family Consultations', action: 'schedule-consultations', variant: 'ghost' as const }
          ]
        };
      
      case 'influencer':
        return {
          title: 'Welcome, Thought Leader!',
          message: 'Join elite health experts shaping family wellness. Your verified expertise reaches families worldwide through our platform.',
          icon: Award,
          gradient: 'from-gold to-gold/80',
          ctaButtons: [
            { label: 'Activate Verified Badge', action: 'activate-badge', variant: 'default' as const },
            { label: 'Schedule AMA Event', action: 'schedule-ama', variant: 'outline' as const },
            { label: 'Post Research Updates', action: 'post-research', variant: 'ghost' as const }
          ]
        };
      
      case 'agent':
        return {
          title: 'Welcome, Healthcare Agent!',
          message: 'Manage insurance renewals, receive qualified leads, and grow your healthcare practice through our trusted network.',
          icon: Shield,
          gradient: 'from-emerald to-emerald/80',
          ctaButtons: [
            { label: 'View Lead Pipeline', action: 'view-leads', variant: 'default' as const },
            { label: 'Manage Renewals', action: 'manage-renewals', variant: 'outline' as const },
            { label: 'Update Commission Rates', action: 'update-rates', variant: 'ghost' as const }
          ]
        };
      
      default:
        return {
          title: 'Welcome to Your Health Center!',
          message: 'Manage your family\'s health, connect with top providers, and access premium wellness resources.',
          icon: Heart,
          gradient: 'from-primary to-primary/80',
          ctaButtons: [
            { label: 'Complete Health Profile', action: 'complete-profile', variant: 'default' as const },
            { label: 'Find Providers', action: 'find-providers', variant: 'outline' as const },
            { label: 'Explore Resources', action: 'explore-resources', variant: 'ghost' as const }
          ]
        };
    }
  };

  const content = getPersonaContent(persona);
  const Icon = content.icon;

  return (
    <Alert className={`relative border-2 mb-6 bg-gradient-to-r ${content.gradient} text-white overflow-hidden`}>
      {/* Background watermark */}
      <div className="absolute top-4 right-4 opacity-20">
        <img 
          src={treeLogoConfig.src}
          alt=""
          className="h-12 w-auto"
        />
      </div>
      
      <div className="relative z-10">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            <Icon className="h-8 w-8 text-white" />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-lg font-serif font-bold text-white">
                {content.title}
              </h3>
              {['influencer', 'consultant'].includes(persona) && (
                <Badge className="bg-white/20 text-white border-white/30">
                  <Star className="h-3 w-3 mr-1" />
                  Professional
                </Badge>
              )}
            </div>
            
            <AlertDescription className="text-white/90 text-base mb-4">
              {content.message}
            </AlertDescription>
            
            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-2">
              {content.ctaButtons.map((cta, index) => (
                <Button
                  key={index}
                  variant={cta.variant}
                  size="sm"
                  onClick={() => onCTAClick(cta.action)}
                  className={`touch-target font-display ${
                    cta.variant === 'default' 
                      ? 'bg-white text-navy hover:bg-white/90' 
                      : cta.variant === 'outline'
                      ? 'border-white/50 text-white hover:bg-white/10'
                      : 'text-white/80 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {cta.label}
                </Button>
              ))}
            </div>
          </div>
          
          {onDismiss && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onDismiss}
              className="text-white hover:bg-white/10 flex-shrink-0"
            >
              ×
            </Button>
          )}
        </div>
      </div>
    </Alert>
  );
}