// @ts-nocheck
import React, { useState } from 'react';
import { Shield, Lock, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePersonaAuth } from '@/hooks/usePersonaAuth';
import { toast } from 'sonner';

interface ActionGuardProps {
  actionKey: string;
  children: React.ReactElement;
  fallback?: React.ReactNode;
  showReason?: boolean;
}

export default function ActionGuard({ 
  actionKey, 
  children, 
  fallback,
  showReason = false 
}: ActionGuardProps) {
  const { guardAction, currentPersona } = usePersonaAuth();
  const [isChecking, setIsChecking] = useState(false);
  const [lastCheck, setLastCheck] = useState<{
    allowed: boolean;
    reason: string;
    timestamp: number;
  } | null>(null);

  const handleAction = async (originalOnClick?: () => void) => {
    setIsChecking(true);
    
    try {
      const result = await guardAction(actionKey);
      
      setLastCheck({
        allowed: result.allowed,
        reason: result.reason,
        timestamp: Date.now()
      });

      if (result.allowed) {
        if (showReason) {
          toast.success('Action authorized', {
            description: `Reason: ${result.reason}`
          });
        }
        originalOnClick?.();
      } else {
        toast.error('Action blocked', {
          description: `Reason: ${result.reason}`,
          action: {
            label: 'View Receipt',
            onClick: () => {
              if (result.receipt) {
                console.log('Receipt:', result.receipt);
              }
            }
          }
        });
      }
    } catch (error) {
      console.error('Action guard error:', error);
      toast.error('Authorization check failed');
    } finally {
      setIsChecking(false);
    }
  };

  // If no persona, show fallback
  if (!currentPersona) {
    return fallback || (
      <Button variant="outline" disabled className="opacity-50">
        <Lock className="w-4 h-4 mr-2" />
        No Persona Active
      </Button>
    );
  }

  // Clone the child element and wrap with guard
  const guardedChild = React.cloneElement(children, {
    ...children.props,
    onClick: () => handleAction(children.props.onClick),
    disabled: children.props.disabled || isChecking,
    children: (
      <div className="flex items-center">
        {isChecking && <Shield className="w-4 h-4 mr-2 animate-pulse" />}
        {children.props.children}
      </div>
    )
  });

  return (
    <div className="relative">
      {guardedChild}
      {showReason && lastCheck && (
        <div className="absolute -bottom-6 left-0 text-xs text-muted-foreground">
          {lastCheck.allowed ? (
            <span className="text-green-600">✓ {lastCheck.reason}</span>
          ) : (
            <span className="text-red-600">✗ {lastCheck.reason}</span>
          )}
        </div>
      )}
    </div>
  );
}