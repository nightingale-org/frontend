import { useParams } from 'next/navigation';

const useConversation = (): { isOpen: boolean; conversationId: string } => {
  const params = useParams();

  if (!params) {
    return {
      isOpen: false,
      conversationId: ''
    };
  }

  const conversationId = typeof params.conversationId === 'string' ? params.conversationId : '';

  return {
    isOpen: !!conversationId,
    conversationId: conversationId
  };
};

export default useConversation;
