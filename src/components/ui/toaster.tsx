
import { useToast } from "@/hooks/use-toast"
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"

export function Toaster() {
  const { toasts } = useToast()

  return (
    <>
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
        .map(function ({ id, title, description, action, ...props }) {
          return (
            <Toast key={id} {...props}>
              <div className="grid gap-1">
                {title && <ToastTitle>{title}</ToastTitle>}
                {description && (
                  <ToastDescription>{description}</ToastDescription>
                )}
              </div>
              {action}
              <ToastClose />
            </Toast>
          )
        })}
      <ToastViewport />
    </>
  )
}
