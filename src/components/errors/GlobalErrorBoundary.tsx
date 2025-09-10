import React from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: string;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error?: Error; resetError: () => void }>;
}

export class GlobalErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { 
      hasError: true, 
      error,
      errorInfo: error.message || "An unexpected error occurred"
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Error caught by GlobalErrorBoundary:", error, errorInfo);
    
    // Log error to external service if needed
    this.logErrorToService(error, errorInfo);
  }

  logErrorToService = (error: Error, errorInfo: React.ErrorInfo) => {
    // TODO: Implement error logging service (e.g., Sentry, LogRocket, etc.)
    console.group("🚨 Application Error");
    console.error("Error:", error);
    console.error("Error Info:", errorInfo);
    console.error("Stack Trace:", error.stack);
    console.groupEnd();
  };

  resetError = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  render() {
    if (this.state.hasError) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback;
        return <FallbackComponent error={this.state.error} resetError={this.resetError} />;
      }

      // Default error UI with BFO theme
      return (
        <div className="min-h-screen bg-bfo-navy flex items-center justify-center p-4">
          <div className="bfo-card max-w-md w-full text-center">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-8 h-8 text-red-600" />
              </div>
            </div>
            
            <h1 className="text-2xl font-bold text-bfo-black mb-4">
              Something went wrong
            </h1>
            
            <p className="text-gray-600 mb-6" aria-live="polite">
              We apologize for the inconvenience. An unexpected error has occurred.
            </p>
            
            {process.env.NODE_ENV === 'development' && this.state.errorInfo && (
              <details className="mb-6 text-left">
                <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700">
                  Error Details (Development Mode)
                </summary>
                <pre className="mt-2 p-3 bg-gray-100 rounded text-xs overflow-auto max-h-32">
                  {this.state.errorInfo}
                </pre>
              </details>
            )}
            
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={this.resetError}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-bfo-gold text-white rounded-lg hover:bg-bfo-gold/90 transition-colors"
                type="button"
              >
                <RefreshCw className="w-4 h-4" />
                Try Again
              </button>
              
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 border border-bfo-gold text-bfo-gold rounded-lg hover:bg-bfo-gold/10 transition-colors"
                type="button"
              >
                Reload Page
              </button>
            </div>
            
            <p className="text-xs text-gray-500 mt-6">
              If this problem persists, please contact support.
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}