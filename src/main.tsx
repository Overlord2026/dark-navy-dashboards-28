import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { SafeToastProvider } from "@/providers/SafeToastProvider";
import { AuthProvider } from "@/context/AuthContext";
import { EntitlementsProvider } from "@/context/EntitlementsContext";
import { ToolsProvider } from "@/contexts/ToolsContext";
import { logReactIdentity } from "@/debug/reactInspector";

logReactIdentity("main");

const el = document.getElementById("root");
if (!el) throw new Error("Root element #root not found");

createRoot(el).render(
  <StrictMode>
    <BrowserRouter>
      <SafeToastProvider>
        <AuthProvider>
          <EntitlementsProvider>
            <ToolsProvider>
              <App />
            </ToolsProvider>
          </EntitlementsProvider>
        </AuthProvider>
      </SafeToastProvider>
    </BrowserRouter>
  </StrictMode>
);
