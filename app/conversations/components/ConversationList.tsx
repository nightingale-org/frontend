'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { MdOutlineGroupAdd } from 'react-icons/md';
import clsx from 'clsx';

import useConversation from '@/hooks/useConversation';
import { pusherClient } from "@/libs/pusher-client";
import ConversationBox from './ConversationBox';
import {ConversationWithUserAndMessages, User} from '@/types';
import dynamic from 'next/dynamic';

const GroupChatModal = dynamic(() => import('@/components/modals/GroupChatModal'), { ssr: false });

interface ConversationListProps {
  conversations: ConversationWithUserAndMessages[];
  users: User[];
  title?: string;
  userEmail?: string | null;
}

const ConversationList: React.FC<ConversationListProps> = ({
  conversations: initialConversations,
  users,
  userEmail
}) => {
  const [conversations, setConversations] = useState(initialConversations);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  const { conversationId, isOpen } = useConversation();

  const pusherKey = userEmail;

  useEffect(() => {
    if (!pusherKey) {
      return;
    }

    pusherClient.subscribe(pusherKey);

    const updateHandler = (conversation: ConversationWithUserAndMessages) => {
      setConversations((current) =>
        current.map((currentConversation) => {
          if (currentConversation.id === conversation.id) {
            return {
              ...currentConversation,
              messages: conversation.messages
            };
          }

          return currentConversation;
        })
      );
    };

    const newHandler = (conversation: ConversationWithUserAndMessages) => {
      setConversations((current) => {
        if (current.find((v) => v.id === conversation.id)) {
          return current;
        }

        return [conversation, ...current];
      });
    };

    const removeHandler = (conversation: ConversationWithUserAndMessages) => {
      setConversations((current) => {
        return [...current.filter((convo) => convo.id !== conversation.id)];
      });
    };

    pusherClient.bind('conversation:update', updateHandler);
    pusherClient.bind('conversation:new', newHandler);
    pusherClient.bind('conversation:remove', removeHandler);
  }, [pusherKey, router]);

  return (
    <>
      <GroupChatModal users={users} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <aside
        className={clsx(
          `
        fixed
        inset-y-0
        overflow-y-auto
        border-r
        border-gray-200
        pb-20
        lg:left-20
        lg:block
        lg:w-80
        lg:pb-0
      `,
          isOpen ? 'hidden' : 'left-0 block w-full'
        )}
      >
        <div className="px-5">
          <div className="mb-4 flex justify-between pt-4">
            <div className="text-2xl font-bold text-neutral-800">Messages</div>
            <div
              onClick={() => setIsModalOpen(true)}
              className="
                cursor-pointer
                rounded-full
                bg-gray-100
                p-2
                text-gray-600
                transition
                hover:opacity-75
              "
            >
              <MdOutlineGroupAdd size={20} />
            </div>
          </div>
          {conversations.map((item) => (
            <ConversationBox
              key={item.id}
              conversation={item}
              selected={conversationId === item.id}
              userEmail={userEmail}
            />
          ))}
        </div>
      </aside>
    </>
  );
};

export default ConversationList;
