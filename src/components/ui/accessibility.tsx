import * as React from "react"
import { cn } from "@/lib/utils"

// High contrast focus ring utility
export const focusRing = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background";

// Skip to content link for keyboard navigation
export const SkipToContent: React.FC = () => (
  <a
    href="#main-content"
    className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-50 bg-primary text-primary-foreground px-4 py-2 rounded-md font-medium"
  >
    Skip to main content
  </a>
);

// Accessible loading spinner
export const LoadingSpinner: React.FC<{ 
  size?: "sm" | "md" | "lg"; 
  className?: string;
  label?: string;
}> = ({ 
  size = "md", 
  className,
  label = "Loading content"
}) => {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6", 
    lg: "w-8 h-8"
  };

  return (
    <div 
      className={cn("animate-spin rounded-full border-2 border-current border-t-transparent", sizeClasses[size], className)}
      role="status"
      aria-label={label}
    >
      <span className="sr-only">{label}</span>
    </div>
  );
};

// Accessible alert component
export const Alert: React.FC<{
  children: React.ReactNode;
  variant?: "info" | "warning" | "error" | "success";
  className?: string;
}> = ({ children, variant = "info", className }) => {
  const variantClasses = {
    info: "bg-blue-50 border-blue-200 text-blue-800",
    warning: "bg-warning/10 border-warning/20 text-warning-foreground",
    error: "bg-destructive/10 border-destructive/20 text-destructive-foreground",
    success: "bg-success/10 border-success/20 text-success-foreground"
  };

  return (
    <div
      className={cn(
        "p-4 border rounded-md",
        variantClasses[variant],
        className
      )}
      role="alert"
      aria-live="polite"
    >
      {children}
    </div>
  );
};

// Accessible button with proper ARIA attributes
export const AccessibleButton: React.FC<
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: "primary" | "secondary" | "ghost";
    size?: "sm" | "md" | "lg";
    loading?: boolean;
    loadingText?: string;
  }
> = ({ 
  children, 
  variant = "primary", 
  size = "md", 
  loading = false,
  loadingText = "Loading...",
  disabled,
  className,
  ...props 
}) => {
  const baseClasses = "inline-flex items-center justify-center gap-2 rounded-md font-medium transition-colors";
  const focusClasses = focusRing;
  
  const variantClasses = {
    primary: "bg-primary text-primary-foreground hover:bg-primary/90",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
    ghost: "hover:bg-accent hover:text-accent-foreground"
  };

  const sizeClasses = {
    sm: "h-8 px-3 text-sm",
    md: "h-10 px-4 py-2",
    lg: "h-11 px-8"
  };

  return (
    <button
      className={cn(
        baseClasses,
        focusClasses,
        variantClasses[variant],
        sizeClasses[size],
        (disabled || loading) && "opacity-50 cursor-not-allowed",
        className
      )}
      disabled={disabled || loading}
      aria-disabled={disabled || loading}
      {...props}
    >
      {loading && <LoadingSpinner size="sm" className="mr-2" />}
      {loading ? loadingText : children}
    </button>
  );
};