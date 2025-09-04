// src/utils/voiceAI.js
const personas = {
  'Financial Advisors': { color: '#6BA6FF', icon: '⚖️', badge: 'SEC Compliant' },
  'Accountants': { color: '#75E0C2', icon: '📊', badge: 'AICPA Member' },
  'Insurance': { color: '#D9534F', icon: '📋', badge: '10-Year Records' },
  'Attorneys': { color: '#2E7D32', icon: '⚖️', badge: 'Bar Certified' },
  'Realtors': { color: '#E57373', icon: '🏠', badge: 'NAR Licensed' },
  'Healthcare Providers': { color: '#4FC3F7', icon: '🩺', badge: 'HIPAA Compliant' },
  'Coaches/NIL': { color: '#26A69A', icon: '🏅', badge: 'NCAA Verified' },
  'Families': { color: '#D4AF37', icon: '👨‍👩‍👧', badge: 'Trusted Planning' },
};

export function playWelcome(name, persona) {
  const voiceConfigs = {
    'Financial Advisors': { rate: 1.0, pitch: 1.0, volume: 1.0 }, // Professional tone
    'Attorneys': { rate: 0.8, pitch: 0.9, volume: 1.0 }, // Authoritative
    'Coaches/NIL': { rate: 1.1, pitch: 1.2, volume: 1.0 }, // Energetic
    'Healthcare Providers': { rate: 0.9, pitch: 0.9, volume: 0.7 }, // Calm
    'Insurance': { rate: 0.9, pitch: 1.0, volume: 1.0 }, // Reassuring
    'Families': { rate: 1.0, pitch: 1.0, volume: 1.0 }, // Warm
    'Accountants': { rate: 1.0, pitch: 1.0, volume: 1.0 }, // Neutral
    'Realtors': { rate: 1.0, pitch: 1.0, volume: 1.0 }, // Friendly
  };

  const messages = {
    'Financial Advisors': `Hi ${name}, your SEC Compliant dashboard with FINRA tools is fully loaded.`,
    'Accountants': `Hi ${name}, let's streamline your IRS compliance with AICPA tools.`,
    'Insurance': `Hi ${name}, your 10-Year Records vault is secure with NAIC compliance.`,
    'Attorneys': `Hi ${name}, your Bar Certified ethics hub is ready with conflict checking.`,
    'Realtors': `Hi ${name}, let's track your NAR Licensed status and local updates.`,
    'Healthcare Providers': `Hi ${name}, let's secure your HIPAA Compliant patient data management system.`,
    'Coaches/NIL': `Hi ${name}, let's ensure your NCAA Verified NIL deals are compliant and profitable.`,
    'Families': `Hi ${name}, let's create your Trusted Planning dashboard with wealth optimization tools.`
  };

  const config = voiceConfigs[persona] || voiceConfigs['Families'];
  const message = messages[persona] || `Hi ${name}, your dashboard is ready.`;

  const utterance = new SpeechSynthesisUtterance(message);
  utterance.rate = config.rate;
  utterance.pitch = config.pitch;
  utterance.volume = config.volume;

  // Enhanced voice selection
  const voices = window.speechSynthesis.getVoices();
  const preferredVoice = voices.find(voice => 
    voice.lang.startsWith('en') && voice.name.includes('Natural')
  ) || voices.find(voice => voice.lang.startsWith('en'));
  
  if (preferredVoice) {
    utterance.voice = preferredVoice;
  }

  window.speechSynthesis.speak(utterance);
}

export function stopSpeech() {
  window.speechSynthesis.cancel();
}

export function isVoiceSupported() {
  return 'speechSynthesis' in window;
}

export { personas };