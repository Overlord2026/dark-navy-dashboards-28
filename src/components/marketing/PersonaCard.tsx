import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, ExternalLink } from 'lucide-react';
import { LucideIcon } from 'lucide-react';
import { analytics } from '@/lib/analytics';

interface PersonaCardProps {
  id: string;
  title: string;
  icon: LucideIcon;
  benefits: string[];
  route: string;
  compact?: boolean;
}

export const PersonaCard: React.FC<PersonaCardProps> = ({
  id,
  title,
  icon: Icon,
  benefits,
  route,
  compact = false
}) => {
  const navigate = useNavigate();

  const handleExploreClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    analytics.track('persona_card_clicked', { persona: id });
    navigate(route);
  };

  const handlePricingClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    analytics.track('persona_card_clicked', { persona: id, action: 'pricing' });
    navigate('/pricing');
  };

  const handleCardView = () => {
    analytics.track('persona_card_viewed', { persona: id });
  };

  return (
    <Card
      className={`group relative bg-card/95 backdrop-blur-sm border-2 border-border hover:border-gold/30 rounded-xl ${
        compact ? 'p-3' : 'p-4'
      } shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 cursor-pointer touch-target`}
      onClick={handleExploreClick}
      onMouseEnter={handleCardView}
      role="link"
      tabIndex={0}
      aria-label={`Explore ${title} tools and features`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleExploreClick(e as any);
        }
      }}
    >
      {/* Hover gradient effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-gold/5 via-transparent to-emerald/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />

      <CardHeader className={`text-center ${compact ? 'pb-3' : 'pb-4'} relative z-10`}>
        {/* Icon */}
        <div className={`flex-shrink-0 ${compact ? 'w-10 h-10' : 'w-12 h-12'} bg-gradient-to-br from-gold to-gold/80 rounded-lg flex items-center justify-center shadow-lg mx-auto mb-3`}>
          <Icon className={`${compact ? 'w-5 h-5' : 'w-6 h-6'} text-navy`} />
        </div>
        
        {/* Title */}
        <h3 className={`font-serif ${compact ? 'text-base' : 'text-lg'} font-bold text-foreground leading-tight`}>
          {title}
        </h3>
      </CardHeader>

      <CardContent className={`${compact ? 'pt-0 pb-3' : 'pt-0 pb-4'} relative z-10`}>
        {/* Benefits */}
        <ul className={`space-y-2 ${compact ? 'mb-3' : 'mb-4'}`}>
          {benefits.slice(0, compact ? 2 : 3).map((benefit, index) => (
            <li key={index} className="flex items-start gap-2 text-xs text-muted-foreground">
              <div className="w-1.5 h-1.5 bg-emerald rounded-full mt-1.5 flex-shrink-0" />
              <span className="leading-relaxed">{benefit}</span>
            </li>
          ))}
        </ul>

        {/* Action Buttons */}
        <div className={`flex ${compact ? 'flex-col gap-2' : 'gap-2'}`}>
          <Button
            onClick={handleExploreClick}
            size={compact ? "sm" : "default"}
            className="flex-1 bg-gradient-to-r from-gold to-gold/90 text-navy font-bold hover:from-gold/90 hover:to-gold hover:shadow-lg transition-all duration-300 touch-target"
          >
            Explore Tools
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
          
          <Button
            onClick={handlePricingClick}
            variant="ghost"
            size={compact ? "sm" : "default"}
            className="text-emerald hover:text-emerald/80 hover:bg-emerald/10 transition-all duration-300"
          >
            <span className="text-xs">Pricing</span>
            <ExternalLink className="w-3 h-3 ml-1" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};