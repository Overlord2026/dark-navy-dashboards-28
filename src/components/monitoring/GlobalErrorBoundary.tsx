import React, { Component, ErrorInfo, ReactNode } from 'react';
import { logger } from '@/services/logging/loggingService';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, RefreshCw, Copy, Home, Bug } from 'lucide-react';
import { toast } from 'sonner';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  showDetailedError?: boolean;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorId: string | null;
  errorInfo: ErrorInfo | null;
  retryCount: number;
}

export class GlobalErrorBoundary extends Component<Props, State> {
  private maxRetries = 3;

  public state: State = {
    hasError: false,
    error: null,
    errorId: null,
    errorInfo: null,
    retryCount: 0
  };

  public static getDerivedStateFromError(error: Error): Partial<State> {
    return {
      hasError: true,
      error,
      errorId: `global_error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    const errorId = this.state.errorId || 'unknown_global_error';
    
    // Enhanced error logging with more context
    logger.critical('Global Error Boundary Triggered', {
      error: {
        message: error.message,
        stack: error.stack,
        name: error.name,
        cause: error.cause
      },
      errorInfo: {
        componentStack: errorInfo.componentStack
      },
      errorId,
      retryCount: this.state.retryCount,
      userAgent: navigator.userAgent,
      url: window.location.href,
      timestamp: new Date().toISOString(),
      localStorageSize: this.getLocalStorageSize(),
      memoryUsage: this.getMemoryUsage()
    }, 'GlobalErrorBoundary');

    // Store error info in state
    this.setState({ errorInfo });

    // Send to external error tracking service (if configured)
    this.reportToExternalService(error, errorInfo, errorId);

    // Call optional error handler
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  private getLocalStorageSize = (): number => {
    try {
      let total = 0;
      for (let key in localStorage) {
        if (localStorage.hasOwnProperty(key)) {
          total += localStorage[key].length + key.length;
        }
      }
      return total;
    } catch {
      return 0;
    }
  };

  private getMemoryUsage = (): any => {
    try {
      // @ts-ignore - performance.memory is not in TypeScript definitions
      return (performance as any).memory || {};
    } catch {
      return {};
    }
  };

  private reportToExternalService = (error: Error, errorInfo: ErrorInfo, errorId: string) => {
    // In production, this would send to Sentry, LogRocket, etc.
    if (process.env.NODE_ENV === 'production') {
      // Example: Sentry.captureException(error, { extra: { errorInfo, errorId } });
    }
  };

  private handleReload = () => {
    window.location.reload();
  };

  private handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorId: null,
      errorInfo: null,
      retryCount: this.state.retryCount + 1
    });
  };

  private handleGoHome = () => {
    window.location.href = '/';
  };

  private copyErrorDetails = () => {
    if (this.state.error && this.state.errorId) {
      const errorDetails = {
        errorId: this.state.errorId,
        message: this.state.error.message,
        stack: this.state.error.stack,
        componentStack: this.state.errorInfo?.componentStack,
        url: window.location.href,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent
      };
      
      navigator.clipboard.writeText(JSON.stringify(errorDetails, null, 2));
      toast.success('Error details copied to clipboard');
    }
  };

  private clearErrorData = () => {
    // Clear potentially corrupted local data
    try {
      localStorage.removeItem('app-state');
      sessionStorage.clear();
    } catch (error) {
      console.warn('Could not clear storage:', error);
    }
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const canRetry = this.state.retryCount < this.maxRetries;

      return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
          <Card className="max-w-2xl w-full">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-red-100 flex items-center justify-center">
                <AlertTriangle className="h-8 w-8 text-red-600" />
              </div>
              <CardTitle className="text-red-600 text-2xl">Application Error</CardTitle>
              <CardDescription className="text-base">
                We're sorry, but something went wrong. Our team has been automatically notified and is working on a fix.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {this.state.error && (
                <div className="bg-gray-50 border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-gray-700">Error Details</h4>
                    {this.props.showDetailedError && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={this.copyErrorDetails}
                      >
                        <Copy className="h-3 w-3 mr-1" />
                        Copy
                      </Button>
                    )}
                  </div>
                  
                  <div className="text-sm">
                    <p className="font-medium text-red-600 mb-1">
                      {this.state.error.name}: {this.state.error.message}
                    </p>
                    {this.props.showDetailedError && this.state.error.stack && (
                      <pre className="text-xs text-gray-600 bg-white p-2 rounded border overflow-x-auto max-h-32">
                        {this.state.error.stack}
                      </pre>
                    )}
                  </div>
                </div>
              )}

              {this.state.errorId && (
                <div className="flex items-center justify-between bg-blue-50 border border-blue-200 p-3 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-blue-700">Error Reference ID</p>
                    <p className="text-xs text-blue-600 font-mono">{this.state.errorId}</p>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      navigator.clipboard.writeText(this.state.errorId!);
                      toast.success('Error ID copied');
                    }}
                    className="ml-2"
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
              )}

              {this.state.retryCount > 0 && (
                <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-lg">
                  <p className="text-sm text-yellow-800">
                    Retry attempt {this.state.retryCount} of {this.maxRetries}
                  </p>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {canRetry && (
                  <Button onClick={this.handleReset} className="w-full">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Try Again
                  </Button>
                )}
                <Button variant="outline" onClick={this.handleGoHome} className="w-full">
                  <Home className="h-4 w-4 mr-2" />
                  Go to Home
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    this.clearErrorData();
                    this.handleReload();
                  }} 
                  className="w-full"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Reload App
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => window.open('mailto:support@familyoffice.com?subject=Application Error&body=Error ID: ' + this.state.errorId)} 
                  className="w-full"
                >
                  <Bug className="h-4 w-4 mr-2" />
                  Report Issue
                </Button>
              </div>

              <div className="text-center pt-4 border-t">
                <p className="text-xs text-gray-500">
                  If this problem persists, please contact support with the Error Reference ID above.
                  <br />
                  Support: support@familyoffice.com | (555) 123-4567
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