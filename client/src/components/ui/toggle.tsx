import * as React from "react";

import * as TogglePrimitive from "@radix-ui/react-toggle";
import { type VariantProps, cva } from "class-variance-authority";

import { cn } from "@/lib/utils";

const toggleVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-white transition-colors hover:bg-stone-100 hover:text-stone-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=on]:bg-stone-100 data-[state=on]:text-stone-900 dark:ring-offset-stone-950 dark:hover:bg-stone-800 dark:hover:text-stone-400 dark:focus-visible:ring-stone-300 dark:data-[state=on]:bg-stone-800 dark:data-[state=on]:text-stone-50",
  {
    variants: {
      variant: {
        default: "bg-transparent",
        outline:
          "border border-stone-200 bg-transparent hover:bg-stone-100 hover:text-stone-900 dark:border-stone-800 dark:hover:bg-stone-800 dark:hover:text-stone-50",
        category:
          "bg-white shadow-xl rounded-full hover:shadow-2xl border hover:bg-stone-100 hover:text-stone-900 dark:bg-stone-950 dark:hover:bg-stone-800 dark:hover:text-stone-50 data-[state=on]:bg-white",
      },
      size: {
        default: "h-10 px-3",
        sm: "h-9 px-2.5",
        lg: "h-11 px-5",
        pill: "h-9 px-3",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

const Toggle = React.forwardRef<
  React.ElementRef<typeof TogglePrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof TogglePrimitive.Root> &
    VariantProps<typeof toggleVariants>
>(({ className, variant, size, ...props }, ref) => (
  <TogglePrimitive.Root
    ref={ref}
    className={cn(toggleVariants({ variant, size, className }))}
    {...props}
  />
));

Toggle.displayName = TogglePrimitive.Root.displayName;

// eslint-disable-next-line react-refresh/only-export-components
export { Toggle, toggleVariants };
