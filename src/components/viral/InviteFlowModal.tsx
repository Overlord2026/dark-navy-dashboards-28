import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { PersonaInviteTemplates } from '@/components/viral/PersonaInviteTemplates';
import { VIPBadge } from '@/components/badges/VIPBadgeSystem';
import { PersonaType } from '@/types/personas';
import { UserPlus, X } from 'lucide-react';

interface InviteFlowModalProps {
  isOpen: boolean;
  onClose: () => void;
  persona: PersonaType;
}

export const InviteFlowModal: React.FC<InviteFlowModalProps> = ({
  isOpen,
  onClose,
  persona
}) => {
  const handleInviteSent = (platform: string, count: number) => {
    console.log(`Invite sent via ${platform} to ${count} recipients`);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            Invite Colleagues
            <VIPBadge type="early_adopter" size="sm" animated={false} />
          </DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          <PersonaInviteTemplates 
            currentPersona={persona}
            onInviteSent={handleInviteSent}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};