import { useState } from 'react';
import { MdOutlineGroupAdd } from 'react-icons/md';
import clsx from 'clsx';

import useActiveConversationStatus from '@/hooks/use-active-conversation-status';
import ConversationBox from './ConversationBox';
import { Conversation, RelationShip } from '@/lib/api/schemas';
import dynamic from 'next/dynamic';

const GroupChatModal = dynamic(() => import('@/components/modals/GroupChatModal'), { ssr: false });

interface ConversationListProps {
  conversations: Conversation[];
  relationships: RelationShip[];
  title?: string;
}

const ConversationList: React.FC<ConversationListProps> = ({
  conversations: initialConversations,
  relationships
}) => {
  const [conversations, setConversations] = useState(initialConversations);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { conversationId, isOpen } = useActiveConversationStatus();

  return (
    <>
      <GroupChatModal
        relationships={relationships}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
      <aside
        className={clsx(
          `overflow-y-autoborder-r fixed inset-y-0 border-gray-200 pb-20 lg:left-20 lg:block lg:w-80 lg:pb-0`,
          isOpen ? 'hidden' : 'left-0 block w-full'
        )}
      >
        <div className="px-5">
          <div className="mb-4 flex justify-between pt-4">
            <div className="text-2xl font-bold text-neutral-800">Messages</div>
            <div
              onClick={() => setIsModalOpen(true)}
              className="cursor-pointer rounded-full bg-gray-100 p-2 text-gray-600 transition hover:opacity-75"
            >
              <MdOutlineGroupAdd size={20} />
            </div>
          </div>
          {conversations.map((item) => (
            <ConversationBox
              key={item.id}
              conversation={item}
              selected={conversationId === item.id}
            />
          ))}
        </div>
      </aside>
    </>
  );
};

export default ConversationList;
