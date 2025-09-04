// Global voice settings - permanently disabled Linda
export const VOICE_SETTINGS = {
  LINDA_ENABLED: false, // Permanently disabled for dev environment
  AUTOPLAY_ENABLED: false,
  GREETINGS_ENABLED: false,
  SOUND_ENABLED: false,
  SHOW_MUTE_TOGGLE: true, // Keep visible but inactive
  MUTE_TOGGLE_ACTIVE: false // Toggle will be visible but disabled
} as const;

// Mock voice functions that do nothing
export const playWelcome = (userName: string, persona: string) => {
  // Silently do nothing - Linda is disabled
  console.log(`[Voice Disabled] Would have played welcome for ${userName} in ${persona} persona`);
};

export const playSound = (soundType: string) => {
  // Silently do nothing - sounds are disabled
  console.log(`[Sound Disabled] Would have played sound: ${soundType}`);
};

export const playGreeting = (message: string) => {
  // Silently do nothing - greetings are disabled
  console.log(`[Greeting Disabled] Would have played: ${message}`);
};

export const isVoiceEnabled = () => false;
export const isSoundEnabled = () => false;
export const isGreetingEnabled = () => false;

// Keep mute toggle visible but inactive
export const shouldShowMuteToggle = () => VOICE_SETTINGS.SHOW_MUTE_TOGGLE;
export const isMuteToggleActive = () => VOICE_SETTINGS.MUTE_TOGGLE_ACTIVE;
