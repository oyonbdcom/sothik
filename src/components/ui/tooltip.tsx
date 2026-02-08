import { cn } from "@/lib/utils/utils";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

/* ---------------------------------- */
/* Tooltip Variants */
/* ---------------------------------- */

const tooltipVariants = cva(
  "z-50 overflow-hidden rounded-md px-3 py-1.5 text-sm shadow-md \
   animate-in fade-in-0 zoom-in-95 \
   data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 \
   data-[side=bottom]:slide-in-from-top-2 \
   data-[side=left]:slide-in-from-right-2 \
   data-[side=right]:slide-in-from-left-2 \
   data-[side=top]:slide-in-from-bottom-2",
  {
    variants: {
      color: {
        primary: "border border-primary bg-primary text-primary-foreground",
        secondary: "border bg-popover text-popover-foreground",
        warning: "border border-warning bg-warning text-warning-foreground",
        info: "border border-info bg-info text-info-foreground",
        success: "border border-success bg-success text-success-foreground",
        destructive:
          "border border-destructive bg-destructive text-destructive-foreground",
      },
    },
    defaultVariants: {
      color: "primary",
    },
  }
);

/* ---------------------------------- */
/* Types */
/* ---------------------------------- */

type TooltipColor =
  | "primary"
  | "secondary"
  | "warning"
  | "info"
  | "success"
  | "destructive";

interface TooltipContentProps
  extends React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>,
    VariantProps<typeof tooltipVariants> {
  color?: TooltipColor;
}

/* ---------------------------------- */
/* Components */
/* ---------------------------------- */

/** Provider (NO forwardRef – Radix Provider doesn’t support refs) */
const TooltipProvider = ({
  delayDuration = 0,
  ...props
}: React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Provider>) => {
  return <TooltipPrimitive.Provider delayDuration={delayDuration} {...props} />;
};

const Tooltip = TooltipPrimitive.Root;
const TooltipTrigger = TooltipPrimitive.Trigger;
const TooltipArrow = TooltipPrimitive.Arrow;

const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  TooltipContentProps
>(({ className, sideOffset = 4, color, children, ...props }, ref) => {
  return (
    <TooltipPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      className={cn(tooltipVariants({ color }), className)}
      {...props}
    >
      {children}
      <TooltipArrow className="fill-current" />
    </TooltipPrimitive.Content>
  );
});

TooltipContent.displayName = "TooltipContent";

/* ---------------------------------- */
/* Exports */
/* ---------------------------------- */

export {
  Tooltip,
  TooltipArrow,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
};
