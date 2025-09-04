/**
 * Linda's Voice Configuration
 * Optimized for warm, welcoming family onboarding
 */

interface LindaVoiceConfig {
  rate: number;
  pitch: number;
  volume: number;
  voiceName?: string;
}

const LINDA_CONFIG: LindaVoiceConfig = {
  rate: 1.0,    // Natural speaking pace
  pitch: 1.1,   // Slightly higher for warmth
  volume: 0.8,  // Clear but not overwhelming
};

export function getLindaVoice(): SpeechSynthesisVoice | null {
  const voices = window.speechSynthesis.getVoices();
  
  // Priority order for Linda's voice selection
  const voicePriority = [
    // Microsoft Neural voices (if available)
    (v: SpeechSynthesisVoice) => v.name.includes('Aria') && v.lang.startsWith('en-US'),
    (v: SpeechSynthesisVoice) => v.name.includes('Neural') && v.lang.startsWith('en'),
    // High-quality natural voices
    (v: SpeechSynthesisVoice) => v.name.includes('Natural') && v.lang.startsWith('en'),
    (v: SpeechSynthesisVoice) => v.name.includes('Premium') && v.lang.startsWith('en'),
    // Known good female voices
    (v: SpeechSynthesisVoice) => v.name.includes('Samantha'),
    (v: SpeechSynthesisVoice) => v.name.includes('Victoria'),
    (v: SpeechSynthesisVoice) => v.name.includes('Female') && v.lang.startsWith('en'),
    // Fallback to any English voice
    (v: SpeechSynthesisVoice) => v.lang.startsWith('en-US'),
    (v: SpeechSynthesisVoice) => v.lang.startsWith('en'),
  ];

  for (const selector of voicePriority) {
    const voice = voices.find(selector);
    if (voice) {
      console.log(`🎙️ Linda voice selected: ${voice.name} (${voice.lang})`);
      return voice;
    }
  }

  console.warn('⚠️ No suitable voice found for Linda, using default');
  return null;
}

export function playLindaWelcome(message: string = "Hi, I'm Linda. Let's get started in 60 seconds - your secure family hub awaits."): Promise<void> {
  return new Promise((resolve, reject) => {
    if (!('speechSynthesis' in window)) {
      reject(new Error('Speech synthesis not supported'));
      return;
    }

    const utterance = new SpeechSynthesisUtterance(message);
    
    // Apply Linda's voice configuration
    utterance.rate = LINDA_CONFIG.rate;
    utterance.pitch = LINDA_CONFIG.pitch;
    utterance.volume = LINDA_CONFIG.volume;
    
    // Set Linda's voice
    const lindaVoice = getLindaVoice();
    if (lindaVoice) {
      utterance.voice = lindaVoice;
    }
    
    // Event handlers
    utterance.onstart = () => {
      console.log('👋 Linda: Welcome message started');
    };
    
    utterance.onend = () => {
      console.log('✅ Linda: Welcome message completed');
      resolve();
    };
    
    utterance.onerror = (event) => {
      console.error('❌ Linda voice error:', event);
      reject(new Error(`Speech synthesis error: ${event.error}`));
    };
    
    // Speak Linda's message
    window.speechSynthesis.speak(utterance);
  });
}

export function testLindaVoice(): void {
  console.log('🧪 Testing Linda\'s voice...');
  
  // Wait for voices to load
  if (window.speechSynthesis.getVoices().length === 0) {
    window.speechSynthesis.onvoiceschanged = () => {
      testLindaVoice();
    };
    return;
  }
  
  const voices = window.speechSynthesis.getVoices();
  console.log('Available voices:', voices.map(v => `${v.name} (${v.lang})`));
  
  const lindaVoice = getLindaVoice();
  if (lindaVoice) {
    console.log('✅ Linda voice test: Using', lindaVoice.name);
    playLindaWelcome("Hello! This is Linda testing her voice. How do I sound?")
      .then(() => console.log('✅ Linda voice test completed'))
      .catch(err => console.error('❌ Linda voice test failed:', err));
  } else {
    console.error('❌ Linda voice test failed: No suitable voice found');
  }
}

// Auto-test when voices are ready
if (typeof window !== 'undefined') {
  if (window.speechSynthesis.getVoices().length > 0) {
    // Voices already loaded
    console.log('🎙️ Linda voice system ready');
  } else {
    // Wait for voices to load
    window.speechSynthesis.onvoiceschanged = () => {
      console.log('🎙️ Linda voice system ready');
    };
  }
}