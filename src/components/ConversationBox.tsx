import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import clsx from 'clsx';

import AvatarGroup from '@/components/AvatarGroup';
import { Conversation } from '@/lib/api/schemas';
import { useSession } from '@/hooks/use-session';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface ConversationBoxProps {
  conversation: Conversation;
  selected?: boolean;
  userEmail?: string | null;
}

const ConversationBox: React.FC<ConversationBoxProps> = ({ conversation, selected }) => {
  const { session } = useSession();
  const router = useRouter();

  const lastMessage = conversation.messages.at(-1);

  const hasSeen = useMemo(() => {
    if (!lastMessage) {
      return false;
    }

    const seenArray = lastMessage.seen_by || [];

    if (!session.user.email) {
      return false;
    }

    return seenArray.filter((user) => user.email === session.user.email).length !== 0;
  }, [session.user.email, lastMessage]);

  const lastMessageText = useMemo(() => {
    if (lastMessage?.text) {
      return lastMessage?.text;
    }

    return 'Started a conversation';
  }, [lastMessage]);

  const otherUser = conversation.members.filter((user) => user.email !== session.user.email)[0];

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
      {conversation.is_group ? (
        <AvatarGroup users={conversation.members} />
      ) : (
        <Avatar>
          <AvatarImage src={session.user.image} />
          <AvatarFallback>{session.user.name}</AvatarFallback>
        </Avatar>
      )}
      <div className="min-w-0 flex-1">
        <div className="focus:outline-none">
          <span className="absolute inset-0" aria-hidden="true" />
          <div className="mb-1 flex items-center justify-between">
            <p className="text-md font-medium text-gray-900">
              {conversation.name || (otherUser ? otherUser.username : 'error')}
            </p>
            {lastMessage?.created_at && (
              <p
                className="
                  text-xs
                  font-light
                  text-gray-400
                "
              >
                {format(new Date(lastMessage.created_at), 'p')}
              </p>
            )}
          </div>
          <p
            className={clsx(
              `
              truncate
              text-sm
              `,
              hasSeen ? 'text-gray-500' : 'font-medium text-black'
            )}
          >
            {lastMessageText}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ConversationBox;
