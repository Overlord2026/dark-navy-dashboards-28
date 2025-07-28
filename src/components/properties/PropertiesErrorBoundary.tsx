import React, { Component, ReactNode, ErrorInfo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import { toast } from "sonner";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorId: string;
}

class PropertiesErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorId: ""
    };
  }

  public static getDerivedStateFromError(error: Error): State {
    const errorId = `prop-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    return {
      hasError: true,
      error,
      errorId
    };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    const errorDetails = {
      error: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString(),
      errorId: this.state.errorId,
      context: "Properties Management"
    };

    console.error("Properties Error Boundary caught an error:", errorDetails);
    
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  private handleReload = (): void => {
    window.location.reload();
  };

  private handleReset = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorId: ""
    });
  };

  private copyErrorId = (): void => {
    navigator.clipboard.writeText(this.state.errorId);
    toast.success("Error ID copied to clipboard");
  };

  public render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-[400px] flex items-center justify-center p-6">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 p-3 bg-destructive/10 rounded-full w-fit">
                <AlertTriangle className="h-6 w-6 text-destructive" />
              </div>
              <CardTitle className="text-xl">Properties Error</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  There was an error loading your property management data. This might be due to a temporary issue with the database or network connection.
                </AlertDescription>
              </Alert>
              
              {this.state.error && (
                <div className="bg-muted p-3 rounded text-sm">
                  <strong>Error:</strong> {this.state.error.message}
                </div>
              )}
              
              <div className="bg-muted/50 p-3 rounded text-xs text-muted-foreground">
                Error ID: <code className="bg-background px-1 rounded">{this.state.errorId}</code>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={this.copyErrorId}
                  className="ml-2 h-auto p-1"
                >
                  Copy
                </Button>
              </div>

              <div className="flex flex-col gap-2">
                <Button onClick={this.handleReset} className="w-full">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Try Again
                </Button>
                <Button variant="outline" onClick={this.handleReload} className="w-full">
                  <Home className="h-4 w-4 mr-2" />
                  Reload Page
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

export default PropertiesErrorBoundary;