
import React from 'react';
import { SegmentCard, SegmentCardProps } from './SegmentCard';

interface SegmentCardsProps {
  segments: Omit<SegmentCardProps, 'onClick' | 'isMobile'>[];
  onSegmentClick: (segmentId: string) => void;
  isMobile: boolean;
}

export const SegmentCards: React.FC<SegmentCardsProps> = ({ segments, onSegmentClick, isMobile }) => {
  return (
    <div 
      className={`landing-animated-bg ${isMobile ? '' : 'grid grid-cols-1 md:grid-cols-3 gap-8 px-4 mb-12 relative py-6'} ${isMobile ? 'mt-8 space-y-6' : ''}`}
    >
      {isMobile ? null : (
        <div className="absolute inset-0 overflow-hidden">
          <div className="particles-container"></div>
        </div>
      )}
      
      {segments.map((segment) => (
        <SegmentCard 
          key={segment.id}
          {...segment}
          onClick={onSegmentClick}
          isMobile={isMobile}
        />
      ))}
    </div>
  );
};
