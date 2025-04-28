
import React from "react";
import { Button } from "@/components/ui/button";
import type { LucideIcon } from "../types";

interface LoanItemCardProps {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  onClick: () => void;
  rightIcon?: React.ReactNode;
}

export function LoanItemCard({ 
  id, 
  title, 
  description, 
  icon: Icon, 
  onClick,
  rightIcon
}: LoanItemCardProps) {
  const [isHovered, setIsHovered] = React.useState(false);
  
  return (
    <Button
      variant="outline"
      className={`flex items-start justify-between h-auto p-4 transition-all duration-200 w-full ${
        isHovered ? 'bg-accent shadow-sm' : 'hover:bg-accent/50'
      }`}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setIsHovered(true)}
      onBlur={() => setIsHovered(false)}
      aria-label={`Select ${title}`}
    >
      <div className="flex items-center gap-3">
        <div className={`flex items-center justify-center w-10 h-10 rounded-full transition-colors duration-200 ${
          isHovered ? 'bg-primary/20 text-primary' : 'bg-primary/10 text-primary'
        }`}>
          <Icon className="h-5 w-5" />
        </div>
        <div className="text-left">
          <h3 className="font-medium">{title}</h3>
          <p className="text-sm text-muted-foreground mt-1">{description}</p>
        </div>
      </div>
      {rightIcon && (
        <div className="flex-shrink-0">
          {rightIcon}
        </div>
      )}
    </Button>
  );
}
