import { forwardRef } from 'react';
import { cn } from '@/utils/css-class-merge';

export const Icon = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        {...props}
        ref={ref}
        className={cn(
          'mr-4 cursor-pointer rounded-full bg-gray-100 p-2 text-gray-600 transition hover:opacity-75',
          className
        )}
      >
        {children}
      </div>
    );
  }
);
Icon.displayName = 'Icon';
