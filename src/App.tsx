import { TooltipProvider } from "@/components/ui/tooltip"
import { Toaster } from "@/components/ui/toaster"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { BrowserRouter, Route, Routes } from "react-router-dom"
import { AuthProvider } from "./context/AuthContext"
import AccountPage from "./pages/AccountPage"
import Dashboard from "./pages/Dashboard"
import Documents from "./pages/Documents"
import EstatePlanning from "./pages/EstatePlanning"
import Healthcare from "./pages/Healthcare"
import LegacyVault from "./pages/LegacyVault"
import Login from "./pages/Login"
import NotFound from "./pages/NotFound"
import Professionals from "./pages/Professionals"
import ResetPassword from "./pages/ResetPassword"
import Settings from "./pages/Settings"
import Signup from "./pages/Signup"
import Sonner from "./components/ui/sonner"
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
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/account" element={<AccountPage />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/estate-planning" element={<EstatePlanning />} />
              <Route path="/healthcare" element={<Healthcare />} />
              <Route path="/legacy-vault" element={<LegacyVault />} />
              <Route path="/professionals" element={<Professionals />} />
              <Route path="/documents" element={<Documents />} />
              <Route path="*" element={<NotFound />} />
              <Route path="/client-documents" element={<ClientDocuments />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
