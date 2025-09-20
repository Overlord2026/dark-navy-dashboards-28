import { toast as sonnerToast } from "sonner";
import { ReactNode } from "react";

export type ToastOptions = {
  title?: ReactNode;
  description?: ReactNode;
  duration?: number;
  variant?: "default" | "destructive";
  action?: ReactNode;
};

export function useToast() {
  function toast(opts: ToastOptions | string | ReactNode) {
    // Direct string or JSX:
    if (typeof opts === "string" || (opts as any)?.$$typeof) {
      sonnerToast(opts as any);
      return { id: "", dismiss: () => {}, update: () => {} };
    }
    const { title, description, duration, variant } = (opts || {}) as ToastOptions;

    // Build message - handle both strings and ReactNodes
    let content: string | ReactNode;
    if (title && description) {
      content = typeof title === 'string' && typeof description === 'string' 
        ? `${title} - ${description}`
        : description;
    } else {
      content = title || description || '';
    }
    
    if (variant === "destructive") {
      sonnerToast.error(content as any, { duration });
    } else {
      sonnerToast(content as any, { duration });
    }
    
    return { id: "", dismiss: () => {}, update: () => {} };
  }

  return { toast };
}

interface ToastInstance {
  (m: ToastOptions | string | ReactNode): { id: string; dismiss: () => void; update: () => void };
  success: (message: string | ReactNode) => { id: string; dismiss: () => void; update: () => void };
  error: (message: string | ReactNode) => { id: string; dismiss: () => void; update: () => void };
  info: (message: string | ReactNode) => { id: string; dismiss: () => void; update: () => void };
}

const toastInstance = ((m: ToastOptions | string | ReactNode) => useToast().toast(m)) as ToastInstance;

// Add helper methods for common usage patterns
toastInstance.success = (message: string | ReactNode) => useToast().toast({ variant: "default", description: message });
toastInstance.error = (message: string | ReactNode) => useToast().toast({ variant: "destructive", description: message });
toastInstance.info = (message: string | ReactNode) => useToast().toast({ variant: "default", description: message });

export const toast = toastInstance;