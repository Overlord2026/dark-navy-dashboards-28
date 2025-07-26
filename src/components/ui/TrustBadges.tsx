import React from 'react';
import { Shield, Lock, UserCheck } from 'lucide-react';

interface TrustBadgesProps {
  showPrivacyText?: boolean;
  showEmailExplanation?: boolean;
  compact?: boolean;
}

export const TrustBadges: React.FC<TrustBadgesProps> = ({ 
  showPrivacyText = false, 
  showEmailExplanation = false,
  compact = false 
}) => {
  return (
    <div className={`space-y-3 ${compact ? 'text-xs' : 'text-sm'}`}>
      {showEmailExplanation && (
        <div className="flex items-center gap-2 text-muted-foreground">
          <UserCheck className="h-4 w-4 text-primary flex-shrink-0" />
          <span>We ask for your email to send your personalized Retirement Confidence Scorecard™ and roadmap details.</span>
        </div>
      )}
      
      {showPrivacyText && (
        <div className="flex items-center gap-2 text-muted-foreground">
          <Shield className="h-4 w-4 text-success flex-shrink-0" />
          <span>We respect your privacy and will never share your information.</span>
        </div>
      )}
      
      <div className="flex items-center gap-2 text-muted-foreground">
        <Lock className="h-4 w-4 text-primary flex-shrink-0" />
        <span>Your data is secure in our advertising-free environment.</span>
      </div>
    </div>
  );
};