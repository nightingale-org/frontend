import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import useConversationId from './use-conversation-id';
import type { Route } from '@/@types';
import { SIGNOUT_CALLBACK_URL } from '@/constants';
import { LogOut, MessageSquare, Users } from 'lucide-react';

const useRoutes = (): Route[] => {
  const pathname = usePathname();
  const conversationId = useConversationId();

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
      icon: MessageSquare,
      active: isPathNameEquals('/') || !!conversationId
    },
    {
      label: 'Relationships',
      href: '/relationships',
      icon: Users,
      active: isPathNameEquals('/relationships')
    },
    {
      label: 'Logout',
      onClick: () =>
        signOut({
          callbackUrl: SIGNOUT_CALLBACK_URL
        }),
      icon: LogOut
    }
  ];
};

export default useRoutes;
