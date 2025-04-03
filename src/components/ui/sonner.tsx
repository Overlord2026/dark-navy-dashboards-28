
import { Toaster as Sonner } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner> & {
  // Add filter property to the ToasterProps type
  filter?: (toast: any) => boolean;
};

export function Toaster({ ...props }: ToasterProps) {
  return (
    <Sonner
      theme="dark"
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-muted-foreground",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
        },
      }}
      // Ultra-aggressive filtering to prevent any ghost toasts
      filter={(toast) => {
        if (!toast) return false; // Block empty toasts
        
        // Convert toast content to lowercase strings for case-insensitive comparison
        const titleText = (toast.title?.toString() || '').toLowerCase();
        const descriptionText = (toast.description?.toString() || '').toLowerCase();
        
        // Only allow very specific toasts related to critical user actions
        // Whitelist approach instead of blacklist
        const allowedPatterns = [
          "error loading financial plans",
          "unknown error creating plan",
          "you don't have permission"
        ];
        
        // Only allow toasts that match our whitelist
        return allowedPatterns.some(pattern => 
          titleText.includes(pattern) || descriptionText.includes(pattern)
        );
      }}
      {...props}
    />
  );
}
