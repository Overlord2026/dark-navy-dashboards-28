
import React from "react";
import { 
  Dialog, 
  DialogContent,
  DialogTrigger 
} from "@/components/ui/dialog";
import { ThemeSwitcher } from "./ThemeSwitcher";

export function ThemeDialog({ trigger, open, onOpenChange }: { 
  trigger?: React.ReactNode,
  open?: boolean,
  onOpenChange?: (open: boolean) => void
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className="sm:max-w-[425px]">
        <ThemeSwitcher onClose={() => onOpenChange && onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  );
}
