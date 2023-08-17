import { z } from 'zod';
import { AVATAR_PLACEHOLDER_SRC } from '@/constants';

export enum RelationshipType {
  pending = 1,
  blocked = 2,
  settled = 3
}

export enum RelationshipTypeExpanded {
  ingoing_request = 1,
  outgoing_request = 2,
  blocked = 3,
  settled = 4
}

export const foldRelationshipType = (type: RelationshipTypeExpanded): RelationshipType => {
  switch (type) {
    case RelationshipTypeExpanded.ingoing_request:
    case RelationshipTypeExpanded.outgoing_request:
      return RelationshipType.pending;
    case RelationshipTypeExpanded.blocked:
      return RelationshipType.blocked;
    case RelationshipTypeExpanded.settled:
      return RelationshipType.settled;
  }
};

export const UserSchema = z.object({
  id: z.string(),
  username: z.string(),
  email: z.string(),
  email_verified: z.string().datetime().nullish(),
  image: z
    .string()
    .nullable()
    .transform((val) => val || AVATAR_PLACEHOLDER_SRC),
  created_at: z.string().datetime().nullable(),
  bio: z.string().nullable()
});
export type User = z.infer<typeof UserSchema>;

export const ExistsResponseSchema = z.object({
  exists: z.boolean()
});
export type ExistsResponse = z.infer<typeof ExistsResponseSchema>;

export const MessageSchema = z.object({
  id: z.string(),
  text: z.string(),
  created_at: z.string().datetime(),
  seen_by: z.array(UserSchema),
  author: UserSchema
});
export type Message = z.infer<typeof MessageSchema>;

const MessagePreview = z.object({
  id: z.string(),
  text: z.string(),
  created_at: z.string().datetime(),
  author: UserSchema
});

export const ConversationPreviewSchema = z.object({
  id: z.string(),
  created_at: z.string().datetime(),
  name: z.string().nullable(),
  user_limit: z.number().nullable(),
  last_message: MessagePreview.nullable()
});

export type ConversationPreview = z.infer<typeof ConversationPreviewSchema>;

export const RelationShipSchema = z.object({
  id: z.string(),
  target: UserSchema,
  type: z.nativeEnum(RelationshipTypeExpanded)
});
export type RelationShip = z.infer<typeof RelationShipSchema>;
