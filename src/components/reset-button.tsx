import { Loader2, RotateCcw } from "lucide-react";
import { Button } from "./ui/button";

interface ResetButtonProps {
  className?: string;
  children?: React.ReactNode;
  onClick?: () => void;
  isLoading?: boolean;
}

const ResetButton = ({
  className,
  children = "Reset",
  onClick,
  isLoading,
}: ResetButtonProps) => {
  return (
    <Button
      type="reset"
      variant="outline"
      color="secondary"
      onClick={onClick}
      disabled={isLoading}
      className={`
        gap-2 text-muted-foreground
        hover:text-destructive
        hover:border-destructive/50
        focus-visible:ring-destructive/40
        transition-all
        ${className ?? ""}
      `}
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <RotateCcw className="h-4 w-4" />
      )}
      {children}
    </Button>
  );
};

export default ResetButton;
