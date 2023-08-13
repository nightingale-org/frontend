import { useGetRelationships } from '@/hooks/queries/use-get-relationships';
import type { RelationShip } from '@/lib/api/schemas';
import { RelationshipType } from '@/lib/api/schemas';
import { SearchBar } from '@/components/ui/search-bar';
import RelationshipListItem, {
  RelationshipListItemSkeleton
} from '@/components/relationships/RelationshipListItem';
import { memo, useCallback, useRef, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/api/query-keys';
import { SkeletonContainer } from '@/components/ui/skeleton';
import { DEBUG } from '@/constants';

type RelationShipListProps = {
  type: RelationshipType;
};

function RelationShipList({ type }: RelationShipListProps) {
  const { data: relationships, status } = useGetRelationships(type);
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');
  const divContainerRef = useRef<HTMLDivElement>(null);

  // Only used if the relationships are pending.
  // This event handler is used to accept/reject friend requests.
  const handleRelationshipStatusUpdate = useCallback(
    (relationship: RelationShip, newStatus: 'ignored' | 'accepted') => {
      if (type !== RelationshipType.pending) {
        if (DEBUG)
          console.warn(
            'handleRelationshipStatusUpdate should only be used for pending relationships.'
          );
        return;
      }

      queryClient.setQueryData(
        queryKeys.relationshipsList(RelationshipType.pending),
        (oldRelationships: RelationShip[]) => {
          if (newStatus === 'accepted') {
            void queryClient.invalidateQueries({
              queryKey: queryKeys.relationshipsList(RelationshipType.settled)
            });
          }
          // If user accepted the friend request,
          // the relationship should be removed from the list and moved to "All" tab.
          // Otherwise, the relationship should be removed from the list.
          return oldRelationships.filter((r) => r.id !== relationship.id);
        }
      );
    },
    [queryClient]
  );

  const onSearchQueryChange = useCallback((newSearchQuery: string) => {
    setSearchQuery(newSearchQuery);
  }, []);

  return (
    <div className="flex h-full w-full flex-col">
      <div className="px-3">
        <SearchBar
          className="h-9"
          value={searchQuery}
          type="text"
          placeholder="Search"
          onChange={onSearchQueryChange}
        />
      </div>
      <div className="mt-1 flex-1" ref={divContainerRef}>
        {status === 'loading' ? (
          <SkeletonContainer
            containerRef={divContainerRef}
            renderSkeleton={(key) => <RelationshipListItemSkeleton key={key} />}
          />
        ) : (
          <>
            {relationships!.map((relationship) => (
              <RelationshipListItem
                key={relationship.id}
                onRelationshipStatusUpdate={handleRelationshipStatusUpdate}
                relationship={relationship}
              />
            ))}
          </>
        )}
      </div>
    </div>
  );
}

export default memo(RelationShipList);
