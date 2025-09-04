/**
 * Voice-Enhanced PersonaCard with Welcome Integration
 */

import React, { useState } from 'react';
import PersonaCard, { personas, PersonaType } from '@/components/ui/PersonaCard';
import { playWelcome, stopAllSpeech, announceCompliance, isVoiceSupported } from '@/utils/voiceWelcome';
import { Volume2, VolumeX, Mic } from 'lucide-react';

interface VoicePersonaCardProps {
  title: string;
  features?: string[];
  tagline?: string;
  persona?: keyof typeof personas;
  userName?: string;
  onCardClick?: () => void;
  complianceAlert?: string;
}

export function VoicePersonaCard({
  title,
  features = [],
  tagline = '',
  persona = 'Family',
  userName = 'User',
  onCardClick,
  complianceAlert
}: VoicePersonaCardProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(isVoiceSupported());

  const handleCardClick = () => {
    if (voiceEnabled && !isPlaying) {
      setIsPlaying(true);
      playWelcome(userName, persona);
      
      // Reset playing state after estimated speech duration
      const estimatedDuration = welcomeMessage(userName, persona).length * 50; // ~50ms per character
      setTimeout(() => setIsPlaying(false), estimatedDuration);
    }
    
    onCardClick?.();
  };

  const handleComplianceAlert = () => {
    if (complianceAlert && voiceEnabled) {
      announceCompliance(persona, complianceAlert);
    }
  };

  const toggleVoice = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isPlaying) {
      stopAllSpeech();
      setIsPlaying(false);
    }
    setVoiceEnabled(!voiceEnabled);
  };

  // Get persona config for styling
  const personaConfig = personas[persona];
  const cardColor = personaConfig?.color || '#D4AF37';

  return (
    <div className="relative">
      <PersonaCard
        title={title}
        features={features}
        tagline={tagline}
        persona={persona}
        actions={
          <div className="flex gap-2 mt-4">
            {/* Voice toggle button */}
            <button
              onClick={toggleVoice}
              className="flex items-center gap-2 px-3 py-2 rounded text-sm"
              style={{
                backgroundColor: voiceEnabled ? cardColor : '#666666',
                color: '#FFFFFF',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              {voiceEnabled ? (
                <>
                  <Volume2 className="h-4 w-4" />
                  {isPlaying ? 'Speaking...' : 'Voice On'}
                </>
              ) : (
                <>
                  <VolumeX className="h-4 w-4" />
                  Voice Off
                </>
              )}
            </button>

            {/* Compliance alert button */}
            {complianceAlert && (
              <button
                onClick={handleComplianceAlert}
                className="flex items-center gap-2 px-3 py-2 rounded text-sm bg-red-600 text-white"
                style={{ border: 'none', cursor: 'pointer' }}
              >
                <Mic className="h-4 w-4" />
                Alert
              </button>
            )}
          </div>
        }
      />
      
      {/* Click overlay for voice activation */}
      <div
        onClick={handleCardClick}
        className="absolute inset-0 cursor-pointer rounded-lg"
        style={{
          backgroundColor: 'transparent',
          border: voiceEnabled ? `2px dashed ${cardColor}40` : 'none'
        }}
        title={voiceEnabled ? `Click to hear ${persona} welcome message` : 'Voice disabled'}
      />
      
      {/* Voice indicator */}
      {voiceEnabled && (
        <div 
          className="absolute top-2 right-2 w-3 h-3 rounded-full"
          style={{
            backgroundColor: isPlaying ? '#00ff00' : cardColor,
            animation: isPlaying ? 'pulse 1s infinite' : 'none'
          }}
          title={isPlaying ? 'Speaking...' : 'Voice enabled - click to hear welcome'}
        />
      )}
    </div>
  );
}

// Helper function for message generation (exported for voice utility)
function welcomeMessage(name: string, persona: keyof typeof personas): string {
  const personaConfig = personas[persona];
  const complianceBadge = personaConfig?.badge || '';
  
  const messages = {
    'Financial Advisors': `Welcome ${name}! Ready to track Reg BI compliance and manage your client portfolio? Your ${complianceBadge} dashboard is fully loaded.`,
    'Attorneys': `Good day ${name}. Your ${complianceBadge} ethics hub is ready with conflict checking and CLE tracking.`,
    'Insurance': `Hello ${name}! Your ${complianceBadge} vault is secure with NAIC-compliant record retention.`,
    'Healthcare': `Welcome ${name}. Your ${complianceBadge} center is prepared with HIPAA assessments and training trackers.`,
    'Accountants': `Hi ${name}! Your ${complianceBadge} suite is ready with AICPA compliance and tax workflows.`,
    'NIL': `What's up ${name}! Your ${complianceBadge} tracker is loaded with NCAA compliance checks and deal analysis.`,
    'Family': `Welcome to your family office, ${name}. Your wealth optimization hub is ready.`
  };
  
  return messages[persona] || `Welcome ${name}! Your dashboard is ready.`;
}

// Example usage
export function VoicePersonaDemo() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      <VoicePersonaCard
        title="Reg BI Tracker"
        persona="Financial Advisors"
        userName="Alex"
        features={['Monitors advice fairness', 'Auto-logs interactions', 'Flags conflicts']}
        tagline="Stay compliant, save hours"
        complianceAlert="New FINRA guidance available"
      />
      
      <VoicePersonaCard
        title="10-Year Records Vault"
        persona="Insurance"
        userName="Sarah"
        features={['NAIC-compliant storage', 'Automated retention', 'Audit-ready exports']}
        tagline="Secure. Compliant. Accessible."
        complianceAlert="Policy renewal documentation required"
      />
      
      <VoicePersonaCard
        title="NIL Deal Tracker"
        persona="NIL"
        userName="Jordan"
        features={['NCAA compliance check', 'Deal structure analysis', 'Revenue reporting']}
        tagline="Game-changing compliance"
        complianceAlert="New NCAA ruling affects current deals"
      />
    </div>
  );
}