
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface CollapsibleCardProps {
  icon: React.ReactNode;
  title: string;
  amount: string;
  description: string;
  children: React.ReactNode;
  defaultExpanded?: boolean;
}

export function CollapsibleCard({ 
  icon, 
  title, 
  amount, 
  description, 
  children, 
  defaultExpanded = false 
}: CollapsibleCardProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <Card>
      <CardHeader 
        className="cursor-pointer" 
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            {icon}
            {title}
          </div>
          <div className="flex items-center gap-3">
            <span className="text-lg font-medium">{amount}</span>
            {isExpanded ? (
              <ChevronUp className="h-5 w-5 text-muted-foreground" />
            ) : (
              <ChevronDown className="h-5 w-5 text-muted-foreground" />
            )}
          </div>
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <div 
        className={cn(
          "overflow-hidden transition-all duration-200",
          isExpanded ? "max-h-none" : "max-h-0"
        )}
      >
        <CardContent>
          {children}
        </CardContent>
      </div>
    </Card>
  );
}
