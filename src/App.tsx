
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "sonner";
import AppRoutes from "./routes";
import { UserProvider } from "./context/UserContext";
import { ThemeProvider as NextThemesProvider } from "./components/ui/ThemeProvider";
import { ThemeProvider as CustomThemeProvider } from "./context/ThemeContext";
import { NetWorthProvider } from "./context/NetWorthContext";
import { SubscriptionProvider } from "./context/SubscriptionContext";
import { BillsProvider } from "./hooks/useBills";

function App() {
  return (
    <NextThemesProvider defaultTheme="system" storageKey="vite-ui-theme">
      <CustomThemeProvider>
        <UserProvider>
          <NetWorthProvider>
            <SubscriptionProvider>
              <BillsProvider>
                <BrowserRouter>
                  <AppRoutes />
                  <Toaster position="top-right" />
                </BrowserRouter>
              </BillsProvider>
            </SubscriptionProvider>
          </NetWorthProvider>
        </UserProvider>
      </CustomThemeProvider>
    </NextThemesProvider>
  );
}

export default App;
