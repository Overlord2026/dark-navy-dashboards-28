import React from "react";
import { Button } from "@/components/ui/button";
import { X, Trophy, Star } from "lucide-react";

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
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50 backdrop-blur-sm">
      <div className="bg-background border p-8 rounded-2xl text-center shadow-2xl max-w-md mx-4 relative animate-scale-in">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-lg hover:bg-muted transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
        
        <div className="mb-6">
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <Trophy className="h-8 w-8 text-primary" />
          </div>
          <h2 className="text-3xl font-bold text-foreground mb-2 flex items-center justify-center gap-2">
            <Star className="h-6 w-6 text-yellow-500" />
            {prizeText}
            <Star className="h-6 w-6 text-yellow-500" />
          </h2>
        </div>
        
        <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
          {analogy}
        </p>
        
        <div className="space-y-3">
          {cta && (
            <Button 
              onClick={cta.onClick} 
              className="w-full text-lg py-6"
              size="lg"
            >
              {cta.label}
            </Button>
          )}
          <Button 
            onClick={onClose} 
            variant="outline"
            className="w-full"
          >
            Continue Exploring
          </Button>
        </div>
      </div>
    </div>
  );
}