import { RouterProvider } from "react-router-dom";
import routes from "./routes";
import { ThemeProvider } from "@/context/ThemeContext"; // Import from our custom ThemeContext
import { UserProvider } from "@/context/UserContext";
import { NetWorthProvider } from "@/context/NetWorthContext";
import { SubscriptionProvider } from "@/context/SubscriptionContext";
import { Toaster } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { DiagnosticsProvider } from "@/context/DiagnosticsContext";
import { AdvisorProvider } from "@/context/AdvisorContext";
import { AuthProvider } from "@/context/AuthContext";
import { AdminProvider } from './context/AdminContext';
import { TooltipProvider } from "@/components/ui/tooltip";
import { AIInsightsProvider } from "./components/insights/AIInsightsProvider";
import AIInsights from "./pages/AIInsights";

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
    <AdminProvider>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <UserProvider>
            <SubscriptionProvider>
              <NetWorthProvider>
                <DiagnosticsProvider>
                  <AdvisorProvider>
                    <AuthProvider>
                      <TooltipProvider>
                        <RouterProvider router={routes} />
                        <Toaster position="top-right" richColors closeButton />
                      </TooltipProvider>
                    </AuthProvider>
                  </AdvisorProvider>
                </DiagnosticsProvider>
              </NetWorthProvider>
            </SubscriptionProvider>
          </UserProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </AdminProvider>
  );
}

export default App;
