import { toast as sonnerToast } from "sonner";
import * as React from "react";

export type ToastInput =
  | string
  | {
      title?: string;
      description?: React.ReactNode;
      duration?: number;
      variant?: "default" | "destructive";
    };

type ToastHandler = ((input: ToastInput) => void) & {
  success: (input: ToastInput, opts?: { duration?: number }) => void;
  error: (input: ToastInput, opts?: { duration?: number }) => void;
  info: (input: ToastInput, opts?: { duration?: number }) => void;
  loading: (message: string) => string | number;     // returns id
  dismiss: (id?: string | number) => void;
  promise: <T>(
    promise: Promise<T>,
    msgs: { loading: string; success: string; error: string }
  ) => Promise<T>;
};

function toMessage(input: ToastInput) {
  if (typeof input === "string") return input;
  const { title, description } = input;
  if (title && description) return `${title} — ${typeof description === "string" ? description : ""}`.trim();
  return (title ?? (typeof description === "string" ? description : "")) || "";
}

const toast = ((input: ToastInput) => {
  const opts = { duration: typeof input === "string" ? undefined : input.duration };
  const message = toMessage(input);
  
  if (typeof input !== "string" && input.variant === "destructive") {
    sonnerToast.error(message, opts);
  } else {
    sonnerToast(message, opts);
  }
}) as ToastHandler;

toast.success = (input, opts) =>
  sonnerToast.success(toMessage(input), opts);
toast.error = (input, opts) =>
  sonnerToast.error(toMessage(input), opts);
toast.info = (input, opts) =>
  sonnerToast.message(toMessage(input), opts);
toast.loading = (message) => sonnerToast.loading(message);
toast.dismiss = (id) => sonnerToast.dismiss(id);
toast.promise = (p, msgs) =>
  sonnerToast.promise(p, {
    loading: msgs.loading,
    success: msgs.success,
    error: msgs.error,
  });

export function useToast() {
  // Backward compatible signature: callers destructure { toast }
  return { toast };
}

// Also export default for modules that import default
export default toast;