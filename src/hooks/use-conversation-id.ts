import { useRouter } from 'next/router';

const useConversationId = (): string | null => {
  const router = useRouter();

  if (router.route !== '/conversations/[id]' || typeof router.query.id !== 'string') {
    return null;
  }

  return router.query.id;
};

export default useConversationId;
