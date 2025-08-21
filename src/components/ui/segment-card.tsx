import React from 'react';
import { Button } from './button';

export type Segment = 'retiree' | 'aspiring' | 'advisor' | 'cpa' | 'attorney' | 'provider';

const segColors: Record<Segment, { band: string; bg: string; text: string }> = {
  retiree: { band: 'bg-gold-base', bg: 'bg-sand', text: 'text-ink' },
  aspiring: { band: 'bg-sky', bg: 'bg-slate', text: 'text-white' },
  advisor: { band: 'bg-mint', bg: 'bg-navy', text: 'text-white' },
  cpa: { band: 'bg-mint', bg: 'bg-slate', text: 'text-white' },
  attorney: { band: 'bg-burgundy', bg: 'bg-burgundy', text: 'text-white' },
  provider: { band: 'bg-indigo', bg: 'bg-indigo', text: 'text-white' },
};

interface SegmentCardProps {
  segment: Segment;
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  onOpen?: () => void;
  buttonText?: string;
}

export function SegmentCard({ 
  segment, 
  title, 
  subtitle, 
  icon, 
  onOpen,
  buttonText = "Open"
}: SegmentCardProps) {
  const c = segColors[segment];
  
  return (
    <div className={`rounded-2xl shadow-soft overflow-hidden ${c.bg}`}>
      <div className={`${c.band} h-1.5`} />
      <div className="p-4 flex items-start gap-3">
        {icon && (
          <div className="text-gold-hi flex-shrink-0">
            {icon}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <h3 className={`font-semibold ${c.text}`}>{title}</h3>
          {subtitle && (
            <p className={`${c.text} opacity-80 text-sm mt-1`}>{subtitle}</p>
          )}
        </div>
        <div className="flex-shrink-0">
          <Button 
            variant="gold" 
            size="sm"
            onClick={onOpen}
            className="text-xs"
          >
            <span>{buttonText}</span>
          </Button>
        </div>
      </div>
    </div>
  );
}