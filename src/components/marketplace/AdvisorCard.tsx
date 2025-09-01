import React from 'react';
import { MapPin, MessageCircle, Mic } from 'lucide-react';
import { GoldButton, GoldOutlineButton } from '@/components/ui/brandButtons';

type Advisor = {
  id: string;
  name: string;
  title?: string | null;
  city?: string | null;
  tags?: string[] | null;
  avatar_url?: string | null;
};

type AdvisorCardProps = {
  advisor: Advisor;
  onContact: () => void;
  onVoice?: () => void;
  showVoice?: boolean;
};

export function AdvisorCard({ advisor, onContact, onVoice, showVoice = false }: AdvisorCardProps) {
  return (
    <div className="bfo-card border border-bfo-gold bg-bfo-black text-white p-4 hover:shadow-lg transition-all duration-200 hover:border-bfo-gold/80">
      {/* Header with Avatar & Info */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 rounded-full overflow-hidden border border-bfo-gold/50">
          {advisor.avatar_url ? (
            <img 
              src={advisor.avatar_url} 
              alt={advisor.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-bfo-purple flex items-center justify-center text-sm font-medium">
              {advisor.name.split(' ').map(n => n[0]).join('')}
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-white truncate">{advisor.name}</h3>
          <p className="text-sm text-white/70 truncate">{advisor.title || 'Financial Advisor'}</p>
          {advisor.city && (
            <div className="flex items-center gap-1 text-xs text-white/60 mt-1">
              <MapPin className="h-3 w-3" />
              <span>{advisor.city}</span>
            </div>
          )}
        </div>
      </div>

      {/* Tags */}
      {advisor.tags && advisor.tags.length > 0 && (
        <div className="mb-4">
          <div className="flex flex-wrap gap-1">
            {advisor.tags.slice(0, 4).map((tag, i) => (
              <span 
                key={i} 
                className="px-2 py-0.5 text-xs border border-bfo-gold text-bfo-gold rounded-full"
              >
                {tag}
              </span>
            ))}
            {advisor.tags.length > 4 && (
              <span className="px-2 py-0.5 text-xs text-white/50">
                +{advisor.tags.length - 4} more
              </span>
            )}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-2">
        <GoldButton 
          onClick={onContact}
          className="flex-1 text-sm py-2 flex items-center justify-center gap-1"
        >
          <MessageCircle className="h-3 w-3" />
          Contact
        </GoldButton>
        
        {showVoice && onVoice && (
          <GoldOutlineButton 
            onClick={onVoice}
            className="px-3 py-2 flex items-center justify-center"
            title="Ask with Voice"
          >
            <Mic className="h-3 w-3" />
          </GoldOutlineButton>
        )}
      </div>
    </div>
  );
}