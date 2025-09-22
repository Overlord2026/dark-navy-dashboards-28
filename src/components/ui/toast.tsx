/** 
 * Provider-free shim; see SafeToastProvider for the actual Sonner toaster.
 * This file ensures no Radix UI toast components are used.
 */
import * as React from "react";

// Ensure React is properly initialized
if (!React || typeof React.createElement !== 'function') {
  throw new Error('React runtime not properly initialized in toast.tsx');
}

export const ToastProvider: React.FC<{children: React.ReactNode}> = ({ children }) => <>{children}</>;
export const ToastViewport: React.FC = () => null;
export const Toast: React.FC<{children?: React.ReactNode}> = ({ children }) => <>{children}</>;
export const ToastTitle: React.FC<{children?: React.ReactNode}> = ({ children }) => <>{children}</>;
export const ToastDescription: React.FC<{children?: React.ReactNode}> = ({ children }) => <>{children}</>;
export const ToastAction: React.FC<{children?: React.ReactNode}> = ({ children }) => <>{children}</>;
export const ToastClose: React.FC = () => null;

export type ToastProps = Record<string, never>;
export type ToastActionElement = React.ReactElement | null;

export default {};
