import React, { Suspense } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import GlobalErrorBoundary from "@/components/monitoring/GlobalErrorBoundary";

// Ensure React is properly initialized before creating router
if (!React || typeof React.createElement !== 'function') {
  throw new Error('React runtime not properly initialized in AppWrapper');
}

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

export default function App() {
  return (
    <GlobalErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <Suspense fallback={
          <div className="flex items-center justify-center min-h-screen bg-background">
            <div className="flex flex-col items-center gap-3">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
              <p className="text-sm text-muted-foreground">Loading...</p>
            </div>
          </div>
        }>
          <RouterProvider router={router} />
        </Suspense>
      </QueryClientProvider>
    </GlobalErrorBoundary>
  );
}