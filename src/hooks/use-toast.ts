import { toast as sonner } from "sonner";

type ToastInput = string | { 
  title?: string; 
  description?: string; 
  variant?: "default" | "destructive"; 
  duration?: number; 
};

/**
 * Provider-free toast API - no React hooks or dependencies
 */
function createToast(input: ToastInput | any, options?: any) {
  // Handle object format: toast({ title: "...", description: "..." })  
  if (typeof input === "object" && input !== null && !Array.isArray(input)) {
    const { title, description, variant, duration } = input;
    const message = title && description ? `${title}: ${description}` : title || description || "Notification";
    
    const toastOptions = { duration, ...options };
    
    if (variant === "destructive") {
      return sonner.error(message, toastOptions);
    } else {
      return sonner.success(message, toastOptions);
    }
  }
  
  // Handle string format: toast("message") or any other format
  return sonner(input, options);
}

// Create toast object with all Sonner methods
const toast = Object.assign(createToast, {
  success: (msg: any, opts?: any) => sonner.success(msg, opts),
  error: (msg: any, opts?: any) => sonner.error(msg, opts), 
  info: (msg: any, opts?: any) => sonner.info ? sonner.info(msg, opts) : sonner(msg, opts),
  loading: (msg: any, opts?: any) => sonner.loading(msg, opts),
  dismiss: sonner.dismiss,
  promise: sonner.promise
});

/**
 * Hook-style export for backward compatibility (but no actual React hooks)
 */
export function useToast() {
  return { toast };
}

export { toast };
export default useToast;