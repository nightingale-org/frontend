import { type AuthorizationData, get, post } from '@/lib/api/fetch/fetch';
import { z } from 'zod';
import {
  Conversation,
  ConversationSchema,
  ExistsResponseSchema,
  RelationShipSchema,
  UserSchema
} from '@/lib/api/schemas';

export async function getConversationById(id: string, { ctx, accessToken }: AuthorizationData) {
  return await get<Conversation>({
    url: `/conversations/${id}`,
    validationModel: ConversationSchema,
    // TODO: fix types
    ctx: ctx as any,
    accessToken: accessToken as any
  });
}

export async function getConversations({ ctx, accessToken }: AuthorizationData) {
  return await get({
    url: `/conversations`,
    validationModel: z.array(ConversationSchema),
    // TODO: fix types
    ctx: ctx as any,
    accessToken: accessToken as any
  });
}

export async function getRelationships({ ctx, accessToken }: AuthorizationData) {
  return await get({
    url: `/relationships`,
    validationModel: z.array(RelationShipSchema),
    // TODO: fix types
    ctx: ctx as any,
    accessToken: accessToken as any
  });
}

export async function getCurrentUser({ ctx, accessToken }: AuthorizationData) {
  return await get({
    url: `/users/me`,
    validationModel: UserSchema,
    ctx: ctx as any,
    accessToken: accessToken as any
  });
}

export async function checkIfUsernameIsAvailable(
  username: string,
  accessToken: string
): Promise<boolean> {
  const resp = await post({
    url: `/users/availability`,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    data: { username: username },
    validationModel: ExistsResponseSchema
  });

  return !resp.exists;
}
