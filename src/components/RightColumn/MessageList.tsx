import { useGetConversationById } from '@/hooks/queries/use-conversation-queries';
import useConversationId from '@/hooks/use-conversation-id';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import MessageListItem from '@/components/RightColumn/MessageListItem';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useEffect, useLayoutEffect, useRef } from 'react';
import { useWebsocket } from '@/hooks/websocket/use-websocket';
import { useQueryClient } from '@tanstack/react-query';
import type { Conversation, Message } from '@/lib/api/schemas';
import { queryKeys } from '@/lib/api/query-keys';

export default function MessageList() {
  const conversationId = useConversationId();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const messageListRef = useRef<HTMLDivElement>(null);
  const websocket = useWebsocket();
  const queryClient = useQueryClient();

  const { data: conversation, isSuccess } = useGetConversationById(conversationId);

  useLayoutEffect(() => {
    if (!messageListRef.current || !messageListRef.current.lastElementChild) return;

    messageListRef.current.lastElementChild.scrollIntoView({
      behavior: 'smooth',
      block: 'end',
      inline: 'nearest'
    });
  });

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

  useEffect(() => {
    if (!websocket || !conversationId) {
      return;
    }

    const onNewMessage = ({
      conversation_id,
      message
    }: {
      message: Message;
      conversation_id: string;
    }) => {
      if (conversation_id !== conversationId) return;

      queryClient.setQueryData(
        queryKeys.conversationById(conversationId, false),
        (oldData?: Conversation) => {
          if (!oldData) {
            return oldData;
          }

          return {
            ...oldData,
            messages: [...oldData.messages, message]
          };
        }
      );
      void queryClient.invalidateQueries(queryKeys.conversationById(conversationId, false));
    };

    websocket.on('messages:new', onNewMessage);

    return () => {
      websocket.off('messages:new', onNewMessage);
    };
  }, [websocket, queryClient, conversationId]);

  if (!isSuccess) {
    return null;
  }

  return (
    <div role="group" className="flex flex-1 flex-col justify-end">
      <ScrollArea ref={scrollContainerRef} className="max-h-[calc(100vh-135px)] px-4">
        <div className="my-3 flex flex-col items-center">
          <Avatar>
            <AvatarImage src={conversation.avatar_url} />
            <AvatarFallback>{conversation.name}</AvatarFallback>
          </Avatar>
          <span className="text-base font-bold">{conversation?.name}</span>
          <span className="text-xs">This is the beginning of your conversation.</span>
        </div>
        <div ref={messageListRef}>
          {conversation.messages.map((message) => (
            <MessageListItem message={message} key={message.id} />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
