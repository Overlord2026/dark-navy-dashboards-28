
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "sonner";
import AppRoutes from "./routes";
import { UserProvider } from "./context/UserContext";
import { ThemeProvider as NextThemesProvider } from "./components/ui/ThemeProvider";
import { ThemeProvider as CustomThemeProvider } from "./context/ThemeContext";
import { NetWorthProvider } from "./context/NetWorthContext";
import { SubscriptionProvider } from "./context/SubscriptionContext";

function App() {
  return (
    <NextThemesProvider defaultTheme="system" storageKey="vite-ui-theme">
      <CustomThemeProvider>
        <BrowserRouter>
          <UserProvider>
            <NetWorthProvider>
              <SubscriptionProvider>
                <AppRoutes />
                <Toaster position="top-right" />
              </SubscriptionProvider>
            </NetWorthProvider>
          </UserProvider>
        </BrowserRouter>
      </CustomThemeProvider>
    </NextThemesProvider>
  );
}

export default App;
