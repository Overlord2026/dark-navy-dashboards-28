/** 
 * No-op shim for @radix-ui/react-toast to prevent dual React instances
 * This file replaces all Radix toast imports to avoid hook context conflicts
 */
import type { ReactNode } from "react";

export function ToastProvider({ children }: { children?: ReactNode }) {
  return <>{children}</>;
}

export function ToastViewport() { 
  return null; 
}

export function Toast({ children }: { children?: ReactNode }) { 
  return <>{children}</>; 
}

export function ToastTitle({ children }: { children?: ReactNode }) { 
  return <>{children}</>; 
}

export function ToastDescription({ children }: { children?: ReactNode }) { 
  return <>{children}</>; 
}

export function ToastAction({ children }: { children?: ReactNode }) { 
  return <>{children}</>; 
}

export function ToastClose() { 
  return null; 
}

// Aliases for different import patterns
export const Root = Toast;
export const Title = ToastTitle;
export const Description = ToastDescription;
export const Action = ToastAction;
export const Close = ToastClose;
export const Viewport = ToastViewport;
export const Provider = ToastProvider;

export default {
  ToastProvider, 
  ToastViewport, 
  Toast, 
  ToastTitle, 
  ToastDescription, 
  ToastAction, 
  ToastClose,
  Root: Toast, 
  Title: ToastTitle, 
  Description: ToastDescription, 
  Action: ToastAction,
  Close: ToastClose,
  Viewport: ToastViewport,
  Provider: ToastProvider,
};