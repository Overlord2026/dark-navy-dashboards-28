import * as React from "react";

/** Legacy shim to avoid pulling in @radix-ui/react-toast.
 *  We don't render anything here; real toaster is in src/components/ui/toaster.tsx (Sonner).
 */
export const ToastProvider: React.FC<{children: React.ReactNode}> = ({ children }) => <>{children}</>;
export const ToastViewport: React.FC = () => null;
export const Toast: React.FC<{children?: React.ReactNode}> = ({ children }) => <>{children}</>;
export const ToastTitle: React.FC<{children?: React.ReactNode}> = ({ children }) => <>{children}</>;
export const ToastDescription: React.FC<{children?: React.ReactNode}> = ({ children }) => <>{children}</>;
export const ToastAction: React.FC<{children?: React.ReactNode}> = ({ children }) => <>{children}</>;
export const ToastClose: React.FC = () => null;

export default {};
