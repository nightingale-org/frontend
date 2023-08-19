import clsx from 'clsx';

import useActiveConversationStatus from '@/hooks/use-active-conversation-status';
import ConversationListItem from './ConversationListItem';
import dynamic from 'next/dynamic';
import { UserPlus2 } from 'lucide-react';
import { useGetConversationsPreviews } from '@/hooks/queries/use-conversation-queries';
import { useModal } from '@/hooks/use-modal';

const GroupChatModal = dynamic(() => import('@/components/modals/GroupChatModal'), { ssr: false });

const ConversationList = () => {
  const [isModalOpen, onModalOpen, onModalClose] = useModal();
  const { data: conversations, isLoading, fetchNextPage } = useGetConversationsPreviews();
  const { conversationId, isOpen } = useActiveConversationStatus();
  if (isLoading) {
    return <span>Loading...</span>;
  }

  return (
    <>
      {/*<GroupChatModal isOpen={isModalOpen} onClose={onModalClose} />*/}
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
              onClick={onModalOpen}
              className="cursor-pointer rounded-full bg-gray-100 p-2 text-gray-600 transition hover:opacity-75"
            >
              <UserPlus2 size={20} />
            </div>
          </div>
          {conversations!.pages.map((page) => {
            return page.data.map((conversation) => {
              return <ConversationListItem key={conversation.id} conversation={conversation} />;
            });
          })}
        </div>
      </aside>
    </>
  );
};

export default ConversationList;
