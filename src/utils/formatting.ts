import { RelationshipTypeExpanded } from '@/lib/api/schemas';

export const formatRelationshipType = (type: RelationshipTypeExpanded): string => {
  if (type === RelationshipTypeExpanded.ingoing_request) {
    return 'Incoming Request';
  } else if (type === RelationshipTypeExpanded.outgoing_request) {
    return 'Outgoing Request';
  } else {
    // TODO: There should be online status
    return 'Online';
  }
};
