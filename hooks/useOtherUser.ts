import { useSession } from 'next-auth/react';
import { useMemo, use } from 'react';
import { ConversationWithUserAndMessages } from '@/@types';
import { User } from '@prisma/client';

const useOtherUser = (conversation: ConversationWithUserAndMessages | { users: User[] }) => {
  const session = useSession();

  const otherUser = useMemo(() => {
    const currentUserEmail = session.data?.user?.email;

    const otherUser = conversation.users.filter((user) => user.email !== currentUserEmail);

    return otherUser[0];
  }, [session.data?.user?.email, conversation.users]);

  return otherUser;
};

export default useOtherUser;
