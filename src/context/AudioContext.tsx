import React, { createContext, useContext, useState } from 'react';

interface AudioContextType {
  isMuted: boolean;
  setIsMuted: (muted: boolean) => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isMuted, setIsMuted] = useState(false);

  return (
    <AudioContext.Provider value={{ isMuted, setIsMuted }}>
      {children}
    </AudioContext.Provider>
  );
};

export const useAudio = () => {
  const context = useContext(AudioContext);
  if (context === undefined) {
    return { isMuted: false, setIsMuted: () => {} };
  }
  return context;
};