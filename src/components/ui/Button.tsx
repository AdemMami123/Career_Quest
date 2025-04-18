import React, { ButtonHTMLAttributes, forwardRef } from 'react';
import { Slot } from '@radix-ui/react-slot'; // Needed for `asChild`
import { VariantProps, cva } from 'class-variance-authority';
import { cn } from '../../lib/utils'; // Make sure this exists

// Bulma variants
export const buttonVariants = cva(
  'button',
  {
    variants: {
      variant: {
        default: 'is-primary',
        destructive: 'is-danger',
        outline: 'is-outlined',
        secondary: 'is-info',
        ghost: 'is-text',
        link: 'is-text is-underlined',
      },
      size: {
        default: 'is-normal',
        sm: 'is-small',
        lg: 'is-medium',
        icon: 'is-small is-rounded',
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
