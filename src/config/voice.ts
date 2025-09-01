// Voice Assistant Configuration
export const VOICE_CONFIG = {
  VOICE_ENABLED: import.meta.env.VITE_VOICE_ENABLED !== 'false',
  VOICE_PER_PERSONA: {
    'family': true,
    'insurance': true,
    'advisor': true,
    'accountant': false,
    'attorney': false,
    'admin': false,
    'athlete': false
  },
  REDACTION_ENABLED: true,
  VAD_ENABLED: true,
  AUTO_SAVE_TRANSCRIPTS: true,
  MAX_SESSION_DURATION_MINUTES: 30,
  CHUNK_SIZE_MS: 100,
  SAMPLE_RATE: 24000
} as const;

export type VoicePersona = keyof typeof VOICE_CONFIG.VOICE_PER_PERSONA;

export interface VoiceContext {
  householdId?: string;
  claimId?: string;
  policyNumber?: string;
  advisorId?: string;
  sessionId?: string;
  persona: VoicePersona;
}

export const isVoiceEnabledForPersona = (persona: VoicePersona): boolean => {
  return VOICE_CONFIG.VOICE_ENABLED && VOICE_CONFIG.VOICE_PER_PERSONA[persona];
};