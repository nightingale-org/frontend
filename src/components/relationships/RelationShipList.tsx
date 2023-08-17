import { useGetRelationships } from '@/hooks/queries/use-relationship-relationships';
import { RelationshipType } from '@/lib/api/schemas';
import { SearchBar } from '@/components/ui/search-bar';
import RelationshipListItem, {
  RelationshipListItemSkeleton
} from '@/components/relationships/RelationshipListItem';
import { memo, useCallback, useRef, useState } from 'react';
import { SkeletonContainer } from '@/components/ui/skeleton';
import { ScrollArea } from '@/components/ui/scroll-area';

type RelationShipListProps = {
  type: RelationshipType;
};

function RelationShipList({ type }: RelationShipListProps) {
  const { data: relationships, status } = useGetRelationships(type);
  const [searchQuery, setSearchQuery] = useState('');
  const divContainerRef = useRef<HTMLDivElement>(null);

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
      <ScrollArea className="mt-1 flex-1" ref={divContainerRef}>
        {status === 'loading' ? (
          <SkeletonContainer
            className="flex flex-col gap-1 p-3"
            containerRef={divContainerRef}
            renderSkeleton={(key) => <RelationshipListItemSkeleton key={key} />}
          />
        ) : (
          <>
            {relationships!.map((relationship) => (
              <RelationshipListItem key={relationship.id} relationship={relationship} />
            ))}
          </>
        )}
      </ScrollArea>
    </div>
  );
}

export default memo(RelationShipList);
