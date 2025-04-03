
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
        // Filter out ALL plan deleted notifications completely
        .filter(toast => {
          // Convert toast content to lowercase strings for case-insensitive comparison
          const titleText = (toast.title?.toString() || '').toLowerCase();
          const descriptionText = (toast.description?.toString() || '').toLowerCase();
          
          // Filter out any toast that contains any variation of "plan deleted", "deleted plan", or just "deleted"
          return !(
            titleText.includes('plan deleted') || 
            descriptionText.includes('plan deleted') ||
            titleText.includes('deleted plan') || 
            descriptionText.includes('deleted plan') ||
            titleText.includes('deleted') || 
            descriptionText.includes('deleted')
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
    </ToastProvider>
  )
}
