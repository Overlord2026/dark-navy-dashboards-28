"use client";
import { toast as sonner } from "sonner";

// Plain wrapper - no React hooks (Oct 6, 2025)

/**
 * Plain toast wrapper — NO React hooks or providers.
 * Handles both object and string formats for backward compatibility.
 */
function createToast(input: any, options?: any) {
  // Handle object format: toast({ title: "...", description: "...", variant: "..." })
  if (typeof input === "object" && input !== null && !Array.isArray(input)) {
    const { title, description, variant, duration } = input;
    const message = title && description ? `${title}: ${description}` : title || description || "Notification";
    
    if (variant === "destructive") {
      return sonner.error(message, { duration, ...options });
    }
    return sonner.success(message, { duration, ...options });
  }
  
  // Handle string format: toast("message")
  return sonner(input, options);
}

// Create toast object with all Sonner methods
export const toast = Object.assign(createToast, {
  success: sonner.success,
  error: sonner.error,
  info: sonner.info || sonner,
  loading: sonner.loading,
  dismiss: sonner.dismiss,
  promise: sonner.promise
});

/**
 * Legacy hook signature for compatibility.
 * Returns the same toast object, not a React hook.
 */
export function useToast() {
  return { toast };
}

export default toast;
