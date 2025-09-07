import React, { Component, ReactNode } from 'react';
import { toast } from 'sonner';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props {
  children: ReactNode;
  showDetailedError?: boolean;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class GlobalErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error to monitoring service
    if (import.meta.env.DEV) {
      console.error('Global Error Boundary caught an error:', error, errorInfo);
    }
    
    // Show toast notification for API/network failures
    if (error.message.includes('fetch') || 
        error.message.includes('network') || 
        error.message.includes('API')) {
      toast.error('Network error occurred. Please check your connection and try again.');
    } else {
      toast.error('An unexpected error occurred. Please try refreshing the page.');
    }
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="max-w-md w-full mx-auto p-6 text-center">
            <AlertTriangle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <h1 className="text-2xl font-semibold text-foreground mb-2">
              Something went wrong
            </h1>
            <p className="text-muted-foreground mb-6">
              We're sorry, but something unexpected happened. Please try refreshing the page.
            </p>
            
            {this.props.showDetailedError && this.state.error && (
              <details className="mb-6 text-left">
                <summary className="cursor-pointer text-sm text-muted-foreground hover:text-foreground">
                  Technical Details
                </summary>
                <pre className="mt-2 p-3 bg-muted rounded-md text-xs overflow-auto">
                  {this.state.error.stack}
                </pre>
              </details>
            )}
            
            <div className="flex gap-3 justify-center">
              <Button onClick={this.handleRetry} variant="outline">
                <RefreshCw className="h-4 w-4 mr-2" />
                Try Again
              </Button>
              <Button onClick={() => window.location.reload()}>
                Refresh Page
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Network error interceptor for fetch requests
export const setupNetworkErrorHandling = () => {
  // Intercept fetch errors
  const originalFetch = window.fetch;
  window.fetch = async (...args) => {
    try {
      const response = await originalFetch(...args);
      if (!response.ok) {
        toast.error(`Network error: ${response.status} ${response.statusText}`);
      }
      return response;
    } catch (error) {
      toast.error('Network connection failed. Please check your internet connection.');
      throw error;
    }
  };

  // Global error handler for unhandled errors
  window.addEventListener('error', (event) => {
    if (import.meta.env.DEV) {
      console.error('Unhandled error:', event.error);
    }
    toast.error('An unexpected error occurred');
  });

  window.addEventListener('unhandledrejection', (event) => {
    if (import.meta.env.DEV) {
      console.error('Unhandled promise rejection:', event.reason);
    }
    toast.error('A network or processing error occurred');
  });
};