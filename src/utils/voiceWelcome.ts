/**
 * Enhanced Voice Welcome System
 * Integrates with PersonaCard system and adds professional voice features
 */

import { personas } from '@/components/ui/PersonaCard';

interface VoiceConfig {
  rate: number;
  pitch: number;
  volume: number;
  voice?: SpeechSynthesisVoice;
}

// Persona-specific voice configurations
const personaVoiceConfigs: Record<string, VoiceConfig> = {
  'Financial Advisors': {
    rate: 1.0,     // Professional tone
    pitch: 1.0,    // Neutral pitch
    volume: 1.0,   // Clear volume
  },
  'Attorneys': {
    rate: 0.8,     // Authoritative pace
    pitch: 0.9,    // Lower pitch for authority
    volume: 1.0,   // Strong presence
  },
  'Insurance': {
    rate: 0.9,     // Reassuring pace
    pitch: 1.0,    // Neutral
    volume: 1.0,   // Clear delivery
  },
  'Healthcare Providers': {
    rate: 0.9,     // Calm and measured
    pitch: 0.9,    // Gentle tone
    volume: 0.7,   // Softer volume
  },
  'Accountants': {
    rate: 1.0,     // Efficient pace
    pitch: 1.0,    // Professional
    volume: 1.0,   // Clear delivery
  },
  'Coaches/NIL': {
    rate: 1.1,     // Energetic pace
    pitch: 1.2,    // Youthful, engaging
    volume: 1.0,   // Enthusiastic
  },
  'Realtors': {
    rate: 1.0,     // Friendly pace
    pitch: 1.0,    // Warm tone
    volume: 1.0,   // Confident volume
  },
  'Families': {
    rate: 1.0,     // Warm and welcoming
    pitch: 1.0,    // Friendly tone
    volume: 1.0,   // Comfortable volume
  }
};

// Enhanced welcome message generator
function welcomeMessage(name: string, persona: keyof typeof personas): string {
  const personaConfig = personas[persona];
  const complianceBadge = personaConfig?.badge || '';
  
  const messages = {
    'Financial Advisors': `Hi ${name}, your ${complianceBadge} dashboard with FINRA tools is fully loaded.`,
    'Accountants': `Hi ${name}, let's streamline your IRS compliance with AICPA tools.`,
    'Insurance': `Hi ${name}, your ${complianceBadge} vault is secure with NAIC compliance.`,
    'Attorneys': `Hi ${name}, your ${complianceBadge} ethics hub is ready with conflict checking.`,
    'Realtors': `Hi ${name}, let's track your NAR Licensed status and local updates.`,
    'Healthcare Providers': `Hi ${name}, let's secure your HIPAA Compliant patient data.`,
    'Coaches/NIL': `Hi ${name}, let's ensure your NCAA Verified NIL deals are compliant.`,
    'Families': `Hi ${name}, let's create your trusted planning dashboard with wealth optimization tools.`
  };
  
  return messages[persona] || `Welcome ${name}! Your dashboard is ready.`;
}

// Enhanced playWelcome function with persona-specific voice
export function playWelcome(name: string, persona: keyof typeof personas) {
  const message = welcomeMessage(name, persona);
  const voiceConfig = personaVoiceConfigs[persona] || personaVoiceConfigs['Family'];
  
  const utterance = new SpeechSynthesisUtterance(message);
  utterance.rate = voiceConfig.rate;
  utterance.pitch = voiceConfig.pitch;
  utterance.volume = voiceConfig.volume;
  
  // Try to select the best voice
  const voices = window.speechSynthesis.getVoices();
  const preferredVoice = voices.find(voice => 
    voice.lang.startsWith('en') && 
    (voice.name.includes('Professional') || voice.name.includes('Natural'))
  ) || voices.find(voice => voice.lang.startsWith('en'));
  
  if (preferredVoice) {
    utterance.voice = preferredVoice;
  }
  
  // Add event listeners for better UX
  utterance.onstart = () => {
    console.log(`🎙️ Welcome message started for ${persona}: ${name}`);
  };
  
  utterance.onend = () => {
    console.log(`✅ Welcome message completed for ${name}`);
  };
  
  utterance.onerror = (event) => {
    console.error('❌ Speech synthesis error:', event);
  };
  
  window.speechSynthesis.speak(utterance);
}

// Voice controls for dashboard
export function stopAllSpeech() {
  window.speechSynthesis.cancel();
}

export function pauseSpeech() {
  window.speechSynthesis.pause();
}

export function resumeSpeech() {
  window.speechSynthesis.resume();
}

// Compliance announcement function
export function announceCompliance(persona: keyof typeof personas, alert: string) {
  const personaConfig = personas[persona];
  const voiceConfig = personaVoiceConfigs[persona] || personaVoiceConfigs['Family'];
  
  const message = `${personaConfig?.badge} Alert: ${alert}`;
  
  const utterance = new SpeechSynthesisUtterance(message);
  utterance.rate = voiceConfig.rate * 1.1; // Slightly faster for alerts
  utterance.pitch = voiceConfig.pitch * 0.9; // Lower pitch for importance
  utterance.volume = Math.min(voiceConfig.volume * 1.2, 1.0); // Louder for alerts
  
  window.speechSynthesis.speak(utterance);
}

// Check browser support
export function isVoiceSupported(): boolean {
  return 'speechSynthesis' in window;
}

// Get available voices
export function getAvailableVoices(): SpeechSynthesisVoice[] {
  return window.speechSynthesis.getVoices();
}

// Example usage with PersonaCard integration
export function initializeVoiceWelcome() {
  // Wait for voices to load
  if (window.speechSynthesis.getVoices().length === 0) {
    window.speechSynthesis.onvoiceschanged = () => {
      console.log('🎙️ Voice synthesis ready');
    };
  }
}