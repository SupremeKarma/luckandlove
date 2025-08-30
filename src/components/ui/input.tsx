
import * as React from 'react';
import { cn } from '@/lib/utils';
import { Slot } from '@radix-ui/react-slot';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, icon, iconPosition = 'left', ...props }, ref) => {
    const hasIcon = React.isValidElement(icon);
    
    const inputElement = (
       <input
        type={type}
        className={cn(
          'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
          hasIcon && (iconPosition === 'left' ? 'pl-10' : 'pr-10'),
          className
        )}
        ref={ref}
        {...props}
      />
    )
    
    if (hasIcon) {
        return (
            <div className="relative">
                <div className={cn("absolute top-1/2 -translate-y-1/2 text-muted-foreground",
                    iconPosition === 'left' ? "left-3" : "right-3"
                )}>
                    {icon}
                </div>
                {inputElement}
            </div>
        )
    }

    return inputElement;
  }
);
Input.displayName = 'Input';

export { Input };
