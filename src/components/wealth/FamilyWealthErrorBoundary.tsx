import React, { ErrorInfo, ReactNode } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorId: string;
}

export class FamilyWealthErrorBoundary extends React.Component<Props, State> {
  public state: State = {
    hasError: false,
    errorId: ''
  };

  public static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorId: `fw-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('FamilyWealthErrorBoundary caught an error:', error, errorInfo);
    
    // Call optional error handler
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleReset = () => {
    this.setState({ hasError: false, error: undefined, errorId: '' });
  };

  private copyErrorId = async () => {
    try {
      await navigator.clipboard.writeText(this.state.errorId);
      // Could add toast notification here
    } catch (err) {
      console.error('Failed to copy error ID:', err);
    }
  };

  public render() {
    if (!this.state.hasError) {
      return this.props.children;
    }

    // Use custom fallback if provided
    if (this.props.fallback) {
      return this.props.fallback;
    }

    // Default error UI
    return (
      <Card className="max-w-2xl mx-auto my-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <AlertCircle className="h-5 w-5" />
            Family Wealth Data Error
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-sm text-muted-foreground">
            <p>An error occurred while loading your wealth management data. This could be due to:</p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Temporary network connectivity issues</li>
              <li>Database synchronization delays</li>
              <li>Account permissions being updated</li>
            </ul>
          </div>
          
          {this.state.error && (
            <details className="text-xs">
              <summary className="cursor-pointer font-medium mb-2">Technical Details</summary>
              <pre className="bg-muted p-3 rounded text-xs overflow-auto">
                {this.state.error.message}
              </pre>
            </details>
          )}

          <div className="flex flex-wrap gap-2">
            <Button onClick={this.handleReset} variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
            <Button onClick={this.handleReload} variant="outline" size="sm">
              Reload Page
            </Button>
            <Button onClick={this.copyErrorId} variant="ghost" size="sm">
              Copy Error ID
            </Button>
          </div>
          
          {this.state.errorId && (
            <p className="text-xs text-muted-foreground">
              Error ID: <code className="bg-muted px-1 rounded">{this.state.errorId}</code>
            </p>
          )}
        </CardContent>
      </Card>
    );
  }
}