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

    // Build message - avoid JSX in this context, use string concat
    const msg = [title, description].filter(Boolean).join(" - ");
    
    if (variant === "destructive") {
      sonnerToast.error(msg, { duration });
    } else {
      sonnerToast(msg, { duration });
    }
    
    return { id: "", dismiss: () => {}, update: () => {} };
  }

  return { toast };
}

export const toast = (m: ToastOptions | string | ReactNode) => useToast().toast(m);