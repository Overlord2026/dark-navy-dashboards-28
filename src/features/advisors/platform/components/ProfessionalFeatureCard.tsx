/**
 * Professional Feature Card Component
 * Enterprise-grade feature showcase cards matching Advisor Platform design
 */

import React from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProfessionalFeatureCardProps {
  title: string;
  features: string[];
  icon: LucideIcon;
  className?: string;
}

export function ProfessionalFeatureCard({
  title,
  features,
  icon: Icon,
  className,
}: ProfessionalFeatureCardProps) {
  return (
    <div className={cn("bfo-card", className)}>
      <div className="flex items-center gap-3 mb-4">
        <div className="bfo-icon-container">
          <Icon className="w-5 h-5" />
        </div>
        <h3 className="text-white font-semibold text-lg">{title}</h3>
      </div>

      <ul className="space-y-3">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start gap-3 text-white/90">
            <span className="text-bfo-gold text-sm mt-0.5 flex-shrink-0">✓</span>
            <span className="text-sm leading-relaxed">{feature}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}