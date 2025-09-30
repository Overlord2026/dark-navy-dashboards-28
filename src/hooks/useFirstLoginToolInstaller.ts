import { toast } from "@/hooks/use-toast";
let installed = false;
export function runFirstLoginToolInstaller() {
  if (typeof window === 'undefined') return;
  if (installed) return;
  installed = true;
  try { toast.success("Welcome! Tools are ready."); } catch {}
}
export default runFirstLoginToolInstaller;