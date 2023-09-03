import { forwardRef, useCallback, useEffect, useRef } from 'react';
import focusEditableElement from '@/utils/focus-editable-element';
import { mergeRefs } from '@/utils/react';
import { insertTextAtSelection } from '@/utils/inputs';
import { cn } from '@/utils/css-class-merge';

export interface ContentEditableProps {
  className?: string;
  placeholder?: string;
  onUpdate: (text: string) => void;
  onKeyDown?: React.KeyboardEventHandler<HTMLDivElement>;
  onFocus?: React.FocusEventHandler<HTMLDivElement>;
  onBlur?: React.FocusEventHandler<HTMLDivElement>;
  canAutoFocus?: boolean;
}

const ContentEditable = forwardRef<HTMLDivElement, ContentEditableProps>(function (
  { className, placeholder, canAutoFocus, onUpdate, onKeyDown, onBlur, onFocus },
  ref
) {
  const divRef = useRef<HTMLDivElement>(null);

  const focusInput = useCallback(() => {
    if (!divRef.current) {
      return;
    }

    focusEditableElement(divRef.current);
  }, []);

  const handleInput = (e: React.ChangeEvent<HTMLDivElement>) => {
    onUpdate(e.target.textContent || '');
  };

  const handleInputPaste = useCallback(
    (e: React.ClipboardEvent<HTMLDivElement>) => {
      if (!divRef.current) return;

      e.preventDefault();
      const plainText = e.clipboardData.getData('text/plain');
      insertTextAtSelection(divRef.current, plainText);
      onUpdate(divRef.current.textContent || '');
    },
    [onUpdate]
  );

  useEffect(() => {
    if (canAutoFocus) {
      focusInput();
    }
  }, [focusInput, canAutoFocus]);

  return (
    <div
      aria-label={placeholder}
      contentEditable
      ref={mergeRefs([ref, divRef])}
      role="textbox"
      spellCheck="false"
      tabIndex={0}
      dir="auto"
      onClick={focusInput}
      onInput={handleInput}
      onPaste={handleInputPaste}
      onKeyDown={onKeyDown}
      onFocus={onFocus}
      onBlur={onBlur}
      className={cn(
        className,
        'select-text whitespace-pre-wrap break-words font-normal text-slate-900 caret-gray-900 outline-none'
      )}
    />
  );
});

ContentEditable.displayName = 'ContentEditable';

export default ContentEditable;
