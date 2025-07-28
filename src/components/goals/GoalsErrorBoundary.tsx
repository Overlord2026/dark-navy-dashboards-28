import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw, Copy } from 'lucide-react';
import { logErrorToService } from '@/utils/performance';
import { useToast } from '@/hooks/use-toast';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorId: string | null;
}

export class GoalsErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorId: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    const errorId = `GOAL-${Math.floor(Math.random() * 1000000)}`;
    return {
      hasError: true,
      error,
      errorId,
    };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    const errorId = logErrorToService(error, errorInfo.componentStack, '/goals');
    
    this.setState({ errorId });
    
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleReset = () => {
    this.setState({ hasError: false, error: null, errorId: null });
  };

  private copyErrorId = () => {
    if (this.state.errorId) {
      navigator.clipboard.writeText(this.state.errorId);
      // Note: useToast can't be used in class component
      // You could implement a toast service or use a different approach
    }
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="container mx-auto p-6">
          <Card className="border-destructive/50 bg-destructive/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-destructive">
                <AlertTriangle className="h-5 w-5" />
                Goals System Error
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-sm text-muted-foreground">
                <p className="mb-2">
                  Something went wrong while loading your goals. This error has been logged for review.
                </p>
                <p className="font-mono text-xs bg-muted p-2 rounded">
                  Error ID: {this.state.errorId}
                </p>
              </div>
              
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={this.handleReset}
                  className="flex items-center gap-2"
                >
                  <RefreshCw className="h-3 w-3" />
                  Try Again
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={this.handleReload}
                >
                  Reload Page
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={this.copyErrorId}
                  className="flex items-center gap-2"
                >
                  <Copy className="h-3 w-3" />
                  Copy Error ID
                </Button>
              </div>

              <div className="text-xs text-muted-foreground">
                If this problem persists, please contact support with the error ID above.
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

// Functional wrapper for easier use with hooks
export const GoalsErrorBoundaryWrapper: React.FC<{
  children: ReactNode;
  fallback?: ReactNode;
}> = ({ children, fallback }) => {
  const { toast } = useToast();

  const handleError = (error: Error, errorInfo: ErrorInfo) => {
    toast({
      title: "Goals Error",
      description: "An error occurred in the goals system. Please try again.",
      variant: "destructive",
    });
  };

  return (
    <GoalsErrorBoundary fallback={fallback} onError={handleError}>
      {children}
    </GoalsErrorBoundary>
  );
};