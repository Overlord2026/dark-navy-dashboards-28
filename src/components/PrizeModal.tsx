import React from "react";

interface PrizeModalProps {
  open: boolean;
  onClose: () => void;
  prizeText: string;
  analogy: string;
}

export function PrizeModal({ open, onClose, prizeText, analogy }: PrizeModalProps) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/40">
      <div className="bg-slate-900 p-8 rounded-2xl shadow-lg text-center max-w-md">
        <h2 className="text-2xl font-bold mb-4">{prizeText}</h2>
        <p className="mb-4 text-lg">{analogy}</p>
        <button onClick={onClose} className="btn btn-primary mt-4">Close</button>
      </div>
    </div>
  );
}