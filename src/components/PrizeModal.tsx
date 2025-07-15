import React from "react";

interface PrizeModalProps {
  open: boolean;
  onClose: () => void;
  prizeText: string;
  analogy: string;
  cta?: {
    label: string;
    onClick: () => void;
  };
}

export function PrizeModal({ open, onClose, prizeText, analogy, cta }: PrizeModalProps) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50">
      <div className="bg-slate-900 p-8 rounded-2xl text-center shadow-2xl max-w-md">
        {/* Optionally add SVG: <img src="/img/trophy.svg" className="mx-auto mb-4 w-20" /> */}
        <h2 className="text-2xl font-bold mb-4">{prizeText}</h2>
        <p className="mb-4 text-lg">{analogy}</p>
        <p className="mb-4 text-slate-400">
          Imagine what these savings could fund for your health or legacy!
        </p>
        {cta && (
          <button onClick={cta.onClick} className="btn btn-primary w-full mb-2">
            {cta.label}
          </button>
        )}
        <button onClick={onClose} className="btn btn-secondary w-full">Close</button>
      </div>
    </div>
  );
}