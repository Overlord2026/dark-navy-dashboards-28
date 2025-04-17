
import { RouterProvider } from "react-router-dom";
import routes from "./routes";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { UserProvider } from "@/contexts/UserContext";
import { NetWorthProvider } from "@/contexts/NetWorthContext";
import { SubscriptionProvider } from "@/contexts/SubscriptionContext";
import { Toaster } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { DiagnosticsProvider } from "@/contexts/DiagnosticsContext";
import { AdvisorProvider } from "@/contexts/AdvisorContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { AdminProvider } from '@/contexts/AdminContext';
import { TooltipProvider } from "@/components/ui/tooltip";

// Create a Query Client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function App() {
  return (
    // Order contexts from most global to most specific
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <AdminProvider>
            <UserProvider>
              <SubscriptionProvider>
                <DiagnosticsProvider>
                  <NetWorthProvider>
                    <AdvisorProvider>
                      <TooltipProvider>
                        <RouterProvider router={routes} />
                        <Toaster position="top-right" richColors closeButton />
                      </TooltipProvider>
                    </AdvisorProvider>
                  </NetWorthProvider>
                </DiagnosticsProvider>
              </SubscriptionProvider>
            </UserProvider>
          </AdminProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;

