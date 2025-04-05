
import { toast } from "sonner";

type ToastProps = {
  title?: string;
  description?: string;
  action?: React.ReactElement;
  variant?: "default" | "destructive";
};

const useToast = () => {
  const toasts: ToastProps[] = [];

  const showToast = (props: ToastProps) => {
    toast(props.title, {
      description: props.description,
    });
  };

  return {
    toasts,
    toast: showToast,
  };
};

export { useToast, toast };
