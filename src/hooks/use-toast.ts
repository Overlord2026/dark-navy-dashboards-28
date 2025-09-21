import { toast as sonnerToast } from "sonner";
import * as React from "react";

// Ensure React is properly initialized
if (!React || typeof React.createElement !== 'function') {
  throw new Error('React runtime not properly initialized in use-toast');
}

export type ToastObject = {
  title?: React.ReactNode;
  description?: React.ReactNode;
  duration?: number;
  variant?: "default" | "destructive";
  action?: React.ReactNode; // NEW: keep legacy call sites compiling
};

export type ToastInput = string | React.ReactNode | ToastObject;

export type ToastHandle = { id?: string | number; dismiss: () => void; update: () => void };

type ToastAPI = ((input: ToastInput) => ToastHandle) & {
  success: (input: ToastInput, opts?: { duration?: number }) => ToastHandle;
  error:   (input: ToastInput, opts?: { duration?: number }) => ToastHandle;
  info:    (input: ToastInput, opts?: { duration?: number }) => ToastHandle;
  loading: (message: string) => string | number;
  dismiss: (id?: string | number) => void;
  promise: <T>(
    p: Promise<T>,
    msgs: { loading: string; success: string; error: string }
  ) => string | number;
};

function composeNode(obj: ToastObject): React.ReactNode {
  const { title, description, action } = obj || {};
  return React.createElement(
    'div',
    { className: 'space-y-2' },
    title ? React.createElement('div', {}, React.createElement('strong', {}, title)) : null,
    typeof description === "string" ? React.createElement('div', {}, description) : description,
    action ? React.createElement('div', {}, action) : null
  );
}

function show(input: ToastInput, kind: "base" | "success" | "error" | "info", duration?: number): ToastHandle {
  // If a ReactNode was passed directly, render it as-is
  if (React.isValidElement(input)) {
    const node = input as React.ReactNode;
    if (kind === "success") sonnerToast.success(node, { duration });
    else if (kind === "error") sonnerToast.error(node, { duration });
    else if (kind === "info") sonnerToast.message(node, { duration });
    else sonnerToast(node, { duration });
    return { dismiss: () => {}, update: () => {} };
  }

  // If string, handle directly
  if (typeof input === "string") {
    if (kind === "success") sonnerToast.success(input, { duration });
    else if (kind === "error") sonnerToast.error(input, { duration });
    else if (kind === "info") sonnerToast.message(input, { duration });
    else sonnerToast(input, { duration });
    return { dismiss: () => {}, update: () => {} };
  }

  // Must be ToastObject at this point
  const obj = input as ToastObject;
  const node = composeNode(obj);
  const dur = obj?.duration ?? duration;
  if (obj?.variant === "destructive" || kind === "error") {
    sonnerToast.error(node, { duration: dur });
  } else if (kind === "success") {
    sonnerToast.success(node, { duration: dur });
  } else if (kind === "info") {
    sonnerToast.message(node, { duration: dur });
  } else {
    sonnerToast(node, { duration: dur });
  }
  return { dismiss: () => {}, update: () => {} };
}

export const toast: ToastAPI = Object.assign(
  (input: ToastInput) => show(input, "base"),
  {
    success: (input: ToastInput, opts?: { duration?: number }) => show(input, "success", opts?.duration),
    error:   (input: ToastInput, opts?: { duration?: number }) => show(input, "error",   opts?.duration),
    info:    (input: ToastInput, opts?: { duration?: number }) => show(input, "info",    opts?.duration),
    loading: (message: string) => sonnerToast.loading(message),
    dismiss: (id?: string | number) => sonnerToast.dismiss(id),
    promise: <T,>(p: Promise<T>, msgs: { loading: string; success: string; error: string }) =>
      sonnerToast.promise(p, { loading: msgs.loading, success: msgs.success, error: msgs.error })
  }
);

export function useToast() {
  return { toast };
}

export default toast;