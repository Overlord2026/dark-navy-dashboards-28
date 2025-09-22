/**
 * Re-export standardized toast functionality from hooks
 * This ensures all toast usage goes through Sonner, not Radix UI
 */
import { useToast, toast } from "@/hooks/use-toast";

export { useToast, toast };
