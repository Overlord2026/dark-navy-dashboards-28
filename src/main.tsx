
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { ensureAuditLogsTable } from "./services/security/helpers.ts";
import { ThemeProvider } from "@/context/ThemeContext";

// Check if we need to initialize security infrastructure
ensureAuditLogsTable().catch(console.error);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </React.StrictMode>
);
