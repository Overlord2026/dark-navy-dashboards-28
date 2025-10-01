// React entry point - single root, proper JSX provider hierarchy
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { SafeToastProvider } from "@/providers/SafeToastProvider";
import { AuthProvider } from "@/context/AuthContext";
import { UserProvider } from "@/context/UserContext";
import { EntitlementsProvider } from "@/context/EntitlementsContext";
import { ToolsProvider } from "@/contexts/ToolsContext";

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Root element #root not found");

// Single root instance with proper JSX hierarchy (no function calls)
createRoot(rootElement).render(
  <StrictMode>
    <BrowserRouter>
      <SafeToastProvider>
        <AuthProvider>
          <UserProvider>
            <EntitlementsProvider>
              <ToolsProvider>
                <App />
              </ToolsProvider>
            </EntitlementsProvider>
          </UserProvider>
        </AuthProvider>
      </SafeToastProvider>
    </BrowserRouter>
  </StrictMode>
);