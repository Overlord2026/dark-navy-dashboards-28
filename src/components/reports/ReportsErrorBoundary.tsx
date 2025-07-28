import React, { Component, ReactNode } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw, Copy } from 'lucide-react';
import { toast } from 'sonner';
import { logErrorToService } from '@/utils/performance';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: string) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorId: string;
}

export class ReportsErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorId: ''
  };

  public static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorId: `REP-${Date.now()}-${Math.floor(Math.random() * 1000)}`
    };
  }

  public componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    const errorId = logErrorToService(error, errorInfo.componentStack, '/reports');
    this.setState({ errorId });
    
    if (this.props.onError) {
      this.props.onError(error, errorInfo.componentStack);
    }
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleReset = () => {
    this.setState({ hasError: false, error: null, errorId: '' });
  };

  private copyErrorId = async () => {
    try {
      await navigator.clipboard.writeText(this.state.errorId);
      toast.success('Error ID copied to clipboard');
    } catch (error) {
      toast.error('Failed to copy error ID');
    }
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <Card className="border-destructive/20 bg-destructive/5">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <AlertTriangle className="h-12 w-12 text-destructive" />
            </div>
            <CardTitle className="text-destructive">Reports Error</CardTitle>
            <CardDescription>
              Something went wrong while loading the reports. This error has been logged for investigation.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <div className="p-4 bg-muted rounded-md">
                <p className="text-sm font-mono text-muted-foreground">
                  {this.state.error.message}
                </p>
              </div>
            )}
            
            <div className="flex flex-col sm:flex-row gap-2 justify-center">
              <Button onClick={this.handleReset} variant="outline" size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                Try Again
              </Button>
              <Button onClick={this.handleReload} variant="outline" size="sm">
                Reload Page
              </Button>
              <Button 
                onClick={this.copyErrorId} 
                variant="outline" 
                size="sm"
                className="text-xs"
              >
                <Copy className="h-4 w-4 mr-2" />
                Copy Error ID
              </Button>
            </div>
            
            <p className="text-xs text-center text-muted-foreground">
              Error ID: {this.state.errorId}
            </p>
          </CardContent>
        </Card>
      );
    }

    return this.props.children;
  }
}