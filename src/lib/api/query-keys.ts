import type { RelationshipType } from '@/lib/api/schemas';

export const queryKeys = {
  relationshipsList: (type?: RelationshipType) => {
    return ['relationships', type];
  },
  conversationsList: () => {
    return ['conversations'];
  }
};
