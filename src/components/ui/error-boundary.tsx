
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { logger } from '@/services/logging/loggingService';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, RefreshCw, Copy } from 'lucide-react';
import { toast } from 'sonner';

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

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorId: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorId: `ui_error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error details
    const errorId = this.state.errorId || 'unknown_error';
    
    logger.error('UI Error Boundary Caught Error', {
      error: {
        message: error.message,
        stack: error.stack,
        name: error.name
      },
      errorInfo: {
        componentStack: errorInfo.componentStack
      },
      errorId,
      timestamp: new Date().toISOString()
    }, 'ErrorBoundary');

    // Call optional error handler
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorId: null
    });
  };

  private copyErrorId = () => {
    if (this.state.errorId) {
      navigator.clipboard.writeText(this.state.errorId);
      toast.success('Error ID copied to clipboard');
    }
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-[400px] flex items-center justify-center p-4">
          <Card className="max-w-md w-full">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-red-100 flex items-center justify-center">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <CardTitle className="text-red-600">Something went wrong</CardTitle>
              <CardDescription>
                An unexpected error occurred in this component. Our team has been automatically notified.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {this.state.error && (
                <div className="bg-gray-50 p-3 rounded-md text-sm">
                  <p className="font-medium text-gray-700 mb-1">Error Details:</p>
                  <p className="text-gray-600 font-mono text-xs break-all">
                    {this.state.error.message}
                  </p>
                </div>
              )}

              {this.state.errorId && (
                <div className="flex items-center justify-between bg-blue-50 p-3 rounded-md">
                  <div>
                    <p className="text-sm font-medium text-blue-700">Error ID</p>
                    <p className="text-xs text-blue-600 font-mono">{this.state.errorId}</p>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={this.copyErrorId}
                    className="ml-2"
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
              )}

              <div className="flex gap-2">
                <Button onClick={this.handleReset} className="flex-1">
                  Try Again
                </Button>
                <Button variant="outline" onClick={this.handleReload} className="flex-1">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Reload Page
                </Button>
              </div>

              <div className="text-center">
                <p className="text-xs text-gray-500">
                  If this problem persists, please contact support with the Error ID above.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}
