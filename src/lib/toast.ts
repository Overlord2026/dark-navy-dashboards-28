import { toast as sonner } from "sonner";

export const toast = {
  ok: (m: string, d?: string) => sonner.success(d ?? m),
  err: (m: string, d?: string) => sonner.error(d ?? m),
  info: (m: string, d?: string) => sonner.message ? sonner.message(d ?? m) : sonner(m),
};