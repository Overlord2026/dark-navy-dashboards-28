
import { RouterProvider } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import routes from "./routes";
import { ThemeProvider } from "./context/ThemeContext";
import { NetWorthProvider } from "./context/NetWorthContext";

function App() {
  return (
    <ThemeProvider>
      <NetWorthProvider>
        <RouterProvider router={routes} />
        <Toaster />
      </NetWorthProvider>
    </ThemeProvider>
  );
}

export default App;
