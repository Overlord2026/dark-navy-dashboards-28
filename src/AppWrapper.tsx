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
        <Suspense fallback={<div />}>
          <RouterProvider router={router} />
        </Suspense>
      </QueryClientProvider>
    </GlobalErrorBoundary>
  );
}