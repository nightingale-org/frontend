import { useGetRelationships } from '@/hooks/queries/use-get-relationships';
import type { RelationShip } from '@/lib/api/schemas';
import { RelationshipType } from '@/lib/api/schemas';
import { SearchBar } from '@/components/ui/search-bar';
import RelationshipListItem, {
  RelationshipListItemSkeleton
} from '@/components/relationships/RelationshipListItem';
import { memo, useCallback, useEffect, useRef, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/api/query-keys';
import { useWebsocket } from '@/hooks/use-websocket';
import { SkeletonContainer } from '@/components/ui/skeleton';

type RelationShipListProps = {
  type: RelationshipType;
};

function RelationShipList({ type }: RelationShipListProps) {
  const { data: relationships, status } = useGetRelationships(type);
  const queryClient = useQueryClient();
  const websocket = useWebsocket();
  const [searchQuery, setSearchQuery] = useState('');
  const divContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!websocket) {
      return;
    }

    const onNewRelationship = (relationship: RelationShip) => {
      queryClient.setQueryData(
        queryKeys.relationshipsList(type),
        (oldRelationships: RelationShip[]) => {
          return [relationship, ...oldRelationships];
        }
      );
    };

    const onRelationshipDelete = (relationship: RelationShip) => {
      queryClient.setQueryData(queryKeys.relationshipsList(type), (old: RelationShip[]) =>
        old.filter((r) => r.id !== relationship.id)
      );
    };

    websocket.on('relationship:new', onNewRelationship);
    websocket.on('relationship:delete', onRelationshipDelete);

    return () => {
      websocket.off('relationship:new', onNewRelationship);
      websocket.off('relationship:delete', onRelationshipDelete);
    };
  }, [websocket, queryClient, type]);

  const handleRelationshipStatusUpdate = useCallback(
    (relationship: RelationShip, newStatus: 'ignored' | 'accepted') => {
      queryClient.setQueryData(
        queryKeys.relationshipsList(type),
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
    [queryClient, type]
  );

  const onSearchQueryChange = useCallback((newSearchQuery: string) => {
    setSearchQuery(newSearchQuery);
  }, []);

  return (
    <div className="flex h-full w-full flex-col">
      <div className="px-3">
        <SearchBar
          className="h-9 rounded-full"
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
