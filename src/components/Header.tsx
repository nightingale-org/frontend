import { HiChevronLeft } from 'react-icons/hi';
import { HiEllipsisHorizontal } from 'react-icons/hi2';
import { useMemo, useState } from 'react';
import Link from 'next/link';
import type { ConversationPreview } from '@/lib/api/schemas';

import useOtherUser from '@/hooks/useOtherUser';
import useActiveList from '@/hooks/useActiveList';

import AvatarGroup from '@/components/common/AvatarGroup';
import ProfileDrawer from './ProfileDrawer';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface HeaderProps {
  conversation: ConversationPreview;
}

const Header: React.FC<HeaderProps> = ({ conversation }) => {
  const otherUser = useOtherUser(conversation);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const { members } = useActiveList();
  const isActive = members.indexOf(otherUser?.email!) !== -1;
  const statusText = useMemo(() => {
    if (conversation.is_group) {
      return `${conversation.members.length} members`;
    }

    return isActive ? 'Active' : 'Offline';
  }, [conversation, isActive]);

  return (
    <>
      <ProfileDrawer
        conversation={conversation}
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      />
      <div
        className="
        flex
        w-full
        items-center
        justify-between
        border-b-[1px]
        bg-white
        px-4
        py-3
        shadow-sm
        sm:px-4
        lg:px-6
      "
      >
        <div className="flex items-center gap-3">
          <Link
            href="/conversations"
            className="
            block
            cursor-pointer
            text-sky-500
            transition
            hover:text-sky-600
            lg:hidden
          "
          >
            <HiChevronLeft size={32} />
          </Link>
          {conversation.is_group ? (
            <AvatarGroup users={conversation.members} />
          ) : (
            <Avatar>
              <AvatarImage src={otherUser.image} />
              <AvatarFallback>{otherUser.username}</AvatarFallback>
            </Avatar>
          )}
          <div className="flex flex-col">
            <div>{conversation.name || otherUser.name}</div>
            <div className="text-sm font-light text-neutral-500">{statusText}</div>
          </div>
        </div>
        <HiEllipsisHorizontal
          size={32}
          onClick={() => setDrawerOpen(true)}
          className="
          cursor-pointer
          text-sky-500
          transition
          hover:text-sky-600
        "
        />
      </div>
    </>
  );
};

export default Header;
