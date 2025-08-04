import React from 'react';
import { motion } from 'framer-motion';
import { Crown, Star, Timer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ReservedProfile } from '@/types/reservedProfiles';
import { PERSONA_SEGMENT_CONFIGS, detectPersonaSegment } from '@/types/personaSegments';

interface VIPWelcomeBannerProps {
  profile: ReservedProfile;
  spotsLeft: number;
  onClaim: () => void;
  loading?: boolean;
}

export const VIPWelcomeBanner: React.FC<VIPWelcomeBannerProps> = ({
  profile,
  spotsLeft,
  onClaim,
  loading = false
}) => {
  const isUrgent = spotsLeft <= 5;
  const urgencyColor = isUrgent ? 'destructive' : 'default';
  
  // Get segment-specific configuration
  const segment = detectPersonaSegment(
    profile.persona_type as any, 
    profile.referral_source,
    { practice_area: profile.notes }
  );
  
  const segmentConfig = PERSONA_SEGMENT_CONFIGS[segment];

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full mb-8"
    >
      <Card className="relative overflow-hidden border-2 border-gold/20 bg-gradient-to-r from-background via-gold/5 to-background">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-gold"></div>
        
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-gold">
                <Crown className="w-6 h-6 text-gold-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">
                  Welcome, {profile.name}!
                </h1>
                <p className="text-muted-foreground">
                  {profile.organization && `${profile.role_title} at ${profile.organization}`}
                </p>
              </div>
            </div>
            
            <div className="flex flex-col items-end gap-2">
              <Badge variant={urgencyColor} className="flex items-center gap-1">
                <Timer className="w-3 h-3" />
                Only {spotsLeft} spots left for {profile.segment}
              </Badge>
              <Badge variant="secondary" className="flex items-center gap-1">
                <Star className="w-3 h-3" />
                VIP Reserved Profile
              </Badge>
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2 text-foreground">
              {segmentConfig.title}
            </h2>
            <p className="text-muted-foreground max-w-2xl">
              {segmentConfig.subtitle}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 items-start">
            <Button 
              size="lg" 
              className="bg-gradient-gold hover:bg-gradient-gold/90 text-gold-foreground font-semibold"
              onClick={onClaim}
              disabled={loading}
            >
              {loading ? 'Claiming...' : '🔗 Claim My Reserved Profile'}
            </Button>
            
            <div className="flex flex-wrap gap-2">
              {profile.custodian_partners?.map((custodian) => (
                <Badge key={custodian} variant="outline" className="text-xs">
                  {custodian.toUpperCase()}
                </Badge>
              ))}
            </div>
          </div>

          {profile.urgency_deadline && (
            <div className="mt-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
              <p className="text-sm text-destructive font-medium">
                ⏰ Limited time: Invitation expires {new Date(profile.urgency_deadline).toLocaleDateString()}
              </p>
            </div>
          )}
        </div>
      </Card>
    </motion.div>
  );
};