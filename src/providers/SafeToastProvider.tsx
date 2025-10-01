import { Toaster } from "sonner";

export function SafeToastProvider({ children }: { children: React.ReactNode }) {
  // No hooks, no effects. Single visual provider at the app root.
  return (
    <>
      {children}
      <Toaster richColors closeButton />
    </>
  );
}

export default SafeToastProvider;
