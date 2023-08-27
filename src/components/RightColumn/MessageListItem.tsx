import { cn } from '@/utils/css-class-merge';
import { CheckCheck } from 'lucide-react';

type MessageListItemProps = {
  isMine: boolean;
  text: string;
  className?: string;
};

export default function MessageListItem({ isMine, text, className }: MessageListItemProps) {
  return (
    <div
      className={cn(
        'mt-1 flex',
        {
          'justify-end': isMine,
          'justify-start': !isMine
        },
        className
      )}
    >
      <div
        className={cn(
          'min-w-0 max-w-[60ch] whitespace-pre-wrap break-words rounded-xl p-2 text-xs font-medium leading-snug after:clear-both after:table',
          {
            'bg-sky-100': isMine,
            'bg-gray-200': !isMine
          }
        )}
      >
        {text.repeat(29)}
        <span className="relative bottom-auto top-1 float-right flex max-w-full items-center">
          <span title="Aug 26, 2023, 8:52:44 PM" className="opacity-60">
            Aug 20, 01:14 PM
          </span>
          <CheckCheck className="ml-1" size={16} />
        </span>
      </div>
    </div>
  );
}
