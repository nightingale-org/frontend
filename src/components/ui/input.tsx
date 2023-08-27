import * as React from 'react';
import { useState } from 'react';

import { cn } from '@/utils/css-class-merge';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  wrapperClassName?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, maxLength, onChange, wrapperClassName, ...props }, ref) => {
    const [numberOfCharactersLeft, setNumberOfCharactersLeft] = useState(
      typeof props.value === 'string'
        ? maxLength
          ? maxLength - props.value.length
          : maxLength
        : maxLength
    );

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      if (maxLength) {
        setNumberOfCharactersLeft(maxLength - event.target.value.length);
      }

      onChange?.(event);
    };

    return (
      <div className={cn('relative', wrapperClassName)}>
        <input
          type={type}
          className={cn(
            'flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
            className
          )}
          onChange={handleChange}
          ref={ref}
          maxLength={maxLength}
          {...props}
        />
        {maxLength ? (
          <div className="absolute right-2 top-8 select-none bg-white text-xs">
            {numberOfCharactersLeft}
          </div>
        ) : null}
      </div>
    );
  }
);
Input.displayName = 'Input';

export { Input };
