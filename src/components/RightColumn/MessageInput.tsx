import { Paperclip, Smile } from 'lucide-react';
import { useCallback, useEffect, useRef } from 'react';
import focusEditableElement from '@/utils/focus-editable-element';
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';
import { cn } from '@/utils/css-class-merge';
import useFlag from '@/hooks/use-flag';
import { moveCaretToTheEnd } from '@/utils/inputs';
import { Transition } from '@headlessui/react';
import AnimatedIcon from '@/components/common/AnimatedIcon';
import type { Emoji } from '@/@types';

type MessageInputProps = {
  onUpdate: (text: string) => void;
  placeholder: string;
  canAutoFocus?: boolean;
  value: string;
  sendMessage: () => void;
};

export default function MessageInput({
  onUpdate,
  placeholder,
  value,
  sendMessage,
  canAutoFocus = true
}: MessageInputProps) {
  const [emojiPickerOpen, setEmojiPickerOpen, setEmojiPickerClosed] = useFlag();
  const [textAreaIsFocused, setTextAreaIsFocused, setTextAreaIsBlurred] = useFlag();

  const textAreaDifRef = useRef<HTMLDivElement>(null);
  const emojiPickerRef = useRef<HTMLDivElement | null>(null);
  const timeoutRef = useRef<number | null>(null);

  const focusInput = useCallback(() => {
    if (!textAreaDifRef.current) {
      return;
    }

    focusEditableElement(textAreaDifRef.current);
  }, []);

  const handleInput = (e: React.ChangeEvent<HTMLDivElement>) => {
    onUpdate(e.target.textContent || '');
  };

  useEffect(() => {
    if (canAutoFocus) {
      focusInput();
    }
  }, [focusInput, canAutoFocus]);

  const handleKeyDown: React.KeyboardEventHandler<HTMLDivElement> = useCallback(
    (e) => {
      const { isComposing } = e.nativeEvent;

      if (!isComposing && e.key === 'Enter' && !e.shiftKey && textAreaDifRef.current) {
        e.preventDefault();
        textAreaDifRef.current.textContent = '';
        sendMessage();
      }
    },
    [sendMessage]
  );

  const handleEmojiPickerOpening: React.MouseEventHandler<SVGSVGElement> = () => {
    setEmojiPickerOpen();
  };

  const handleEmojiPickerMouseLeave: React.MouseEventHandler<SVGSVGElement | HTMLDivElement> =
    useCallback(() => {
      // Explicitly call setTimeout on `window` so return type is `number` instead of `NodeJS.Timeout`
      timeoutRef.current = window.setTimeout(() => {
        setEmojiPickerClosed();
      }, 300);
    }, [setEmojiPickerClosed]);

  const handleEmojiPickerMouseEnter: React.MouseEventHandler<SVGSVGElement | HTMLDivElement> =
    useCallback(() => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      setEmojiPickerOpen();
    }, [setEmojiPickerOpen]);

  const onEmojiSelect = useCallback(
    (emoji: Emoji, event: React.PointerEvent) => {
      if (!textAreaDifRef.current) return;
      event.preventDefault();
      focusInput();
      onUpdate(`${value}${emoji.native}`);
      textAreaDifRef.current.textContent = `${value}${emoji.native}`;
      moveCaretToTheEnd(textAreaDifRef.current);
    },
    [focusInput, onUpdate, value]
  );

  return (
    <div className="w-full px-3 py-2">
      <div
        className={cn(
          'relative flex w-full items-center gap-2 rounded-md bg-gray-200 py-3 pl-8 pr-16 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-slate-950 dark:ring-offset-slate-950 dark:focus-visible:ring-slate-300',
          // This is done for reducing of the number of repaintings
          // https://tobiasahlin.com/blog/how-to-animate-box-shadow/
          'after:pointer-events-none after:absolute after:left-0 after:top-0 after:h-full after:w-full after:rounded-md after:opacity-0 after:ring-1 after:ring-slate-950 after:transition-opacity focus-visible:after:opacity-100',
          {
            'after:opacity-100': textAreaIsFocused
          }
        )}
      >
        <AnimatedIcon Icon={Paperclip} className="absolute bottom-3 left-2 cursor-pointer" />
        <div className="max-h-[68px] min-h-[25px] flex-1 overflow-y-auto break-all text-sm leading-5 lg:max-h-[120px] ">
          <div>
            <div
              aria-label={placeholder}
              contentEditable
              ref={textAreaDifRef}
              role="textbox"
              spellCheck="false"
              tabIndex={0}
              dir="auto"
              onClick={focusInput}
              onInput={handleInput}
              onKeyDown={handleKeyDown}
              onFocus={setTextAreaIsFocused}
              onBlur={setTextAreaIsBlurred}
              className="select-text whitespace-pre-wrap break-words font-normal text-slate-900 caret-gray-900 outline-none"
            />
            <div
              className={cn(
                'pointer-events-none absolute left-8 top-3 select-none transition-opacity duration-75 ease-out',
                {
                  'opacity-0': value
                }
              )}
            >
              <span dir="auto">{placeholder}</span>
            </div>
            <div>
              <Transition
                show={emojiPickerOpen}
                enter="transition-opacity duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="transition-opacity duration-300"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <div
                  onMouseLeave={handleEmojiPickerMouseLeave}
                  onMouseEnter={handleEmojiPickerMouseEnter}
                  ref={emojiPickerRef}
                  className={cn('absolute bottom-14 right-4 z-50 rounded-md shadow-xl')}
                  data-state={emojiPickerOpen ? 'open' : 'closed'}
                >
                  <Picker
                    data={data}
                    onEmojiSelect={onEmojiSelect}
                    previewPosition="none"
                    skinTonePosition="none"
                    theme="light"
                  />
                </div>
              </Transition>
              <AnimatedIcon
                Icon={Smile}
                onMouseDown={(e) => e.preventDefault()}
                onClick={handleEmojiPickerOpening}
                onMouseLeave={handleEmojiPickerMouseLeave}
                onMouseEnter={handleEmojiPickerMouseEnter}
                size={25}
                className="absolute bottom-3 right-2 cursor-pointer"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
