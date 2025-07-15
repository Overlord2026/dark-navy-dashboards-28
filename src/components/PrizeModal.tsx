import React from "react";

interface PrizeModalProps {
  open: boolean;
  onClose: () => void;
  prizeText: string;
  analogy: string;
  icon?: React.ReactNode;
  primaryCta?: {
    label: string;
    onClick: () => void;
  };
  secondaryCta?: {
    label: string;
    onClick: () => void;
  };
}

export function PrizeModal({ 
  open, 
  onClose, 
  prizeText, 
  analogy, 
  icon,
  primaryCta,
  secondaryCta 
}: PrizeModalProps) {
  if (!open) return null;
  
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50 animate-fade-in">
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-8 rounded-2xl text-center shadow-2xl max-w-md border border-slate-700 animate-scale-in">
        {/* Trophy Icon */}
        {icon && (
          <div className="flex justify-center mb-6">
            {icon}
          </div>
        )}
        
        <h2 className="text-3xl font-bold mb-4 text-white">{prizeText}</h2>
        <p className="mb-4 text-lg text-slate-200">{analogy}</p>
        <p className="mb-6 text-slate-400 italic">
          Imagine what these savings could fund for your health or legacy!
        </p>
        
        {/* Primary CTA */}
        {primaryCta && (
          <button 
            onClick={primaryCta.onClick} 
            className="w-full mb-3 px-6 py-3 bg-gradient-to-r from-primary to-primary-glow text-white font-semibold rounded-lg hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-primary/25"
          >
            {primaryCta.label}
          </button>
        )}
        
        {/* Secondary CTA */}
        {secondaryCta && (
          <button 
            onClick={secondaryCta.onClick} 
            className="w-full mb-3 px-6 py-2 border border-slate-600 text-slate-300 rounded-lg hover:bg-slate-700 transition-all duration-200"
          >
            {secondaryCta.label}
          </button>
        )}
        
        <button 
          onClick={onClose} 
          className="w-full px-6 py-2 text-slate-400 hover:text-slate-300 transition-colors duration-200"
        >
          Close
        </button>
      </div>
    </div>
  );
}