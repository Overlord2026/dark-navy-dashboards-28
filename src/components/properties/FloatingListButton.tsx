import React from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useResponsive } from "@/hooks/use-responsive";

interface FloatingListButtonProps {
  onClick: () => void;
}

export const FloatingListButton: React.FC<FloatingListButtonProps> = ({ onClick }) => {
  const { isMobile } = useResponsive();

  if (!isMobile) return null;

  return (
    <Button
      onClick={onClick}
      size="lg"
      className="fixed bottom-6 right-6 z-50 rounded-full w-14 h-14 shadow-elegant bg-gradient-primary hover:bg-gradient-primary/90 animate-pulse"
    >
      <Plus className="h-6 w-6" />
      <span className="sr-only">List Property</span>
    </Button>
  );
};