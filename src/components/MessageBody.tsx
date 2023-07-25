import axios from 'axios';
import { useEffect, useRef, useState } from 'react';

import useActiveConversationStatus from '@/hooks/use-active-conversation-status';
import MessageBox from './MessageBox';
import type { Message } from '../lib/api/schemas';

interface BodyProps {
  initialMessages: Message[];
}

const MessageBody: React.FC<BodyProps> = ({ initialMessages }) => {
  const bottomRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<Message[]>(initialMessages);

  const { conversationId } = useActiveConversationStatus();

  useEffect(() => {
    axios.post(`/api/conversations/${conversationId}/seen`);
    pusherClient.subscribe(conversationId);
    bottomRef?.current?.scrollIntoView();

    const messageHandler = (message: Message) => {
      axios.post(`/api/conversations/${conversationId}/seen`);

      setMessages((current) => {
        if (current.find((v) => v.id === message.id)) {
          return current;
        }

        return [...current, message];
      });

      bottomRef?.current?.scrollIntoView();
    };

    const updateMessageHandler = (newMessage: Message) => {
      setMessages((current) =>
        current.map((currentMessage) => {
          if (currentMessage.id === newMessage.id) {
            return newMessage;
          }

          return currentMessage;
        })
      );
    };

    pusherClient.bind('messages:new', messageHandler);
    pusherClient.bind('message:update', updateMessageHandler);

    return () => {
      pusherClient.unsubscribe(conversationId);
      pusherClient.unbind('messages:new', messageHandler);
      pusherClient.unbind('message:update', updateMessageHandler);
    };
  }, [conversationId]);

  return (
    <div className="flex-1 overflow-y-auto">
      {messages.map((message, i) => (
        <MessageBox isLast={i === messages.length - 1} key={message.id} message={message} />
      ))}
      <div className="pt-24" ref={bottomRef} />
    </div>
  );
};

export default MessageBody;
