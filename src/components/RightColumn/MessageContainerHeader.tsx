import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import type { ConversationPreview } from '@/lib/api/schemas';

type MessageContainerHeaderProps = {
  conversation: ConversationPreview;
};

export default function MessageContainerHeader({ conversation }: MessageContainerHeaderProps) {
  return (
    <div className="flex h-12 w-full items-center rounded-md bg-gray-100 px-4 shadow-lg">
      <div className="flex items-center gap-2">
        <Avatar>
          <AvatarImage src={conversation.avatar_url} />
          <AvatarFallback>{conversation.name}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <span className="text-sm font-semibold">{conversation.name}</span>
          <span className="text-xs">Last seen 2 hours ago</span>
        </div>
      </div>
    </div>
  );
}
