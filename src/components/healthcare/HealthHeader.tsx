import { Bell, User, Shield, AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface HealthHeaderProps {
  className?: string;
}

type Persona = 'Retiree' | 'Advisor' | 'CPA' | 'Clinician';
type ConsentStatus = 'Fresh' | 'Expiring' | 'Expired';

const getPersonaColor = (persona: Persona) => {
  switch (persona) {
    case 'Retiree': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
    case 'Advisor': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
    case 'CPA': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
    case 'Clinician': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
  }
};

const getConsentStatusColor = (status: ConsentStatus) => {
  switch (status) {
    case 'Fresh': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
    case 'Expiring': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
    case 'Expired': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
  }
};

export function HealthHeader({ className }: HealthHeaderProps) {
  // Mock data - in real app would come from context/state
  const currentPersona: Persona = 'Retiree';
  const consentStatus: ConsentStatus = 'Fresh';
  const approvalsCount = 3;

  return (
    <div className={cn(
      "fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-border",
      className
    )}>
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <User className="h-5 w-5 text-muted-foreground" />
            <span className="text-sm font-medium">Health Dashboard</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Persona Pill */}
          <Badge 
            variant="secondary" 
            className={cn("text-xs font-medium", getPersonaColor(currentPersona))}
          >
            <User className="h-3 w-3 mr-1" />
            {currentPersona}
          </Badge>

          {/* Consent Status */}
          <Badge 
            variant="secondary" 
            className={cn("text-xs font-medium", getConsentStatusColor(consentStatus))}
          >
            <Shield className="h-3 w-3 mr-1" />
            Consent: {consentStatus}
          </Badge>

          {/* Approvals Bell */}
          <Button variant="ghost" size="sm" className="relative">
            <Bell className="h-4 w-4" />
            {approvalsCount > 0 && (
              <Badge 
                variant="destructive" 
                className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center"
              >
                {approvalsCount}
              </Badge>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}