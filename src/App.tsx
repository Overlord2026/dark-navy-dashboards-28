
import { Toaster } from "sonner";
import { router } from "./routes";
import { RouterProvider } from "react-router-dom";
import { UserProvider } from "./context/UserContext";
import { ThemeProvider as NextThemesProvider } from "./components/ui/ThemeProvider";
import { ThemeProvider as CustomThemeProvider } from "./context/ThemeContext";
import { NetWorthProvider } from "./context/NetWorthContext";
import { SubscriptionProvider } from "./context/SubscriptionContext";

function App() {
  return (
    <NextThemesProvider defaultTheme="system" storageKey="vite-ui-theme">
      <CustomThemeProvider>
        <UserProvider>
          <NetWorthProvider>
            <SubscriptionProvider>
              <RouterProvider router={router} />
              <Toaster position="top-right" />
            </SubscriptionProvider>
          </NetWorthProvider>
        </UserProvider>
      </CustomThemeProvider>
    </NextThemesProvider>
  );
}

export default App;
