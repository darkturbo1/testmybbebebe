import * as React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";

import { cn } from "@/lib/utils";

interface ProgressProps extends React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> {
  variant?: "default" | "gold" | "mystical";
}

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  ProgressProps
>(({ className, value, variant = "default", ...props }, ref) => {
  const indicatorStyles = {
    default: "bg-primary",
    gold: "bg-gradient-gold shadow-gold",
    mystical: "bg-gradient-mystical shadow-mystical",
  };

  return (
    <ProgressPrimitive.Root
      ref={ref}
      className={cn("relative h-3 w-full overflow-hidden rounded-full bg-secondary/50", className)}
      {...props}
    >
      <ProgressPrimitive.Indicator
        className={cn("h-full w-full flex-1 transition-all duration-500 ease-out", indicatorStyles[variant])}
        style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
      />
    </ProgressPrimitive.Root>
  );
});
Progress.displayName = ProgressPrimitive.Root.displayName;

export { Progress };
