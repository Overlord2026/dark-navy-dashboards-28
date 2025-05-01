
import React from 'react';
import { SegmentCard } from './SegmentCard';
import { useNavigate } from 'react-router-dom';

interface SegmentCardsProps {
  segments: Array<{
    id: string;
    label: string;
    description: string;
    bulletPoints: string[];
    icon: React.ElementType;
    tagline: string;
    buttonText: string;
    benefits?: string[];
  }>;
  onSegmentClick: (segmentId: string) => void;
  isMobile: boolean;
}

export const SegmentCards: React.FC<SegmentCardsProps> = ({ segments, onSegmentClick, isMobile }) => {
  const navigate = useNavigate();

  const handleSegmentClick = (segmentId: string) => {
    // Navigate to auth page with segment parameter
    navigate(`/auth?segment=${segmentId}`);
  };

  return (
    <div className={`grid grid-cols-1 ${isMobile ? '' : 'md:grid-cols-3'} gap-6`}>
      {segments.map((segment) => (
        <SegmentCard
          key={segment.id}
          {...segment}
          onClick={handleSegmentClick}
          isMobile={isMobile}
        />
      ))}
    </div>
  );
};
