
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        interested: "bg-transparent border border-gold-primary text-gold-primary hover:bg-gold-primary/10 font-medium",
        advisor: "bg-[#1EAEDB] hover:bg-[#1EAEDB]/90 text-white font-medium",
        marketplace: "bg-[#0EA5E9] hover:bg-[#0EA5E9]/90 text-white font-medium rounded-lg",
        vault: "bg-[#0a1629] hover:bg-[#0a1629]/90 text-white font-medium shadow-md border border-gray-700",
        warning: "bg-warning text-warning-foreground hover:bg-warning/90",
        success: "bg-success text-success-foreground hover:bg-success/90",
        premium: "bg-gradient-to-r from-gold-premium to-gold-dark text-white hover:from-gold-dark hover:to-gold-premium shadow-lg border border-gold-light/20 font-medium",
        gold: "bg-gold-primary text-primary-foreground hover:bg-gold-premium shadow-md font-medium",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-8 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
        xl: "h-12 rounded-md px-6 py-3 text-base",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
