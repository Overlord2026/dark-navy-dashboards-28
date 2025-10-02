import type { ReactNode } from "react";

// Shim to prevent @radix-ui/react-toast from being used
// All toast functionality should use Sonner via @/hooks/use-toast

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  console.warn('⚠️ Radix ToastProvider blocked. Use Sonner via @/hooks/use-toast');
  return <>{children}</>;
};

export const ToastViewport = () => null;
export const Toast = () => null;
export const ToastTitle = () => null;
export const ToastDescription = () => null;
export const ToastClose = () => null;
export const ToastAction = () => null;

export default {
  ToastProvider,
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastClose,
  ToastAction
};
