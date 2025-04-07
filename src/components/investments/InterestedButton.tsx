
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { toast } from "sonner";

export interface InterestedButtonProps {
  assetName: string;
  onInterested?: () => void;
  className?: string;
  size?: "default" | "sm" | "lg";
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
}

export const InterestedButton: React.FC<InterestedButtonProps> = ({
  assetName,
  onInterested,
  className = "",
  size = "sm",
  variant = "outline"
}) => {
  const [isInterested, setIsInterested] = useState(false);
  
  const handleInterested = () => {
    setIsInterested(true);
    toast.success(`We've noted your interest in ${assetName}`, {
      description: "An advisor will contact you with more information."
    });
    if (onInterested) {
      onInterested();
    }
  };
  
  return (
    <Button
      variant={variant}
      size={size}
      className={`gap-1 ${className} ${isInterested ? 'bg-red-50 text-red-500 border-red-200' : ''}`}
      onClick={handleInterested}
      disabled={isInterested}
    >
      <Heart className={`h-4 w-4 ${isInterested ? 'fill-red-500' : ''}`} />
      {isInterested ? "Interested" : "I'm Interested"}
    </Button>
  );
};
