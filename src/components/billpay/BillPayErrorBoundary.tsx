import React from "react";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import { AlertTriangle, RefreshCw, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface BillPayErrorFallbackProps {
  error: Error;
  resetError: () => void;
}

const BillPayErrorFallback: React.FC<BillPayErrorFallbackProps> = ({ error, resetError }) => (
  <Card className="max-w-lg mx-auto mt-8">
    <CardHeader className="text-center">
      <div className="flex justify-center mb-4">
        <div className="p-3 bg-destructive/10 rounded-full">
          <AlertTriangle className="h-8 w-8 text-destructive" />
        </div>
      </div>
      <CardTitle className="flex items-center justify-center gap-2">
        <CreditCard className="h-5 w-5" />
        Bill Pay Error
      </CardTitle>
      <CardDescription>
        Something went wrong with the bill payment system
      </CardDescription>
    </CardHeader>
    <CardContent className="space-y-4 text-center">
      <p className="text-sm text-muted-foreground">
        We encountered an issue while loading your bill payment data. This might be a temporary problem.
      </p>
      <div className="bg-muted p-3 rounded-md text-left">
        <p className="text-xs font-mono text-muted-foreground">
          {error.message}
        </p>
      </div>
      <div className="flex flex-col sm:flex-row gap-2 justify-center">
        <Button onClick={resetError} variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          Try Again
        </Button>
        <Button onClick={() => window.location.reload()} size="sm">
          Reload Page
        </Button>
      </div>
    </CardContent>
  </Card>
);

export const BillPayErrorBoundary: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ErrorBoundary
    fallback={({ error, retry }) => <BillPayErrorFallback error={error} resetError={retry} />}
  >
    {children}
  </ErrorBoundary>
);