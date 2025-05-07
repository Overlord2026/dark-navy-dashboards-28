
import { RouterProvider } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import routes from "./routes";
import { ThemeProvider } from "./context/ThemeContext";
import { NetWorthProvider } from "./context/NetWorthContext";
import { UserProvider } from "./context/UserContext";

function App() {
  return (
    <ThemeProvider>
      <UserProvider>
        <NetWorthProvider>
          <RouterProvider router={routes} />
          <Toaster />
        </NetWorthProvider>
      </UserProvider>
    </ThemeProvider>
  );
}

export default App;
