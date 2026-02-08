import type { LucideIcon } from "lucide-react";
import { Loader2 } from "lucide-react";
import { Button } from "./ui/button";

interface SubmitButtonProps {
  isLoading: boolean;
  children: React.ReactNode;
  icon?: LucideIcon;
  className?: string;
}

const SubmitButton = ({
  isLoading,
  children,
  icon: Icon,
  className,
}: SubmitButtonProps) => {
  return (
    <Button
      type="submit"
      disabled={isLoading}
      aria-busy={isLoading}
      className={`gap-2 transition-all ${className ?? ""}`}
    >
      {isLoading ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>{children}</span>
        </>
      ) : (
        <>
          {Icon && <Icon className="h-4 w-4" />}
          <span>{children}</span>
        </>
      )}
    </Button>
  );
};

export default SubmitButton;
