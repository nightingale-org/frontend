import useConversationId from '@/hooks/use-conversation-id';
import MessageContainerHeader from '@/components/RightColumn/MessageContainerHeader';
import { useGetConversationPreviewById } from '@/hooks/queries/use-conversation-queries';

export default function RightColumn() {
  const conversationId = useConversationId();
  const { data: conversationPreview, isLoading } = useGetConversationPreviewById(conversationId);

  if (!conversationId) {
    return (
      <div className="hidden h-full items-center justify-center bg-gray-100 px-4 py-10 sm:px-6 md:flex md:px-8 md:py-6">
        <div className="flex flex-col items-center text-center">
          <h3 className="mt-2 text-2xl font-semibold text-gray-900">
            Select a chat or start a new conversation
          </h3>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return null;
  }

  return (
    <div className="bg-gray-100">
      <MessageContainerHeader conversation={conversationPreview} />
      <div className="flex-1"></div>
      <div></div>
    </div>
  );
}
