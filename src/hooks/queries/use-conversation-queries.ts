import { useSession } from '@/hooks/use-session';
import { useInfiniteQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/api/query-keys';
import { getConversationPreviews } from '@/lib/api/query-functions';

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
