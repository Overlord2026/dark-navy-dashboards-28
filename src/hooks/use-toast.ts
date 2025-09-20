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
    };

export type ToastHandle = { id?: string | number; dismiss: () => void; update: () => void };

type ToastAPI = ((input: ToastInput) => ToastHandle) & {
  success: (input: ToastInput, opts?: { duration?: number }) => ToastHandle;
  error: (input: ToastInput, opts?: { duration?: number }) => ToastHandle;
  info: (input: ToastInput, opts?: { duration?: number }) => ToastHandle;
  loading: (message: string) => string | number;
  dismiss: (id?: string | number) => void;
  promise: <T>(p: Promise<T>, msgs: { loading: string; success: string; error: string }) => Promise<T>;
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
  
  const msg = toMessage(input);
  if (typeof input === "object" && input !== null && "variant" in input && input.variant === "destructive") {
    sonnerToast.error(msg, { duration });
  } else {
    if (kind === "success") sonnerToast.success(msg, { duration });
    else if (kind === "error") sonnerToast.error(msg, { duration });
    else if (kind === "info") sonnerToast.message(msg, { duration });
    else sonnerToast(msg, { duration });
  }
  return { dismiss: () => {}, update: () => {} };
}

export const toast: ToastAPI = Object.assign(
  (input: ToastInput) => show(input, "base"),
  {
    success: (input: ToastInput, opts?: { duration?: number }) => show(input, "success", opts?.duration),
    error: (input: ToastInput, opts?: { duration?: number }) => show(input, "error", opts?.duration),
    info: (input: ToastInput, opts?: { duration?: number }) => show(input, "info", opts?.duration),
    loading: (message: string) => sonnerToast.loading(message),
    dismiss: (id?: string | number) => sonnerToast.dismiss(id),
    promise: <T>(p: Promise<T>, msgs: { loading: string; success: string; error: string }) =>
      sonnerToast.promise(p, msgs)
  }
);

export function useToast() {
  return { toast };
}

export default toast;