import { useParams } from 'next/navigation';

const useActiveConversationStatus = (): { isOpen: boolean; conversationId: string } => {
  const params = useParams();

  if (!params) {
    return {
      isOpen: false,
      conversationId: ''
    };
  }

  return {
    isOpen: !!params.conversationId,
    conversationId: params.conversationId
  };
};

export default useActiveConversationStatus;
