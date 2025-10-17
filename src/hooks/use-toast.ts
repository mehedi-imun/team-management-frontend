import { toast as sonnerToast } from "sonner";

type ToastProps = {
  title?: string;
  description?: string;
  variant?: "default" | "destructive";
  duration?: number;
};

export const useToast = () => {
  const toast = ({
    title,
    description,
    variant,
    duration = 3000,
  }: ToastProps) => {
    if (variant === "destructive") {
      sonnerToast.error(title || "Error", {
        description,
        duration,
      });
    } else {
      sonnerToast.success(title || "Success", {
        description,
        duration,
      });
    }
  };

  return { toast };
};
