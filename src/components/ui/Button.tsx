import React, { ButtonHTMLAttributes, forwardRef } from 'react';
import { Slot } from '@radix-ui/react-slot'; // Needed for `asChild`
import { VariantProps, cva } from 'class-variance-authority';
import { cn } from '../../lib/utils';

// Tailwind variants
export const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none',
  {
    variants: {
      variant: {
        default: 'bg-primary text-white hover:bg-primary-700 focus-visible:ring-primary-300',
        destructive: 'bg-red-500 text-white hover:bg-red-600 focus-visible:ring-red-300',
        outline: 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus-visible:ring-gray-400',
        secondary: 'bg-secondary text-white hover:bg-secondary-600 focus-visible:ring-secondary-300',
        ghost: 'hover:bg-gray-100 hover:text-gray-900 text-gray-600',
        link: 'underline-offset-4 text-primary hover:underline',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-8 text-sm px-3 py-1',
        lg: 'h-12 text-lg px-5 py-2',
        icon: 'h-9 w-9 p-1',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

// The actual Button component
const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(buttonVariants({ variant, size }), className)}
        ref={ref}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';

export { Button };
