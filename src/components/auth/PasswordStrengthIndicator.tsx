
import React from 'react';
import { PasswordValidationResult } from '@/services/security/passwordPolicy';
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, AlertCircle, XCircle } from "lucide-react";

interface PasswordStrengthIndicatorProps {
  validation: PasswordValidationResult | null;
  password: string;
}

export function PasswordStrengthIndicator({ validation, password }: PasswordStrengthIndicatorProps) {
  if (!password || !validation) return null;

  const getStrengthColor = (strength: string) => {
    switch (strength) {
      case 'weak': return 'text-red-500';
      case 'fair': return 'text-orange-500';
      case 'good': return 'text-yellow-500';
      case 'strong': return 'text-green-500';
      default: return 'text-gray-500';
    }
  };

  const getProgressValue = (strength: string) => {
    switch (strength) {
      case 'weak': return 25;
      case 'fair': return 50;
      case 'good': return 75;
      case 'strong': return 100;
      default: return 0;
    }
  };

  const getProgressColor = (strength: string) => {
    switch (strength) {
      case 'weak': return 'bg-red-500';
      case 'fair': return 'bg-orange-500';
      case 'good': return 'bg-yellow-500';
      case 'strong': return 'bg-green-500';
      default: return 'bg-gray-300';
    }
  };

  return (
    <div className="space-y-2 text-sm">
      <div className="flex items-center justify-between">
        <span className="font-medium">Password Strength</span>
        <Badge 
          variant="outline" 
          className={getStrengthColor(validation.strength)}
        >
          {validation.strength.toUpperCase()}
        </Badge>
      </div>
      
      <Progress 
        value={getProgressValue(validation.strength)} 
        className="h-2"
      />
      
      <div className="text-xs text-muted-foreground">
        Entropy: {validation.entropy.toFixed(1)} bits
      </div>

      {validation.errors.length > 0 && (
        <div className="space-y-1">
          {validation.errors.map((error, index) => (
            <div key={index} className="flex items-center gap-2 text-red-600">
              <XCircle className="h-3 w-3" />
              <span className="text-xs">{error}</span>
            </div>
          ))}
        </div>
      )}

      {validation.isValid && (
        <div className="flex items-center gap-2 text-green-600">
          <CheckCircle className="h-3 w-3" />
          <span className="text-xs">Password meets all security requirements</span>
        </div>
      )}
    </div>
  );
}
