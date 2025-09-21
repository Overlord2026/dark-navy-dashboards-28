import { useEffect, useState, type ReactNode } from 'react';

export type CTAStickyBarProps = {
  children?: ReactNode;
  text?: string;
  actionLabel?: string;
  onAction?: () => void;
  dismissible?: boolean;
};

export function CTAStickyBar({
  children,
  text = 'Ready to proceed?',
  actionLabel = 'Continue',
  onAction,
  dismissible = true,
}: CTAStickyBarProps) {
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(true);

  useEffect(() => { setMounted(true); }, []);

  if (!mounted || !open) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex items-center justify-between gap-4 p-4">
        <div className="text-sm text-muted-foreground">
          {children ?? text}
        </div>
        <div className="flex items-center gap-2">
          <button
            className="inline-flex items-center rounded-md border px-3 py-2 text-sm hover:bg-muted"
            onClick={onAction}
          >
            {actionLabel}
          </button>
          {dismissible && (
            <button
              className="inline-flex items-center rounded-md px-2 py-2 text-xs text-muted-foreground hover:text-foreground"
              onClick={() => setOpen(false)}
              aria-label="Dismiss"
            >
              Dismiss
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// Default export for sites that import default
export default CTAStickyBar;