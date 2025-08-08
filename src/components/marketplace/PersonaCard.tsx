import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { TreePine, ArrowRight, ExternalLink } from 'lucide-react';
import { LucideIcon } from 'lucide-react';

interface PersonaCardProps {
  id: string;
  title: string;
  icon: LucideIcon;
  benefits: string[];
  route: string;
  learnMoreRoute: string;
  compact?: boolean;
}

export const PersonaCard: React.FC<PersonaCardProps> = ({
  title,
  icon: Icon,
  benefits,
  route,
  learnMoreRoute,
  compact = false
}) => {
  const navigate = useNavigate();

  return (
    <div
      className={`group relative bg-white/95 backdrop-blur-sm border-2 border-gold/20 rounded-xl ${
        compact ? 'p-4' : 'p-6'
      } shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 cursor-pointer overflow-hidden`}
      onClick={() => navigate(route)}
    >
      {/* Golden Tree Watermark */}
      <div className="absolute top-2 right-2 opacity-10 group-hover:opacity-20 transition-opacity duration-300">
        <TreePine className="w-8 h-8 text-gold" />
      </div>

      {/* Gradient Border Effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-gold/10 via-transparent to-emerald/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />

      {/* Content */}
      <div className="relative z-10">
        {/* Icon & Title */}
        <div className="flex items-center gap-3 mb-4">
          <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-gold to-gold/80 rounded-lg flex items-center justify-center shadow-lg">
            <Icon className="w-6 h-6 text-navy" />
          </div>
          <h4 className={`font-serif ${compact ? 'text-lg' : 'text-xl'} font-bold text-navy leading-tight`}>
            {title}
          </h4>
        </div>

        {/* Benefits List */}
        <ul className="space-y-2 mb-6">
          {benefits.map((benefit, index) => (
            <li key={index} className="flex items-start gap-2 text-sm text-navy/80">
              <div className="w-1.5 h-1.5 bg-emerald rounded-full mt-2 flex-shrink-0" />
              <span className="leading-relaxed">{benefit}</span>
            </li>
          ))}
        </ul>

        {/* Action Buttons */}
        <div className={`flex ${compact ? 'flex-col gap-2' : 'gap-3'}`}>
          <Button
            onClick={(e) => {
              e.stopPropagation();
              navigate(learnMoreRoute);
            }}
            variant="outline"
            size={compact ? "sm" : "default"}
            className="flex-1 border-emerald text-emerald hover:bg-emerald hover:text-white transition-all duration-300"
          >
            Learn More
            <ExternalLink className="w-4 h-4 ml-2" />
          </Button>
          
          <Button
            onClick={(e) => {
              e.stopPropagation();
              navigate(route);
            }}
            size={compact ? "sm" : "default"}
            className="flex-1 bg-gradient-to-r from-gold to-gold/90 text-navy font-bold hover:from-gold/90 hover:to-gold hover:shadow-lg transition-all duration-300"
          >
            Get Started
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>

      {/* Hover Effects */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-gold/5 to-emerald/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </div>
  );
};