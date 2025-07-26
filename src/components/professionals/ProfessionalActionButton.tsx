import React from 'react';
import { Button } from '@/components/ui/button';
import { Calendar, Mail } from 'lucide-react';
import { Professional } from '@/types/professional';

interface ProfessionalActionButtonProps {
  professional: Professional;
  onRequestIntro: () => void;
}

export function ProfessionalActionButton({ professional, onRequestIntro }: ProfessionalActionButtonProps) {
  if (professional.scheduling_url) {
    return (
      <Button 
        size="sm" 
        className="w-full flex items-center gap-2"
        onClick={() => window.open(professional.scheduling_url, '_blank')}
      >
        <Calendar className="h-4 w-4" />
        Book Call
      </Button>
    );
  }

  return (
    <Button 
      variant="outline" 
      size="sm" 
      className="w-full flex items-center gap-2"
      onClick={onRequestIntro}
    >
      <Mail className="h-4 w-4" />
      Request Intro
    </Button>
  );
}