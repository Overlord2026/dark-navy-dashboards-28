import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Shield, Star, Crown, CheckCircle } from 'lucide-react';
import { Professional } from '@/types/professional';

interface ProfessionalBadgesProps {
  professional: Professional;
}

export function ProfessionalBadges({ professional }: ProfessionalBadgesProps) {
  return (
    <div className="flex flex-wrap gap-1">
      {professional.external_verification_id && (
        <Badge variant="secondary" className="text-xs flex items-center gap-1">
          <Shield className="h-3 w-3" />
          Verified
        </Badge>
      )}
      
      {professional.external_verification_id?.includes('CFP') && (
        <Badge variant="outline" className="text-xs flex items-center gap-1 border-blue-500 text-blue-700">
          <CheckCircle className="h-3 w-3" />
          CFP
        </Badge>
      )}
      
      {professional.external_review_score && professional.external_review_score >= 4.5 && (
        <Badge variant="outline" className="text-xs flex items-center gap-1 border-yellow-500 text-yellow-700">
          <Star className="h-3 w-3" />
          Top Rated
        </Badge>
      )}
      
      {professional.featured && (
        <Badge variant="outline" className="text-xs flex items-center gap-1 border-purple-500 text-purple-700">
          <Crown className="h-3 w-3" />
          Featured
        </Badge>
      )}
      
      {professional.sponsored && (
        <Badge variant="outline" className="text-xs border-green-500 text-green-700">
          Sponsored
        </Badge>
      )}
    </div>
  );
}