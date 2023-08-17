import { useSession } from '@/hooks/use-session';
import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/api/query-keys';
import { getConversationPreviews } from '@/lib/api/query-functions';

export function useGetConversationsPreviews() {
  const { session } = useSession();

  return useQuery({
    queryKey: queryKeys.conversationsList(),
    queryFn: () => getConversationPreviews({ accessToken: session.accessToken })
  });
}
