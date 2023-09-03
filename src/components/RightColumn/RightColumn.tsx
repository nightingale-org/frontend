import useConversationId from '@/hooks/use-conversation-id';
import MessageContainerHeader from '@/components/RightColumn/MessageContainerHeader';
import { useGetConversationById } from '@/hooks/queries/use-conversation-queries';
import MessageInput from '@/components/RightColumn/MessageInput';
import { useCallback, useLayoutEffect, useState } from 'react';
import { useRouter } from 'next/router';
import MessageList from './MessageList';
import { useWebsocket } from '@/hooks/websocket/use-websocket';

export default function RightColumn() {
  const router = useRouter();
  const conversationId = useConversationId();
  const [message, setMessage] = useState('');
  const websocket = useWebsocket();

  const { data: conversationPreview, isLoading } = useGetConversationById(conversationId);

  const onMessageTextUpdate = useCallback(
    (messageText: string) => {
      setMessage(messageText);
    },
    [setMessage]
  );

  const sendMessage = useCallback(() => {
    if (!message || !websocket || !conversationId) return;
    // TODO: might need to move it to the websocket emit callback
    setMessage('');

    websocket.emit('messages:new', {
      conversation_id: conversationId,
      text: message
    });
  }, [websocket, conversationId, message]);

  useLayoutEffect(() => {
    const handleCloseChat = (e: KeyboardEvent) => {
      if (e.key !== 'Escape' || !conversationId) return;

      e.preventDefault();
      void router.push('/');
    };

    document.addEventListener('keydown', handleCloseChat);

    return () => {
      document.removeEventListener('keydown', handleCloseChat);
    };
  }, [router, conversationId]);

  if (!conversationId) {
    return (
      <div className="hidden h-full items-center justify-center bg-gray-100 px-4 py-10 sm:px-6 md:flex md:px-8 md:py-6">
        <div className="flex flex-col items-center text-center">
          <h3 className="mt-2 text-2xl font-semibold text-gray-900">
            Select a chat or start a new conversation
          </h3>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return null;
  }

  return (
    <div className="flex flex-col bg-gray-100">
      <MessageContainerHeader conversation={conversationPreview!} />
      <MessageList />
      <MessageInput
        value={message}
        sendMessage={sendMessage}
        onUpdate={onMessageTextUpdate}
        placeholder="Send a message..."
        canAutoFocus
      />
    </div>
  );
}
