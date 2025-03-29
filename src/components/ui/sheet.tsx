
import * as SheetPrimitive from "@radix-ui/react-dialog"
import { cva, type VariantProps } from "class-variance-authority"
import { ChevronDown, X } from "lucide-react"
import * as React from "react"
import { useState } from "react"

import { cn } from "@/lib/utils"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./collapsible"

const Sheet = SheetPrimitive.Root

const SheetTrigger = SheetPrimitive.Trigger

const SheetClose = SheetPrimitive.Close

const SheetPortal = SheetPrimitive.Portal

const SheetOverlay = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Overlay
    className={cn(
      "fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    )}
    {...props}
    ref={ref}
  />
))
SheetOverlay.displayName = SheetPrimitive.Overlay.displayName

const sheetVariants = cva(
  "fixed z-50 gap-4 bg-background p-6 shadow-lg transition ease-in-out data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:duration-300 data-[state=open]:duration-500",
  {
    variants: {
      side: {
        top: "inset-x-0 top-0 border-b data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top",
        bottom:
          "inset-x-0 bottom-0 border-t data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom",
        left: "inset-y-0 left-0 h-full w-3/4 border-r data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left sm:max-w-sm",
        right:
          "inset-y-0 right-0 h-full w-3/4 border-l data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right sm:max-w-sm",
      },
    },
    defaultVariants: {
      side: "right",
    },
  }
)

interface SheetContentProps
  extends React.ComponentPropsWithoutRef<typeof SheetPrimitive.Content>,
  VariantProps<typeof sheetVariants> { }

const SheetContent = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Content>,
  SheetContentProps
>(({ side = "right", className, children, ...props }, ref) => (
  <SheetPortal>
    <SheetOverlay />
    <SheetPrimitive.Content
      ref={ref}
      className={cn(sheetVariants({ side }), className)}
      {...props}
    >
      {children}
      <SheetPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary">
        <X className="h-4 w-4" />
        <span className="sr-only">Close</span>
      </SheetPrimitive.Close>
    </SheetPrimitive.Content>
  </SheetPortal>
))
SheetContent.displayName = SheetPrimitive.Content.displayName

const SheetHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col space-y-2 text-center sm:text-left",
      className
    )}
    {...props}
  />
)
SheetHeader.displayName = "SheetHeader"

const SheetFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
      className
    )}
    {...props}
  />
)
SheetFooter.displayName = "SheetFooter"

const SheetTitle = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Title>
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Title
    ref={ref}
    className={cn("text-lg font-semibold text-foreground", className)}
    {...props}
  />
))
SheetTitle.displayName = SheetPrimitive.Title.displayName

const SheetDescription = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Description>
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Description
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
SheetDescription.displayName = SheetPrimitive.Description.displayName

// New component for investment sections
const SheetSection = ({
  className,
  title,
  icon,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  title: string;
  icon?: React.ReactNode;
}) => (
  <div className={cn("pb-6", className)} {...props}>
    <h3 className="text-lg font-bold mb-3 flex items-center">
      {icon && <span className="mr-2">{icon}</span>}
      {title}
    </h3>
    <div className="bg-slate-100 dark:bg-slate-800/50 p-4 rounded-md">
      {children}
    </div>
  </div>
)
SheetSection.displayName = "SheetSection"

// Updated component for investment detail rows with expandable content
interface SheetDetailRowProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string;
  value: React.ReactNode;
  detailedInfo?: React.ReactNode;
}

const SheetDetailRow = ({
  label,
  value,
  detailedInfo,
  className,
  ...props
}: SheetDetailRowProps) => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className={cn("border-b border-border last:border-b-0", className)}
      {...props}
    >
      <CollapsibleTrigger asChild>
        <div className="p-3 flex justify-between items-center cursor-pointer hover:bg-slate-800/30 transition-colors">
          <span className="text-muted-foreground">{label}</span>
          <div className="flex items-center">
            <span className="font-medium mr-2">{value}</span>
            {detailedInfo && (
              <ChevronDown className={cn(
                "h-4 w-4 transition-transform", 
                isOpen ? "transform rotate-180" : ""
              )} />
            )}
          </div>
        </div>
      </CollapsibleTrigger>
      {detailedInfo && (
        <CollapsibleContent>
          <div className="p-3 pt-0 pl-6 text-sm bg-slate-800/20">
            {detailedInfo}
          </div>
        </CollapsibleContent>
      )}
    </Collapsible>
  );
};

SheetDetailRow.displayName = "SheetDetailRow"

// New component for strategy section with a better readable format
const SheetStrategySection = ({
  className,
  title,
  icon,
  strategy,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  title: string;
  icon?: React.ReactNode;
  strategy: string;
}) => (
  <div className={cn("pb-6", className)} {...props}>
    <h3 className="text-lg font-bold mb-3 flex items-center">
      {icon && <span className="mr-2">{icon}</span>}
      {title}
    </h3>
    <div className="bg-slate-100 dark:bg-slate-800/50 p-5 rounded-md">
      <div className="prose prose-sm dark:prose-invert max-w-none">
        <h4 className="text-sm font-medium text-blue-400 mb-2">Investment Approach</h4>
        <p className="text-gray-300 leading-relaxed mb-4">{strategy}</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 pt-4 border-t border-slate-700/50">
          <div className="bg-slate-800/30 p-3 rounded">
            <h5 className="text-sm font-medium text-blue-400 mb-1">Focus Areas</h5>
            <ul className="list-disc list-inside text-xs text-gray-300 space-y-1">
              {strategy.split('. ').slice(0, 3).map((sentence, idx) => (
                <li key={idx}>{sentence}</li>
              ))}
            </ul>
          </div>
          <div className="bg-slate-800/30 p-3 rounded">
            <h5 className="text-sm font-medium text-blue-400 mb-1">Key Differentiators</h5>
            <ul className="list-disc list-inside text-xs text-gray-300 space-y-1">
              {strategy.split('. ').slice(-2).map((sentence, idx) => (
                <li key={idx}>{sentence}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
)
SheetStrategySection.displayName = "SheetStrategySection"

export {
  Sheet, 
  SheetClose,
  SheetContent, 
  SheetDescription, 
  SheetDetailRow,
  SheetFooter, 
  SheetHeader, 
  SheetOverlay, 
  SheetPortal, 
  SheetSection,
  SheetStrategySection,
  SheetTitle, 
  SheetTrigger
}
