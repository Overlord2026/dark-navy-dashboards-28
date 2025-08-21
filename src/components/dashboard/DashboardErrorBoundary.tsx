import React from 'react';
import { ErrorBoundary } from '@/components/ui/error-boundary';
import { Card, CardContent } from '@/components/ui/card';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DashboardErrorBoundaryProps {
  children: React.ReactNode;
  componentName?: string;
}

export function DashboardErrorBoundary({ 
  children, 
  componentName = 'Dashboard Widget' 
}: DashboardErrorBoundaryProps) {
  const handleRetry = () => {
    window.location.reload();
  };

  const errorFallback = (
    <Card className="border-destructive/20 bg-destructive/5">
      <CardContent className="p-6 text-center">
        <AlertTriangle className="h-8 w-8 text-destructive mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-foreground mb-2">
          {componentName} Unavailable
        </h3>
        <p className="text-muted-foreground mb-4">
          This component encountered an error and couldn't load. Other dashboard features remain available.
        </p>
        <div className="flex flex-col sm:flex-row gap-2 justify-center">
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleRetry}
            className="flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Retry
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const ErrorFallback = ({ error, retry }: { error: Error; retry: () => void }) => (
    <Card className="border-destructive/20 bg-destructive/5">
      <CardContent className="p-6 text-center">
        <AlertTriangle className="h-8 w-8 text-destructive mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-foreground mb-2">
          {componentName} Unavailable
        </h3>
        <p className="text-muted-foreground mb-4">
          This component encountered an error and couldn't load. Other dashboard features remain available.
        </p>
        <div className="flex flex-col sm:flex-row gap-2 justify-center">
          <Button 
            variant="outline" 
            size="sm"
            onClick={retry}
            className="flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Retry
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <ErrorBoundary fallback={ErrorFallback}>
      {children}
    </ErrorBoundary>
  );
}