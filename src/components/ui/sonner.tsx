
import { Toaster as Sonner } from "sonner";
import { useTheme } from "@/context/ThemeContext";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme } = useTheme();
  const resolvedTheme = theme === "dark" ? "dark" : "light";

  return (
    <Sonner
      theme={resolvedTheme as ToasterProps["theme"]}
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
      // Add filter function to prevent rendering any toast with "deleted" in the title or description
      filter={(toast) => {
        const titleText = toast.title?.toString().toLowerCase() || '';
        const descriptionText = toast.description?.toString().toLowerCase() || '';
        
        // Filter out any toast that contains any variation of "plan deleted" or just "deleted"
        return !(
          titleText.includes('plan deleted') || 
          descriptionText.includes('plan deleted') ||
          titleText.includes('deleted') || 
          descriptionText.includes('deleted')
        );
      }}
      {...props}
    />
  );
};

export { Toaster };
