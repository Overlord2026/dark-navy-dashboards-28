import { toast as sonnerToast } from "sonner";
import { ReactNode } from "react";

export type ToastOptions = {
  title?: string;
  description?: string;
  duration?: number;
  variant?: "default" | "destructive";
  action?: ReactNode;
};

export function useToast() {
  function toast(opts: ToastOptions | string) {
    if (typeof opts === "string") {
      sonnerToast(opts);
      return { id: '', dismiss: () => {}, update: () => {} };
    }
    
    const { title, description, duration, variant, action } = opts;
    
    // Handle different toast types based on variant
    if (variant === "destructive") {
      const msg = [title, description].filter(Boolean).join(" — ");
      sonnerToast.error(msg, { duration, action });
    } else {
      const msg = [title, description].filter(Boolean).join(" — ");
      sonnerToast(msg, { duration, action });
    }
    
    return { id: '', dismiss: () => {}, update: () => {} };
  }

  // Helper methods for common toast types
  toast.success = (message: string, opts?: Omit<ToastOptions, 'title' | 'description'>) => {
    sonnerToast.success(message, opts);
    return { id: '', dismiss: () => {}, update: () => {} };
  };

  toast.error = (message: string, opts?: Omit<ToastOptions, 'title' | 'description'>) => {
    sonnerToast.error(message, opts);
    return { id: '', dismiss: () => {}, update: () => {} };
  };

  toast.info = (message: string, opts?: Omit<ToastOptions, 'title' | 'description'>) => {
    sonnerToast.info(message, opts);
    return { id: '', dismiss: () => {}, update: () => {} };
  };

  return { toast };
}

export const toast = Object.assign(
  (opts: ToastOptions | string) => {
    if (typeof opts === "string") {
      sonnerToast(opts);
      return { id: '', dismiss: () => {}, update: () => {} };
    }
    
    const { title, description, duration, variant, action } = opts;
    
    if (variant === "destructive") {
      const msg = [title, description].filter(Boolean).join(" — ");
      sonnerToast.error(msg, { duration, action });
    } else {
      const msg = [title, description].filter(Boolean).join(" — ");
      sonnerToast(msg, { duration, action });
    }
    
    return { id: '', dismiss: () => {}, update: () => {} };
  },
  {
    success: (message: string, opts?: Omit<ToastOptions, 'title' | 'description'>) => {
      sonnerToast.success(message, opts);
      return { id: '', dismiss: () => {}, update: () => {} };
    },
    error: (message: string, opts?: Omit<ToastOptions, 'title' | 'description'>) => {
      sonnerToast.error(message, opts);
      return { id: '', dismiss: () => {}, update: () => {} };
    },
    info: (message: string, opts?: Omit<ToastOptions, 'title' | 'description'>) => {
      sonnerToast.info(message, opts);
      return { id: '', dismiss: () => {}, update: () => {} };
    }
  }
);