import { RelationShip } from '@/lib/api/schemas';
import UserBox from './UserBox';
import { SearchBar } from './ui/search-bar';
import { useState } from 'react';

interface InProps {
  relationships: RelationShip[];
}

export default function RelationShipList({ relationships }: InProps) {
  const [searchQuery, setSearchQuery] = useState<string>('');

  const onChange = async (value) => {
    setSearchQuery(value);

    const Fuse = (await import('fuse.js')).default;
    const fuse = new Fuse(relationships.map((r) => r.with_user.username));

    console.log(fuse.search(value));
  };

  return (
    <div className="px-3 pt-1">
      <SearchBar
        className="h-9"
        value={searchQuery}
        type="text"
        placeholder="Search"
        onChange={onChange}
      />
      {relationships.map((relationship) => (
        <UserBox key={relationship.with_user.id} user={relationship.with_user} />
      ))}
    </div>
  );
}
