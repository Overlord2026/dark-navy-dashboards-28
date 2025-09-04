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
    rate: 0.9,     // Slightly slower for professionalism
    pitch: 1.0,    // Neutral pitch
    volume: 0.8,   // Professional volume
  },
  'Attorneys': {
    rate: 0.8,     // Slower, more authoritative
    pitch: 0.9,    // Slightly lower pitch
    volume: 0.9,   // Clear and strong
  },
  'Insurance': {
    rate: 1.0,     // Normal pace
    pitch: 1.1,    // Slightly higher, friendly
    volume: 0.8,   // Reassuring tone
  },
  'Healthcare': {
    rate: 0.9,     // Calm and measured
    pitch: 1.0,    // Neutral
    volume: 0.7,   // Gentle volume
  },
  'Accountants': {
    rate: 1.0,     // Efficient pace
    pitch: 1.0,    // Professional
    volume: 0.8,   // Clear delivery
  },
  'NIL': {
    rate: 1.1,     // Energetic pace
    pitch: 1.2,    // Youthful, engaging
    volume: 0.9,   // Enthusiastic
  },
  'Family': {
    rate: 0.9,     // Warm and welcoming
    pitch: 1.1,    // Friendly tone
    volume: 0.8,   // Comfortable volume
  }
};

// Enhanced welcome message generator
function welcomeMessage(name: string, persona: keyof typeof personas): string {
  const personaConfig = personas[persona];
  const complianceBadge = personaConfig?.badge || '';
  
  const messages = {
    'Financial Advisors': `Welcome ${name}! Ready to track Reg BI compliance and manage your client portfolio? Your ${complianceBadge} dashboard is fully loaded with FINRA-compliant tools.`,
    
    'Attorneys': `Good day ${name}. Your ${complianceBadge} ethics hub is ready with conflict checking, trust reconciliation, and CLE tracking. Let's maintain the highest professional standards.`,
    
    'Insurance': `Hello ${name}! Your ${complianceBadge} vault is secure with NAIC-compliant record retention. All policy tracking and audit tools are ready for your 10-year retention requirements.`,
    
    'Healthcare': `Welcome ${name}. Your ${complianceBadge} center is prepared with HIPAA assessments, breach notifications, and staff training trackers. Patient privacy is our priority.`,
    
    'Accountants': `Hi ${name}! Your ${complianceBadge} suite is ready with AICPA compliance monitoring, tax workflows, and audit assistance. Let's streamline this tax season.`,
    
    'NIL': `What's up ${name}! Your ${complianceBadge} tracker is loaded with NCAA compliance checks, deal analysis, and revenue reporting. Time to make some game-changing moves!`,
    
    'Family': `Welcome to your family office, ${name}. Your ${complianceBadge} hub is ready with wealth optimization, portfolio tracking, and legacy planning tools. Let's build generational wealth together.`
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