import React, { Suspense } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import { EntitlementsProvider } from '@/context/EntitlementsContext';
import GlobalErrorBoundary from "@/components/monitoring/GlobalErrorBoundary";

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
          <EntitlementsProvider>
            <RouterProvider router={router} />
          </EntitlementsProvider>
        </Suspense>
      </QueryClientProvider>
    </GlobalErrorBoundary>
  );
}