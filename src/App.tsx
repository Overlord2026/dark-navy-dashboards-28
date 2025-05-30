
import { TooltipProvider } from "@/components/ui/tooltip"
import { Toaster } from "@/components/ui/toaster"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { BrowserRouter, Route, Routes } from "react-router-dom"
import { AuthProvider } from "./context/AuthContext"
import { UserProvider } from "./context/UserProvider"
import Dashboard from "./pages/Dashboard"
import Documents from "./pages/Documents"
import EstatePlanning from "./pages/EstatePlanning"
import LegacyVault from "./pages/LegacyVault"
import NotFound from "./pages/NotFound"
import Professionals from "./pages/Professionals"
import Settings from "./pages/Settings"
import { Toaster as Sonner } from "./components/ui/sonner"
import ClientDocuments from "@/pages/ClientDocuments";

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <UserProvider>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/estate-planning" element={<EstatePlanning />} />
                <Route path="/legacy-vault" element={<LegacyVault />} />
                <Route path="/professionals" element={<Professionals />} />
                <Route path="/documents" element={<Documents />} />
                <Route path="/client-documents" element={<ClientDocuments />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </UserProvider>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
