
import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { ThemeProvider } from '@/components/ThemeProvider';
import { AuthProvider } from '@/context/AuthContext';
import { UserProvider } from '@/context/UserContext';
import { AuthProvider as SupabaseAuthProvider } from '@/context/SupabaseAuthContext';
import { Toaster } from '@/components/ui/sonner';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import routes from './routes';
import './App.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="family-office-theme">
        <SupabaseAuthProvider>
          <UserProvider>
            <AuthProvider>
              <RouterProvider router={routes} />
              <Toaster />
            </AuthProvider>
          </UserProvider>
        </SupabaseAuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
