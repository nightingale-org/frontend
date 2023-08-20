import { ConversationPreview, RelationshipTypeExpanded } from '@/lib/api/schemas';

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

export const formatLastMessageOfConversation = (
  conversation: ConversationPreview
): string | null => {
  if (!conversation.last_message) {
    return null;
  }

  if (conversation.is_group) {
    return `${conversation.last_message.author.username}: ${conversation.last_message.text}`;
  }

  return conversation.last_message.text;
};
