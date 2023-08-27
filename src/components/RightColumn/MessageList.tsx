import { useGetConversationPreviewById } from '@/hooks/queries/use-conversation-queries';
import useConversationId from '@/hooks/use-conversation-id';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import MessageListItem from '@/components/RightColumn/MessageListItem';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useLayoutEffect, useRef } from 'react';

export default function MessageList() {
  const conversationId = useConversationId();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const { data: conversationPreview, isSuccess } = useGetConversationPreviewById(conversationId);

  useLayoutEffect(() => {
    if (!scrollContainerRef.current) {
      return;
    }

    const scrollViewPortElement = scrollContainerRef.current.children.item(1);
    if (!scrollViewPortElement) {
      return;
    }
    const itemsContainer = scrollViewPortElement.firstElementChild;
    if (!itemsContainer) {
      return;
    }

    scrollViewPortElement.scrollTo({
      top: itemsContainer.scrollHeight + 100
    });
  }, []);

  if (!isSuccess) {
    return null;
  }

  return (
    <div role="group" className="flex flex-1 flex-col justify-end">
      <ScrollArea ref={scrollContainerRef} className="max-h-[calc(100vh-135px)] px-4">
        <div className="my-3 flex flex-col items-center">
          <Avatar>
            <AvatarImage src={conversationPreview?.avatar_url} />
            <AvatarFallback>{conversationPreview?.name}</AvatarFallback>
          </Avatar>
          <span className="text-base font-bold">{conversationPreview?.name}</span>
          <span className="text-xs">This is the beginning of your conversation.</span>
        </div>
        {[...Array(50)].map((_, index) => (
          <MessageListItem text={`Lorem ipsum ${index}`} isMine={index % 2 !== 0} />
        ))}
      </ScrollArea>
    </div>
  );
}
