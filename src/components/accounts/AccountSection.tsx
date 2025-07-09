
import React, { useState, ReactNode } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AccountSectionProps {
  icon: ReactNode;
  title: string;
  amount: string;
  children: ReactNode;
  initiallyOpen?: boolean;
}

export const AccountSection = ({ 
  icon, 
  title, 
  amount, 
  children, 
  initiallyOpen = false 
}: AccountSectionProps) => {
  const [isOpen, setIsOpen] = useState(initiallyOpen);

  return (
    <div className="rounded-lg border bg-card overflow-hidden transition-all duration-200">
      <div 
        className="p-4 flex items-center justify-between cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-3">
          {icon}
          <span className="font-medium">{title}</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="font-medium">{amount}</span>
          {isOpen ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
        </div>
      </div>
      
      <div 
        className={cn(
          "transition-all duration-200 overflow-hidden", 
          isOpen ? "max-h-96" : "max-h-0"
        )}
      >
        <div className="border-t border-border">
          {children}
        </div>
      </div>
    </div>
  );
};
