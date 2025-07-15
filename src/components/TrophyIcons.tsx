import React from 'react';

export const DiamondTrophy = ({ className = "w-20 h-20" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="diamondGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FFD700" />
        <stop offset="50%" stopColor="#FFA500" />
        <stop offset="100%" stopColor="#FF8C00" />
      </linearGradient>
      <filter id="glow">
        <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
        <feMerge> 
          <feMergeNode in="coloredBlur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
    </defs>
    {/* Trophy Base */}
    <rect x="45" y="90" width="30" height="20" fill="url(#diamondGradient)" rx="2" />
    {/* Trophy Stem */}
    <rect x="55" y="75" width="10" height="15" fill="url(#diamondGradient)" />
    {/* Trophy Cup */}
    <path d="M35 75 L85 75 L80 45 L40 45 Z" fill="url(#diamondGradient)" filter="url(#glow)" />
    {/* Diamond on top */}
    <polygon points="60,30 70,45 60,60 50,45" fill="#FFFFFF" stroke="url(#diamondGradient)" strokeWidth="2" filter="url(#glow)" />
    {/* Trophy Handles */}
    <path d="M35 60 Q25 60 25 50 Q25 40 35 40" stroke="url(#diamondGradient)" strokeWidth="3" fill="none" />
    <path d="M85 60 Q95 60 95 50 Q95 40 85 40" stroke="url(#diamondGradient)" strokeWidth="3" fill="none" />
  </svg>
);

export const GoldenTrophy = ({ className = "w-20 h-20" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FFD700" />
        <stop offset="100%" stopColor="#B8860B" />
      </linearGradient>
    </defs>
    {/* Trophy Base */}
    <rect x="45" y="90" width="30" height="20" fill="url(#goldGradient)" rx="2" />
    {/* Trophy Stem */}
    <rect x="55" y="75" width="10" height="15" fill="url(#goldGradient)" />
    {/* Trophy Cup */}
    <path d="M35 75 L85 75 L80 45 L40 45 Z" fill="url(#goldGradient)" />
    {/* Star on top */}
    <polygon points="60,25 63,35 73,35 65,42 68,52 60,45 52,52 55,42 47,35 57,35" fill="#FFFFFF" stroke="url(#goldGradient)" strokeWidth="1" />
    {/* Trophy Handles */}
    <path d="M35 60 Q25 60 25 50 Q25 40 35 40" stroke="url(#goldGradient)" strokeWidth="3" fill="none" />
    <path d="M85 60 Q95 60 95 50 Q95 40 85 40" stroke="url(#goldGradient)" strokeWidth="3" fill="none" />
  </svg>
);

export const SilverTrophy = ({ className = "w-20 h-20" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="silverGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#C0C0C0" />
        <stop offset="100%" stopColor="#808080" />
      </linearGradient>
    </defs>
    {/* Trophy Base */}
    <rect x="45" y="90" width="30" height="20" fill="url(#silverGradient)" rx="2" />
    {/* Trophy Stem */}
    <rect x="55" y="75" width="10" height="15" fill="url(#silverGradient)" />
    {/* Trophy Cup */}
    <path d="M35 75 L85 75 L80 45 L40 45 Z" fill="url(#silverGradient)" />
    {/* Champagne bubbles */}
    <circle cx="55" cy="35" r="3" fill="#FFFFFF" opacity="0.8" />
    <circle cx="65" cy="30" r="2" fill="#FFFFFF" opacity="0.6" />
    <circle cx="60" cy="40" r="1.5" fill="#FFFFFF" opacity="0.7" />
    {/* Trophy Handles */}
    <path d="M35 60 Q25 60 25 50 Q25 40 35 40" stroke="url(#silverGradient)" strokeWidth="3" fill="none" />
    <path d="M85 60 Q95 60 95 50 Q95 40 85 40" stroke="url(#silverGradient)" strokeWidth="3" fill="none" />
  </svg>
);

export const BronzeTrophy = ({ className = "w-20 h-20" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="bronzeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#CD7F32" />
        <stop offset="100%" stopColor="#8B4513" />
      </linearGradient>
    </defs>
    {/* Trophy Base */}
    <rect x="45" y="90" width="30" height="20" fill="url(#bronzeGradient)" rx="2" />
    {/* Trophy Stem */}
    <rect x="55" y="75" width="10" height="15" fill="url(#bronzeGradient)" />
    {/* Trophy Cup */}
    <path d="M35 75 L85 75 L80 45 L40 45 Z" fill="url(#bronzeGradient)" />
    {/* Dollar sign */}
    <text x="60" y="40" textAnchor="middle" fontSize="20" fontWeight="bold" fill="#FFFFFF">$</text>
    {/* Trophy Handles */}
    <path d="M35 60 Q25 60 25 50 Q25 40 35 40" stroke="url(#bronzeGradient)" strokeWidth="3" fill="none" />
    <path d="M85 60 Q95 60 95 50 Q95 40 85 40" stroke="url(#bronzeGradient)" strokeWidth="3" fill="none" />
  </svg>
);