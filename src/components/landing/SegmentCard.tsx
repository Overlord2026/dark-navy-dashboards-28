
import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LucideIcon } from 'lucide-react';

export interface SegmentCardProps {
  id: string;
  label: string;
  description: string;
  bulletPoints: string[];
  icon: LucideIcon;
  tagline: string;
  buttonText: string;
  onClick: (segmentId: string) => void;
  isMobile: boolean;
}

export const SegmentCard: React.FC<SegmentCardProps> = ({
  id,
  label,
  description,
  bulletPoints,
  icon: Icon,
  tagline,
  buttonText,
  onClick,
  isMobile
}) => {
  return (
    <div
      key={id}
      className={`segment-card ${isMobile ? 'p-6' : 'p-8'} rounded-lg bg-black/20 hover:bg-black/30 border border-[#D4AF37]/30 cursor-pointer transition-all ${isMobile ? 'hover:shadow-md hover:-translate-y-1' : 'duration-300 hover:shadow-lg hover:-translate-y-1'} flex flex-col ${!isMobile ? 'relative z-10' : ''}`}
    >
      <div className="flex items-start justify-between mb-3">
        <Icon className="text-[#D4AF37] h-10 w-10" />
        <span className="text-xs font-medium bg-[#D4AF37]/20 text-[#D4AF37] px-2 py-1 rounded-full">
          {tagline}
        </span>
      </div>
      <h2 className={`${isMobile ? 'text-xl' : 'text-2xl'} font-semibold text-[#D4AF37] mb-2`}>{label}</h2>
      <p className={`${isMobile ? 'text-sm' : ''} text-gray-300 mb-${isMobile ? '3' : '4'}`}>{description}</p>
      
      {/* Bullet points */}
      <ul className={`${isMobile ? 'text-sm' : ''} text-gray-300 mb-${isMobile ? '4' : '6'} space-y-${isMobile ? '1.5' : '2'}`}>
        {bulletPoints.map((point, index) => (
          <li key={index} className="flex items-start">
            <span className="text-[#D4AF37] mr-1.5">•</span>
            <span>{point}</span>
          </li>
        ))}
      </ul>
      
      <Button 
        className="mt-auto w-full bg-transparent border border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37]/10 font-medium"
        onClick={() => onClick(id)}
      >
        {buttonText} <ArrowRight className="h-4 w-4 ml-1" />
      </Button>
    </div>
  );
};
