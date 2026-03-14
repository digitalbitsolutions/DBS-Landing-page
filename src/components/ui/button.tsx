import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-sm whitespace-nowrap text-sm font-semibold tracking-wide transition-all duration-300 disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8da4b3]/60",
  {
    variants: {
      variant: {
        default:
          "bg-[#92a7b5] text-[#0b141d] shadow-[0_10px_25px_rgba(9,16,24,0.18)] hover:bg-[#a7b7c2] hover:shadow-[0_18px_38px_rgba(9,16,24,0.28)] hover:-translate-y-0.5",
        secondary:
          "border border-white/10 bg-[#0c141c] text-stone-100 shadow-lg hover:border-[#8da4b3]/20 hover:bg-white/[0.05] hover:text-white hover:-translate-y-0.5",
        outline:
          "border border-white/10 bg-transparent text-zinc-300 hover:border-[#8da4b3]/45 hover:bg-[#8da4b3]/10 hover:text-[#d9e0e6] hover:-translate-y-0.5",
        ghost: "text-zinc-400 hover:bg-white/5 border border-transparent hover:text-white",
        destructive: "bg-red-950/40 border border-red-900/50 text-red-500 hover:bg-red-900/60 hover:text-red-400",
      },
      size: {
        default: "h-12 px-6 py-2",
        sm: "h-10 px-4",
        lg: "h-14 px-8 text-base",
        icon: "h-12 w-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
