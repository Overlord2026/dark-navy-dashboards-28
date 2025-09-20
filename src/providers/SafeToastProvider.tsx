import { ReactNode } from "react";
import { Toaster } from "@/components/ui/toaster";

export default function SafeToastProvider({ children }: { children: ReactNode }) {
  return <>{children}<Toaster /></>;
}