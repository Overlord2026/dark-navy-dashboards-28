
export type AudienceSegment = 'aspiring' | 'retiree' | 'uhnw';

export interface AudienceProfile {
  id: string;
  name: string;
  description: string;
  icon: string;
  segment: AudienceSegment;
  minimumNetWorth?: number;
  recommendedServices: string[];
  commonGoals: string[];
  primaryChallenges: string[];
  recommendedContent: RecommendedContent[];
}

export interface RecommendedContent {
  id: string;
  title: string;
  type: 'article' | 'video' | 'webinar' | 'tool' | 'service';
  description: string;
  link?: string;
}

export interface AudienceContext {
  currentSegment: AudienceSegment;
  setCurrentSegment: (segment: AudienceSegment) => void;
  audienceProfiles: Record<AudienceSegment, AudienceProfile>;
  currentProfile: AudienceProfile;
  isSegmentDetected: boolean;
}
