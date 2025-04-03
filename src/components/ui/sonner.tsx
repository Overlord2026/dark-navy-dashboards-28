
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
      // Custom filter to prevent any "plan deleted" notification from showing
      filter={(toast) => {
        if (!toast) return true;
        
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
      }}
      {...props}
    />
  );
}
