import { usePathname } from 'next/navigation';
import { HiChat } from 'react-icons/hi';
import { HiArrowLeftOnRectangle, HiUsers } from 'react-icons/hi2';
import { signOut } from 'next-auth/react';
import useActiveConversationStatus from './use-active-conversation-status';
import type { Route } from '@/@types';

const useRoutes = (): Route[] => {
  const pathname = usePathname();
  const { conversationId } = useActiveConversationStatus();

  const isPathNameEquals = (href: string) => {
    if (pathname.length > 1 && pathname.charAt(pathname.length - 1) === '/') {
      return pathname.slice(0, pathname.length - 1) === href;
    }

    return pathname === href;
  };

  return [
    {
      label: 'Chat',
      href: '/',
      icon: HiChat,
      active: isPathNameEquals('/') || !!conversationId
    },
    {
      label: 'Relationships',
      href: '/relationships',
      icon: HiUsers,
      active: isPathNameEquals('/relationships')
    },
    {
      label: 'Logout',
      onClick: () =>
        signOut({
          callbackUrl: 'http://localhost:8080/api/auth/logout'
        }),
      icon: HiArrowLeftOnRectangle
    }
  ];
};

export default useRoutes;
