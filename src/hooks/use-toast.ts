import { toast as sonner } from "sonner";
import * as React from "react";

type ToastOptions = {
  title?: string;
  description?: string;
  variant?: "default" | "destructive";
  duration?: number;
  action?: React.ReactElement;
};

/**
 * Provider-free toast API that handles both object and direct Sonner formats
 */
function createToast(input: string | React.ReactElement | ToastOptions, options?: any) {
  // Handle React element format: toast(<Element />)
  if (React.isValidElement(input)) {
    return sonner(input, options);
  }
  
  // Handle object format: toast({ title: "...", description: "...", variant: "..." })
  if (typeof input === "object" && input !== null) {
    const { title, description, variant, duration, action } = input as ToastOptions;
    const message = title && description ? `${title}: ${description}` : title || description || "Notification";
    
    const toastOptions = { 
      duration,
      action // Pass action directly as ReactElement
    };
    
    if (variant === "destructive") {
      return sonner.error(message, toastOptions);
    } else {
      return sonner.success(message, toastOptions);
    }
  }
  
  // Handle string format: toast("message")
  return sonner(input as string, options);
}

// Create enhanced toast object with all Sonner methods
const toast = Object.assign(createToast, {
  success: (message: string | ToastOptions | React.ReactElement, options?: any) => {
    if (React.isValidElement(message)) {
      return sonner.success(message, options);
    }
    if (typeof message === "object") {
      const { title, description, duration, action } = message as ToastOptions;
      const msg = title && description ? `${title}: ${description}` : title || description || "Success";
      return sonner.success(msg, { duration, action, ...options });
    }
    return sonner.success(message, options);
  },
  error: (message: string | ToastOptions | React.ReactElement, options?: any) => {
    if (React.isValidElement(message)) {
      return sonner.error(message, options);
    }
    if (typeof message === "object") {
      const { title, description, duration, action } = message as ToastOptions;
      const msg = title && description ? `${title}: ${description}` : title || description || "Error";
      return sonner.error(msg, { duration, action, ...options });
    }
    return sonner.error(message, options);
  },
  info: sonner.info || sonner.message || sonner,
  loading: sonner.loading,
  dismiss: sonner.dismiss,
  promise: sonner.promise
});

/**
 * Hook that returns toast functions for backward compatibility
 */
export function useToast() {
  return { toast };
}

// Export toast for direct imports
export { toast };

// Default export for flexibility
export default useToast;