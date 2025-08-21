import React from 'react';
import { ErrorBoundary } from '@/components/ui/error-boundary';
import { Card, CardContent } from '@/components/ui/card';
import { AlertTriangle, RefreshCw, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EducationErrorBoundaryProps {
  children: React.ReactNode;
  componentName?: string;
}

export function EducationErrorBoundary({ 
  children, 
  componentName = 'Education Component' 
}: EducationErrorBoundaryProps) {
  const handleRetry = () => {
    window.location.reload();
  };

  const errorFallback = (
    <Card className="border-destructive/20 bg-destructive/5">
      <CardContent className="p-6 text-center">
        <div className="flex justify-center items-center gap-2 mb-4">
          <BookOpen className="h-6 w-6 text-destructive/70" />
          <AlertTriangle className="h-6 w-6 text-destructive" />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">
          {componentName} Temporarily Unavailable
        </h3>
        <p className="text-muted-foreground mb-4">
          This educational component encountered an issue. Your learning progress is preserved and other educational resources remain accessible.
        </p>
        <div className="flex flex-col sm:flex-row gap-2 justify-center">
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleRetry}
            className="flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Retry Component
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const ErrorFallback = ({ error, retry }: { error: Error; retry: () => void }) => (
    <Card className="border-destructive/20 bg-destructive/5">
      <CardContent className="p-6 text-center">
        <div className="flex justify-center items-center gap-2 mb-4">
          <BookOpen className="h-6 w-6 text-destructive/70" />
          <AlertTriangle className="h-6 w-6 text-destructive" />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">
          {componentName} Temporarily Unavailable
        </h3>
        <p className="text-muted-foreground mb-4">
          This educational component encountered an issue. Your learning progress is preserved and other educational resources remain accessible.
        </p>
        <div className="flex flex-col sm:flex-row gap-2 justify-center">
          <Button 
            variant="outline" 
            size="sm"
            onClick={retry}
            className="flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Retry Component
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