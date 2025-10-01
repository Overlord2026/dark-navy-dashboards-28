import React from "react";
import { Toaster } from "sonner";

export function SafeToastProvider({ children }: { children: React.ReactNode }) {
  // Guard SSR/edge rendering without hooks.
  const isClient = typeof window !== "undefined";
  return (
    <>
      {children}
      {isClient ? <Toaster richColors closeButton /> : null}
    </>
  );
}

export default SafeToastProvider;
