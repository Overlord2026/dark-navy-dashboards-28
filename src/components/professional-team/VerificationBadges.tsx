import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Shield, Award, Star, CheckCircle } from 'lucide-react';

interface VerificationBadgesProps {
  externalVerificationId?: string | null;
  externalReviewScore?: number | null;
  certifications?: string[];
}

export function VerificationBadges({ 
  externalVerificationId, 
  externalReviewScore, 
  certifications = [] 
}: VerificationBadgesProps) {
  const badges = [];

  // Verified badge
  if (externalVerificationId) {
    badges.push(
      <Badge key="verified" variant="default" className="flex items-center gap-1">
        <Shield className="h-3 w-3" />
        Verified
      </Badge>
    );
  }

  // CFP badge
  if (certifications.some(cert => cert.toLowerCase().includes('cfp'))) {
    badges.push(
      <Badge key="cfp" variant="secondary" className="flex items-center gap-1">
        <Award className="h-3 w-3" />
        CFP
      </Badge>
    );
  }

  // Top Rated badge (based on external review score)
  if (externalReviewScore && externalReviewScore >= 85) {
    badges.push(
      <Badge key="top-rated" variant="outline" className="flex items-center gap-1 border-yellow-500 text-yellow-700">
        <Star className="h-3 w-3" />
        Top Rated
      </Badge>
    );
  }

  // High Score badge
  if (externalReviewScore && externalReviewScore >= 90) {
    badges.push(
      <Badge key="excellence" variant="outline" className="flex items-center gap-1 border-green-500 text-green-700">
        <CheckCircle className="h-3 w-3" />
        Excellence
      </Badge>
    );
  }

  if (badges.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {badges}
    </div>
  );
}