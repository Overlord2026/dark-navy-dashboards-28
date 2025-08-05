import React from 'react';
import { VIPBadge, VIPStatusCard, getVIPStatus } from '@/components/badges/VIPBadgeSystem';
import { PersonaInviteTemplates } from '@/components/viral/PersonaInviteTemplates';
import { Button } from '@/components/ui/button';
import { UserPlus, Crown } from 'lucide-react';
import { PersonaType } from '@/types/personas';
import { motion } from 'framer-motion';

interface VIPDashboardHeaderProps {
  persona: PersonaType;
  userProfile: any;
  onInviteClick: () => void;
}

export const VIPDashboardHeader: React.FC<VIPDashboardHeaderProps> = ({
  persona,
  userProfile,
  onInviteClick
}) => {
  const vipStatus = getVIPStatus(persona, userProfile);
  const isVIP = vipStatus !== null;

  if (!isVIP) return null;

  return (
    <motion.div 
      className="mb-6 p-4 bg-gradient-to-r from-gold/10 to-primary/10 border border-gold/20 rounded-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Crown className="h-6 w-6 text-gold" />
          <div>
            <h3 className="font-semibold text-lg">VIP Member Dashboard</h3>
            <p className="text-sm text-muted-foreground">
              Welcome to your exclusive VIP experience
            </p>
          </div>
          <VIPBadge 
            type={vipStatus.tier === 'founding_member' ? 'founding_member' : 'early_adopter'} 
            size="md" 
            animated={true}
          />
        </div>
        <Button
          onClick={onInviteClick}
          variant="outline"
          className="border-gold/50 text-gold hover:bg-gold/10"
        >
          <UserPlus className="h-4 w-4 mr-2" />
          Invite VIPs
        </Button>
      </div>
    </motion.div>
  );
};