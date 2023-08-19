import { memo } from 'react';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import clsx from 'clsx';
import type { ConversationPreview } from '@/lib/api/schemas';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface ConversationBoxProps {
  conversation: ConversationPreview;
  selected?: boolean;
  userEmail?: string | null;
}

const ConversationListItem: React.FC<ConversationBoxProps> = ({ conversation, selected }) => {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/conversations/${conversation.id}`);
  };

  return (
    <div
      onClick={handleClick}
      className={clsx(
        `
        relative
        flex
        w-full
        cursor-pointer
        items-center
        space-x-3
        rounded-lg
        p-3
        transition
        hover:bg-neutral-100
        `,
        selected ? 'bg-neutral-100' : 'bg-white'
      )}
    >
      <Avatar>
        <AvatarImage src={conversation.avatar_url} />
        <AvatarFallback>{conversation.avatar_url}</AvatarFallback>
      </Avatar>
      <div className="min-w-0 flex-1">
        <div className="focus:outline-none">
          <span className="absolute inset-0" aria-hidden="true" />
          <div className="mb-1 flex items-center justify-between">
            <p className="text-md font-medium text-gray-900">{conversation.name}</p>
            {conversation.last_message?.created_at && (
              <p
                className="
                  text-xs
                  font-light
                  text-gray-400
                "
              >
                {format(new Date(conversation.last_message.created_at), 'p')}
              </p>
            )}
          </div>
          <p
            className={clsx(
              `
              truncate
              text-sm
              `,
              conversation.last_message_seen ? 'text-gray-500' : 'font-medium text-black'
            )}
          >
            {conversation.last_message?.text ?? ''}
          </p>
        </div>
      </div>
    </div>
  );
};

export default memo(ConversationListItem);
