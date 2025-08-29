import React from 'react';

interface VoiceMicButtonProps {
  onClick: () => void;
  children?: React.ReactNode;
}

export function VoiceMicButton({ onClick, children }: VoiceMicButtonProps) {
  return (
    <button className="inline-flex items-center gap-2 text-sm border rounded px-3 py-1.5" onClick={onClick}>
      🎤 {children || 'Talk to BFO'}
    </button>
  );
}