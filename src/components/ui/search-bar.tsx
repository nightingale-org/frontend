import * as React from 'react';

import { cn } from '@/utils/css-class-merge';
import { Search, X } from 'lucide-react';
import { mergeRefs } from '@/utils/react';
import { useRef } from 'react';

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  onChange?: (newValue: string) => void | Promise<void>;
}

const SearchBar = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, value, onChange, ...props }, ref) => {
    const inputRef = useRef<HTMLInputElement | null>(null);
    const onInputClear = () => {
      onChange?.('');
      inputRef.current?.focus();
    };

    const onInputChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
      onChange?.(event.target.value);
    };

    return (
      <div className="relative flex items-center justify-center">
        <Search className="pointer-events-none absolute left-3" />
        <input
          type={type}
          className={cn(
            'flex h-10 w-full rounded-md border border-input bg-transparent py-2 pl-10 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
            className
          )}
          ref={mergeRefs([ref, inputRef])}
          value={value}
          onChange={onInputChange}
          {...props}
        />
        <X
          className={cn('absolute right-3 cursor-pointer', {
            hidden: !value
          })}
          onClick={onInputClear}
        />
      </div>
    );
  }
);
SearchBar.displayName = 'SearchBar';

export { SearchBar };
