"use client";
import { toast as sonner } from "sonner";

/**
 * Plain toast wrapper — NO React hooks or providers.
 * Handles both object and string formats.
 */
function createToast(input: any, options?: any) {
  // Handle object format: toast({ title: "...", description: "..." })
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

// Legacy signature some code may expect:
export function useToast() {
  return { toast };
}

export default toast;