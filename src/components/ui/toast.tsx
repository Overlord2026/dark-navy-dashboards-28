/** Provider-free shim; see src/components/ui/toaster.tsx for the actual Sonner toaster. */
import * as React from "react";
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
