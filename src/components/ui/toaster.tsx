
import { useToast } from "@/hooks/use-toast"
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"

export function Toaster() {
  const { toasts } = useToast()

  return (
    <ToastProvider>
      {toasts
        // Ultra-aggressive filtering to prevent ghost toasts using whitelist approach
        .filter(toast => {
          if (!toast) return false; // Block empty toasts
          
          // Convert toast content to lowercase strings for case-insensitive comparison
          const titleText = (toast.title?.toString() || '').toLowerCase();
          const descriptionText = (toast.description?.toString() || '').toLowerCase();
          
          // Only allow very specific, critical toasts
          const allowedPatterns = [
            "error loading financial plans",
            "unknown error creating plan",
            "you don't have permission"
          ];
          
          // Only allow toasts that match our whitelist
          return allowedPatterns.some(pattern => 
            titleText.includes(pattern) || descriptionText.includes(pattern)
          );
        })
        .map(function (toast) {
          if (!toast) return null;
          
          const { action, ...props } = toast;
          
          return (
            <Toast key={toast.title} {...props}>
              <div className="grid gap-1">
                {toast.title && <ToastTitle>{toast.title}</ToastTitle>}
                {toast.description && (
                  <ToastDescription>{toast.description}</ToastDescription>
                )}
              </div>
              {action}
              <ToastClose />
            </Toast>
          );
        })}
      <ToastViewport />
    </ToastProvider>
  )
}
