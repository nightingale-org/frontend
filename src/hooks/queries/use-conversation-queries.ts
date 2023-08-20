import { useSession } from '@/hooks/use-session';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/api/query-keys';
import { getConversationPreviewById, getConversationPreviews } from '@/lib/api/query-functions';

export function useGetConversationsPreviews() {
  const { session } = useSession();

  return useInfiniteQuery({
    queryKey: queryKeys.conversationsList(),
    queryFn: async ({ pageParam: nextCursor }) => {
      return await getConversationPreviews({ accessToken: session.accessToken, nextCursor });
    },
    getNextPageParam: (lastPage) => lastPage.next_cursor
  });
}

export function useGetConversationPreviewById(conversationId: string | null) {
  const { session } = useSession();

  return useQuery({
    // @ts-expect-error handled by "enabled" flag
    queryKey: queryKeys.conversationById(conversationId),
    queryFn: async () => {
      return await getConversationPreviewById({
        // @ts-expect-error handled by "enabled" flag
        id: conversationId,
        accessToken: session.accessToken
      });
    },
    enabled: !!conversationId
  });
}
