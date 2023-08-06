import { useGetRelationships } from '@/hooks/queries/use-get-relationships';
import { RelationshipType } from '@/lib/api/schemas';
import RelationShipListView from '@/components/relationships/RelationShipListView';

type RelationShipListProps = {
  type: RelationshipType;
};

export default function RelationShipList({ type }: RelationShipListProps) {
  const { data: relationships, status } = useGetRelationships(type);
  if (status === 'loading') {
    return <span>loading...</span>;
  }

  return <RelationShipListView relationships={relationships!} />;
}
