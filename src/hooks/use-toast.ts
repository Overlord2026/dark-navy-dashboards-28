import { toast as sonnerToast } from "sonner";
import * as React from "react";

export type ToastInput =
  | string
  | React.ReactNode
  | {
      title?: string;
      description?: React.ReactNode;
      duration?: number;
      variant?: "default" | "destructive";
      action?: React.ReactNode;
    };

export type ToastHandle = { id?: string | number; dismiss: () => void; update: () => void };

type ToastAPI = {
  (input: ToastInput): ToastHandle;
  success: (input: ToastInput, opts?: { duration?: number }) => ToastHandle;
  error: (input: ToastInput, opts?: { duration?: number }) => ToastHandle;
  info: (input: ToastInput, opts?: { duration?: number }) => ToastHandle;
  loading: (message: string) => string | number;
  dismiss: (id?: string | number) => void;
  promise: typeof sonnerToast.promise;
};

function toMessage(input: ToastInput): string {
  if (React.isValidElement(input)) return "";
  if (typeof input === "string") return input;
  if (typeof input === "object" && input !== null && "title" in input) {
    const { title, description } = input;
    const parts = [title, typeof description === "string" ? description : ""].filter(Boolean);
    return parts.join(" — ");
  }
  return "";
}

function show(input: ToastInput, kind: "base" | "success" | "error" | "info", duration?: number): ToastHandle {
  if (React.isValidElement(input)) {
    if (kind === "success") sonnerToast.success(input as any, { duration });
    else if (kind === "error") sonnerToast.error(input as any, { duration });
    else if (kind === "info") sonnerToast.message(input as any, { duration });
    else sonnerToast(input as any, { duration });
    return { dismiss: () => {}, update: () => {} };
  }
  
  if (typeof input === "object" && input !== null && "title" in input) {
    // Handle object with title/description/action - pass to Sonner directly
    const { title, description, action, variant } = input;
    
    // For now, just use the title and description, ignore action
    const message = [title, typeof description === "string" ? description : ""].filter(Boolean).join(" — ");
    
    if (variant === "destructive" || kind === "error") {
      sonnerToast.error(message, { duration });
    } else if (kind === "success") {
      sonnerToast.success(message, { duration });
    } else if (kind === "info") {
      sonnerToast.message(message, { duration });
    } else {
      sonnerToast(message, { duration });
    }
    return { dismiss: () => {}, update: () => {} };
  }
  
  const msg = toMessage(input);
  if (kind === "success") sonnerToast.success(msg, { duration });
  else if (kind === "error") sonnerToast.error(msg, { duration });
  else if (kind === "info") sonnerToast.message(msg, { duration });
  else sonnerToast(msg, { duration });
  return { dismiss: () => {}, update: () => {} };
}

const baseToast = (input: ToastInput): ToastHandle => show(input, "base");

baseToast.success = (input: ToastInput, opts?: { duration?: number }) => show(input, "success", opts?.duration);
baseToast.error = (input: ToastInput, opts?: { duration?: number }) => show(input, "error", opts?.duration);
baseToast.info = (input: ToastInput, opts?: { duration?: number }) => show(input, "info", opts?.duration);
baseToast.loading = (message: string) => sonnerToast.loading(message);
baseToast.dismiss = (id?: string | number) => sonnerToast.dismiss(id);
baseToast.promise = <T>(p: Promise<T>, msgs: { loading: string; success: string; error: string }) =>
  sonnerToast.promise(p, msgs);

export const toast = baseToast as any as ToastAPI;

export function useToast() {
  return { toast };
}

export default toast;