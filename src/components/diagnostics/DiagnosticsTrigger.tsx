
import React from 'react';
import { Button } from '@/components/ui/button';
import { Hammer, Bug } from 'lucide-react';
import { useDiagnosticsContext } from '@/context/DiagnosticsContext';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

export function DiagnosticsTrigger() {
  const { isDiagnosticsModeEnabled, toggleDiagnosticsMode, isDevelopmentMode } = useDiagnosticsContext();
  
  if (!isDevelopmentMode) return null;
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleDiagnosticsMode}
            className={`fixed bottom-4 right-4 z-50 ${isDiagnosticsModeEnabled ? 'bg-orange-500 text-white hover:bg-orange-600' : 'bg-muted'}`}
          >
            {isDiagnosticsModeEnabled ? <Hammer className="h-5 w-5" /> : <Bug className="h-5 w-5" />}
          </Button>
        </TooltipTrigger>
        <TooltipContent side="left">
          <p>{isDiagnosticsModeEnabled ? 'Disable' : 'Enable'} Diagnostics Mode (Alt+Shift+D)</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
