import ConversationListItem from './ConversationListItem';
import dynamic from 'next/dynamic';
import { useGetConversationsPreviews } from '@/hooks/queries/use-conversation-queries';
import { useModal } from '@/hooks/use-modal';
import Aside from '@/components/LeftColumn/Aside';
import { SearchBar } from '@/components/ui/search-bar';
import * as React from 'react';
import { useRef, useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { SkeletonContainer } from '@/components/ui/skeleton';
import UserBoxSkeleton from '@/components/common/UserBoxSkeleton';
import { UserPlus2 } from 'lucide-react';
import { Icon } from '@/components/ui/icon';

const GroupChatModal = dynamic(
  () => import('@/components/LeftColumn/conversations/GroupChatModal'),
  { ssr: false }
);

const ConversationList = () => {
  const divContainerRef = useRef<HTMLDivElement>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isGroupChatModalOpen, onGroupChatModalOpen, onGroupChatModalClose] = useModal();
  const { data: conversations, isLoading } = useGetConversationsPreviews();

  const onSearchQueryChange = (newValue: string) => {
    setSearchQuery(newValue);
  };

  return (
    <Aside className="relative" name="Messages">
      <GroupChatModal isOpen={isGroupChatModalOpen} onClose={onGroupChatModalClose} />
      <Icon className="absolute right-0 top-4" onClick={onGroupChatModalOpen}>
        <UserPlus2 size={20} />
      </Icon>
      <SearchBar
        className="h-9"
        wrapperClassName="mx-2"
        value={searchQuery}
        type="text"
        placeholder="Search"
        onChange={onSearchQueryChange}
      />
      <ScrollArea className="mt-1 flex-1" ref={divContainerRef}>
        {isLoading ? (
          <SkeletonContainer
            className="flex flex-col gap-1 p-3"
            containerRef={divContainerRef}
            renderSkeleton={(key) => <UserBoxSkeleton key={key} />}
          />
        ) : (
          conversations!.pages.map((page) => {
            return page.data.map((conversation) => {
              return <ConversationListItem key={conversation.id} conversation={conversation} />;
            });
          })
        )}
      </ScrollArea>
    </Aside>
  );
};

export default ConversationList;
