import type { RelationshipType } from '@/lib/api/schemas';

export const queryKeys = {
  relationshipsList: (type?: RelationshipType) => {
    return ['relationships', type];
  },
  conversationsList: () => {
    return ['conversations'];
  },
  conversationById: (conversationId: string, preview: boolean) => {
    return ['conversations', conversationId, preview];
  }
};
