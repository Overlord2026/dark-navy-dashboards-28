import { Howl } from "howler";

export const sounds = {
  cash: new Howl({ 
    src: ["/sounds/cash-register.mp3"],
    volume: 0.3,
    preload: true
  }),
  champagne: new Howl({ 
    src: ["/sounds/champagne-pop.mp3"],
    volume: 0.4,
    preload: true
  }),
  fanfare: new Howl({ 
    src: ["/sounds/fanfare.mp3"],
    volume: 0.5,
    preload: true
  }),
  fireworks: new Howl({ 
    src: ["/sounds/fireworks.mp3"],
    volume: 0.6,
    preload: true
  }),
};

export const playSound = (soundKey: keyof typeof sounds) => {
  try {
    sounds[soundKey].play();
  } catch (error) {
    console.log('Audio playback failed:', error);
  }
};