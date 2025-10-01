import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { SafeToastProvider } from "@/providers/SafeToastProvider";

// Lazy Providers component: import provider modules at render time
function Providers({ children }: { children: React.ReactNode }) {
  const { AuthProvider } = require("@/context/AuthContext");
  const { EntitlementsProvider } = require("@/context/EntitlementsContext");
  const { ToolsProvider } = require("@/contexts/ToolsContext");

  return (
    <SafeToastProvider>
      <AuthProvider>
        <EntitlementsProvider>
          <ToolsProvider>{children}</ToolsProvider>
        </EntitlementsProvider>
      </AuthProvider>
    </SafeToastProvider>
  );
}

const el = document.getElementById("root");
if (!el) throw new Error("Root element #root not found");

createRoot(el).render(
  <StrictMode>
    <BrowserRouter>
      <Providers>
        <App />
      </Providers>
    </BrowserRouter>
  </StrictMode>
);
