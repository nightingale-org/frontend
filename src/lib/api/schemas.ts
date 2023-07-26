import { z } from 'zod';

export enum RelationshipType {
  ingoing_request = 0,
  outgoing_request,
  blocked,
  established
}

export const UserSchema = z.object({
  id: z.string(),
  username: z.string(),
  email: z.string(),
  emailVerified: z.date().nullable(),
  image: z.string().nullable(),
  createdAt: z.date().nullable(),
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
  created_at: z.date(),
  seen_by: z.array(UserSchema),
  author: UserSchema
});
export type Message = z.infer<typeof MessageSchema>;

export const ConversationSchema = z.object({
  id: z.string(),
  created_at: z.date(),
  last_message_at: z.date().nullable(),
  name: z.string().nullable(),
  user_limit: z.number().nullable(),
  members: z.array(UserSchema),
  messages: z.array(MessageSchema),
  is_group: z.boolean()
});

export type Conversation = z.infer<typeof ConversationSchema>;

export const RelationShipSchema = z.object({
  with_user: UserSchema,
  type: z.nativeEnum(RelationshipType)
});
export type RelationShip = z.infer<typeof RelationShipSchema>;
