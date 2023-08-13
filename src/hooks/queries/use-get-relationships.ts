import { useSession } from '@/hooks/use-session';
import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/api/query-keys';
import { getRelationships } from '@/lib/api/query-functions';
import type { RelationshipType } from '@/lib/api/schemas';

export function useGetRelationships(type: RelationshipType) {
  const {
    session: { accessToken }
  } = useSession();

  return useQuery({
    queryKey: queryKeys.relationshipsList(type),
    queryFn: () => getRelationships({ accessToken, type })
  });
}
