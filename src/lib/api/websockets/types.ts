import type { RelationShip, RelationshipType, RelationshipTypeExpanded } from '@/lib/api/schemas';

export type FriendRequestRejectedEvent = {
  relationship_id: string;
  type: RelationshipType;
};

export type RelationshipDeletedEvent = {
  relationship_id: string;
  // TODO: This should be RelationshipType, might need to change in the future during refactoring
  type: RelationshipTypeExpanded;
};

export type EventsSeenPayload = {
  type: RelationshipType;
};

export interface ServerToClientEvents {
  ['relationship:delete']: (payload: RelationshipDeletedEvent) => void;
  ['relationship:new']: (payload: RelationShip) => void;
  ['relationship:request_rejected']: (payload: FriendRequestRejectedEvent) => void;
}

export interface ClientToServerEvents {
  ['relationship:events_seen']: (payload: EventsSeenPayload) => void;
}
