import React, { createContext, useContext, useMemo, useState } from 'react';
import { cn } from '@/lib/utils';

type DivProps = React.HTMLAttributes<HTMLDivElement>;
type BtnProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

type SidebarCtx = { 
  collapsed: boolean; 
  open: boolean; 
  toggle: () => void; 
  setOpen: (v: boolean) => void 
};

const Ctx = createContext<SidebarCtx | null>(null);

export function useSidebar(): SidebarCtx {
  const ctx = useContext(Ctx);
  if (!ctx) {
    // default no-op context (keeps usage safe if hook is called outside provider)
    return { collapsed: false, open: true, toggle: () => {}, setOpen: () => {} };
  }
  return ctx;
}

export function SidebarProvider({ 
  children, 
  className,
  collapsedWidth = 64,
  ...rest 
}: DivProps & { collapsedWidth?: number }) {
  const [open, setOpen] = useState(true);
  const [collapsed, setCollapsed] = useState(false);
  
  const value = useMemo(() => ({ 
    collapsed,
    open, 
    toggle: () => setCollapsed(v => !v), 
    setOpen 
  }), [collapsed, open]);
  
  return (
    <Ctx.Provider value={value}>
      <div className={cn("min-h-screen", className)} {...rest}>
        {children}
      </div>
    </Ctx.Provider>
  );
}

export function Sidebar({ 
  children, 
  className, 
  collapsible,
  ...rest 
}: DivProps & { collapsible?: boolean }) {
  const { collapsed } = useSidebar();
  return (
    <aside 
      className={cn(
        "h-screen sticky top-0 border-r border-border bg-background/95 backdrop-blur transition-all duration-200",
        collapsed ? "w-14" : "w-60",
        className
      )} 
      {...rest}
    >
      {children}
    </aside>
  );
}

export function SidebarContent({ children, className, ...rest }: DivProps) {
  return (
    <div className={cn("flex flex-col h-full", className)} {...rest}>
      {children}
    </div>
  );
}

export function SidebarGroup({ 
  children, 
  className, 
  open = true,
  ...rest 
}: DivProps & { open?: boolean }) {
  return (
    <div className={cn("px-3 py-2", className)} {...rest}>
      {children}
    </div>
  );
}

export function SidebarGroupLabel({ children, className, ...rest }: DivProps) {
  const { collapsed } = useSidebar();
  if (collapsed) return null;
  
  return (
    <div 
      className={cn("px-2 py-1 text-xs font-semibold text-muted-foreground uppercase tracking-wider", className)} 
      {...rest}
    >
      {children}
    </div>
  );
}

export function SidebarGroupContent({ children, className, ...rest }: DivProps) {
  return (
    <div className={cn("space-y-1", className)} {...rest}>
      {children}
    </div>
  );
}

export function SidebarMenu({ children, className, ...rest }: DivProps) {
  return (
    <nav className={cn("flex flex-col gap-1", className)} {...rest}>
      {children}
    </nav>
  );
}

export function SidebarMenuItem({ children, className, ...rest }: DivProps) {
  return (
    <div className={cn("w-full", className)} {...rest}>
      {children}
    </div>
  );
}

export function SidebarMenuButton({ 
  children, 
  className, 
  asChild,
  ...rest 
}: { asChild?: boolean } & React.HTMLAttributes<HTMLDivElement>) {
  const { collapsed } = useSidebar();
  
  if (asChild) {
    return (
      <div className={cn("w-full", className)} {...rest}>
        {children}
      </div>
    );
  }
  
  return (
    <div
      className={cn(
        "w-full flex items-center gap-2 rounded-md px-3 py-2 text-sm text-foreground transition-colors cursor-pointer",
        "hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-ring",
        collapsed && "justify-center px-2",
        className
      )}
      {...rest}
    >
      {children}
    </div>
  );
}

export function SidebarTrigger({ className, ...rest }: BtnProps) {
  const { toggle } = useSidebar();
  return (
    <button
      type="button"
      onClick={toggle}
      className={cn(
        "inline-flex items-center justify-center rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        className
      )}
      aria-label="Toggle sidebar"
      {...rest}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect width="18" height="18" x="3" y="3" rx="2" ry="2"/>
        <line x1="9" y1="9" x2="15" y2="9"/>
        <line x1="9" y1="15" x2="15" y2="15"/>
      </svg>
    </button>
  );
}
