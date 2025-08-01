import React from 'react';

interface AnimatedLogoProps {
  className?: string;
  autoPlay?: boolean;
  loop?: boolean;
  muted?: boolean;
  width?: number;
  height?: number;
}

export function AnimatedLogo({ 
  className = "", 
  autoPlay = true, 
  loop = true, 
  muted = true,
  width = 200,
  height = 60
}: AnimatedLogoProps) {
  return (
    <video
      className={`object-contain ${className}`}
      width={width}
      height={height}
      autoPlay={autoPlay}
      loop={loop}
      muted={muted}
      playsInline
      preload="auto"
    >
      <source src="/src/assets/boutique-family-office-logo.mp4" type="video/mp4" />
      {/* Fallback for browsers that don't support video */}
      <img 
        src="/src/assets/boutique-family-office-logo-static.png" 
        alt="Boutique Family Office" 
        className="object-contain"
        width={width}
        height={height}
      />
    </video>
  );
}