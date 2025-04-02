
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "sonner";
import AppRoutes from "./routes";
import { UserProvider } from "./context/UserContext";
import { ThemeProvider as NextThemesProvider } from "./components/ThemeProvider";
import { ThemeProvider as CustomThemeProvider } from "./context/ThemeContext";

function App() {
  return (
    <NextThemesProvider defaultTheme="system" storageKey="vite-ui-theme">
      <CustomThemeProvider>
        <UserProvider>
          <BrowserRouter>
            <AppRoutes />
            <Toaster position="top-right" />
          </BrowserRouter>
        </UserProvider>
      </CustomThemeProvider>
    </NextThemesProvider>
  );
}

export default App;
