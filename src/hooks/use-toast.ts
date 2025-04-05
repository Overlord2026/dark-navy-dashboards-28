
import React from "react";
import { toast as sonnerToast } from "sonner";

export interface ToastProps {
  title?: string;
  description?: string;
  action?: React.ReactElement;
  variant?: "default" | "destructive";
  duration?: number;
}

const useToast = () => {
  const toasts: ToastProps[] = [];

  const showToast = (props: ToastProps) => {
    sonnerToast(props.title, {
      description: props.description,
      action: props.action,
      duration: props.duration,
    });
  };

  return {
    toasts,
    toast: showToast,
  };
};

// Re-export sonner toast for direct usage
export { useToast, sonnerToast as toast };
