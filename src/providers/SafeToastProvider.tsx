import { useEffect, useState } from "react";
import { Toaster } from "sonner";
export function SafeToastProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return (<>{children}{mounted && <Toaster richColors closeButton />}</>);
}
export default SafeToastProvider;
