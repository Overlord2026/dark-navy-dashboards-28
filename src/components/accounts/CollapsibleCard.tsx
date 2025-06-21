
import React, { useState, ReactNode } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

interface CollapsibleCardProps {
  icon: ReactNode;
  title: string;
  amount: string;
  description: string;
  children: ReactNode;
  defaultOpen?: boolean;
}

export const CollapsibleCard = ({ 
  icon, 
  title, 
  amount, 
  description, 
  children, 
  defaultOpen = false 
}: CollapsibleCardProps) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const isMobile = useIsMobile();

  return (
    <Card className="w-full">
      <CardHeader 
        className={cn(
          "cursor-pointer transition-colors hover:bg-muted/50",
          isMobile ? "p-4" : "p-6"
        )}
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className={cn(
          "flex items-center justify-between",
          isMobile ? "gap-2" : "gap-4"
        )}>
          <div className="flex items-center gap-3 min-w-0 flex-1">
            {icon}
            <div className="min-w-0 flex-1">
              <CardTitle className={cn(
                "flex items-center gap-2",
                isMobile ? "text-lg" : "text-xl"
              )}>
                <span className="truncate">{title}</span>
              </CardTitle>
              <CardDescription className={cn(
                "mt-1",
                isMobile ? "text-xs" : "text-sm"
              )}>
                {description}
              </CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            <span className={cn(
              "font-semibold",
              isMobile ? "text-base" : "text-lg"
            )}>{amount}</span>
            <Button 
              variant="ghost" 
              size={isMobile ? "sm" : "default"}
              className={cn(
                "h-auto p-1",
                isMobile ? "w-6 h-6" : "w-8 h-8"
              )}
            >
              {isOpen ? (
                <ChevronUp className={cn(
                  isMobile ? "h-3 w-3" : "h-4 w-4"
                )} />
              ) : (
                <ChevronDown className={cn(
                  isMobile ? "h-3 w-3" : "h-4 w-4"
                )} />
              )}
            </Button>
          </div>
        </div>
      </CardHeader>
      
      {isOpen && (
        <CardContent className={cn(
          "border-t",
          isMobile ? "p-4 pt-4" : "p-6 pt-4"
        )}>
          {children}
        </CardContent>
      )}
    </Card>
  );
};
