
import React from "react";
import { 
  Dialog, 
  DialogContent,
  DialogTrigger 
} from "@/components/ui/dialog";
import { ThemeSwitcher } from "./ThemeSwitcher";
import { useTheme } from "@/context/ThemeContext";

export function ThemeDialog({ trigger, open, onOpenChange }: { 
  trigger?: React.ReactNode,
  open?: boolean,
  onOpenChange?: (open: boolean) => void
}) {
  const { theme } = useTheme();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className={`sm:max-w-[425px] ${theme === "light" ? "bg-[#F9F7E8] text-[#222222] border-[#DCD8C0]" : ""}`}>
        <ThemeSwitcher onClose={() => onOpenChange && onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  );
}
