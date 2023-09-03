import { cn } from '@/utils/css-class-merge';
import { CheckCheck } from 'lucide-react';
import type { Message } from '@/lib/api/schemas';
import { useSession } from '@/hooks/use-session';
import { forwardRef } from 'react';

type MessageListItemProps = {
  message: Message;
  className?: string;
};

const MessageListItem = forwardRef<HTMLDivElement, MessageListItemProps>(
  ({ className, message }, ref) => {
    const { session } = useSession();
    const isMine = message.author.username === session.user.name;

    return (
      <div
        ref={ref}
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
          {message.text}
          <span className="relative bottom-auto left-1 top-1 float-right flex max-w-full items-center text-[0.6rem] font-normal">
            <span title="Aug 26, 2023, 8:52:44 PM" className="opacity-60">
              {new Date(message.created_at).toLocaleDateString('en-US', {
                hour: 'numeric',
                minute: 'numeric',
                hour12: true
              })}
            </span>
            <CheckCheck className="ml-1" size={16} />
          </span>
        </div>
      </div>
    );
  }
);

MessageListItem.displayName = 'MessageListItem';

export default MessageListItem;
