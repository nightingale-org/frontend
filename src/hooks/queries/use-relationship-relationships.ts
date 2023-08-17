import { useSession } from '@/hooks/use-session';
import { useMutation, UseMutationOptions, useQuery, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/api/query-keys';
import { getRelationships } from '@/lib/api/query-functions';
import { RelationShip, RelationshipType } from '@/lib/api/schemas';
import { del, post, put } from '@/lib/api/fetch';

export function useGetRelationships(type: RelationshipType) {
  const {
    session: { accessToken }
  } = useSession();

  return useQuery({
    queryKey: queryKeys.relationshipsList(type),
    queryFn: () => getRelationships({ accessToken, type })
  });
}

export function useRemoveFriend(relationshipId: string) {
  const {
    session: { accessToken }
  } = useSession();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => {
      return del({
        url: '/relationships',
        accessToken: accessToken,
        data: {
          relationship_id: relationshipId
        }
      });
    },
    onSuccess: () => {
      return queryClient.invalidateQueries({
        queryKey: queryKeys.relationshipsList(RelationshipType.settled)
      });
    }
  });
}

export function useUpdateRelationshipStatus(relationshipId: string) {
  const {
    session: { accessToken }
  } = useSession();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newState: 'accepted' | 'ignored') => {
      await post({
        url: '/relationships/update',
        accessToken: accessToken,
        data: {
          new_state: newState,
          relationship_id: relationshipId
        }
      });

      return { newState };
    },
    onSuccess: (data) => {
      return queryClient.setQueryData(
        queryKeys.relationshipsList(RelationshipType.pending),
        (oldRelationships: RelationShip[]) => {
          if (data.newState === 'accepted') {
            void queryClient.invalidateQueries({
              queryKey: queryKeys.relationshipsList(RelationshipType.settled)
            });
          }
          // If user accepted the friend request,
          // the relationship should be removed from the list and moved to "All" tab.
          // Otherwise, the relationship should be removed from the list.
          return oldRelationships.filter((r) => r.id !== relationshipId);
        }
      );
    }
  });
}

export function useAddToFriends(
  options?: Exclude<UseMutationOptions<unknown, unknown, string>, 'mutationFn'>
) {
  const {
    session: { accessToken }
  } = useSession();

  return useMutation<unknown, unknown, string, unknown>({
    mutationFn: async (username: string) => {
      return await put({
        url: '/relationships',
        data: {
          username: username
        },
        accessToken: accessToken
      });
    },
    ...options
  });
}
