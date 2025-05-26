
import { RouterProvider } from "react-router-dom";
import routes from "./routes";
import { ThemeProvider } from "@/context/ThemeContext";
import { AuthProvider } from "@/context/AuthContext";
import { UserProvider } from "@/context/UserContext";
import { NetWorthProvider } from "@/context/NetWorthContext";
import { SubscriptionProvider } from "@/context/SubscriptionContext";
import { Toaster } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { DiagnosticsProvider } from "@/context/DiagnosticsContext";
import { AdvisorProvider } from "@/context/AdvisorContext";

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
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <UserProvider>
            <SubscriptionProvider>
              <NetWorthProvider>
                <DiagnosticsProvider>
                  <AdvisorProvider>
                    <RouterProvider router={routes} />
                    <Toaster position="top-right" richColors closeButton />
                  </AdvisorProvider>
                </DiagnosticsProvider>
              </NetWorthProvider>
            </SubscriptionProvider>
          </UserProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
