"use client";
import type { ReactNode } from "react";
import { Toaster } from "sonner";

/**
 * Single, hydration-safe toast provider with zero hooks.
 * Keep exactly one instance at the app root.
 */
export default function SafeToastProvider({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
      <Toaster richColors />
    </>
  );
}
