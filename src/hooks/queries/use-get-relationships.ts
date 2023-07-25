import { useSession } from '@/hooks/use-session';
import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/api/query-keys';
import { getRelationships } from '@/lib/api/query-functions';

export function useGetRelationships() {
  const {
    session: { accessToken }
  } = useSession();

  return useQuery({
    queryKey: queryKeys.relationshipsList(),
    queryFn: () => getRelationships({accessToken})
  });
}
