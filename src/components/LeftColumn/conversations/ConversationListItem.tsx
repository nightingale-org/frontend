import { memo } from 'react';
import type { ConversationPreview } from '@/lib/api/schemas';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { formatLastMessageOfConversation } from '@/utils/formatting';
import { useRouter } from 'next/router';
import { cn } from '@/utils/css-class-merge';

interface ConversationBoxProps {
  conversation: ConversationPreview;
  userEmail?: string | null;
}

const ConversationListItem: React.FC<ConversationBoxProps> = ({ conversation }) => {
  const router = useRouter();
  const isActive =
    router.pathname.startsWith('/conversations') && router.query.id === conversation.id;

  const handleClick = () => {
    void router.push(`/conversations/${conversation.id}`);
  };

  return (
    <div
      onClick={handleClick}
      role="button"
      tabIndex={0}
      className={cn(
        'group relative flex w-full cursor-pointer items-center space-x-3 rounded-lg p-3 transition hover:bg-neutral-100',
        { 'bg-neutral-100': isActive }
      )}
    >
      <Avatar>
        <AvatarImage src={conversation.avatar_url} />
        <AvatarFallback>{conversation.name}</AvatarFallback>
      </Avatar>
      <div className="min-w-0 flex-1">
        <div className="focus:outline-none">
          <span className="absolute inset-0" aria-hidden="true" />
          <div className="mb-1 flex flex-col overflow-hidden">
            <p className="overflow-hidden text-sm font-medium text-gray-900">{conversation.name}</p>
            <p className="text-xs font-medium text-slate-400">
              {formatLastMessageOfConversation(conversation)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(ConversationListItem);
