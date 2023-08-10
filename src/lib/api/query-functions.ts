import { type AuthorizationData, get, post, put } from '@/lib/api/fetch';
import { z } from 'zod';
import {
  Conversation,
  ConversationSchema,
  ExistsResponseSchema,
  RelationShipSchema,
  RelationshipType,
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

export async function addToFriends(username: string, { ctx, accessToken }: AuthorizationData) {
  return await put({
    url: '/relationships',
    data: {
      username: username
    },
    accessToken: accessToken as any,
    ctx: ctx as any,
    headers: {
      'Content-Type': 'application/json'
    }
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

export async function getRelationships({
  ctx,
  accessToken,
  type = RelationshipType.settled
}: AuthorizationData & { type?: RelationshipType }) {
  const searchParams = new URLSearchParams({
    type: type.toString()
  });

  return await get({
    url: `/relationships?${searchParams}`,
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
    accessToken: accessToken,
    data: { username: username },
    validationModel: ExistsResponseSchema
  });

  return !resp.exists;
}

export async function updateRelationshipStatus(
  new_status: 'accepted' | 'ignored',
  relationshipId: string,
  accessToken: string
) {
  await post({
    url: '/relationships/update',
    accessToken: accessToken,
    data: {
      new_state: new_status,
      relationship_id: relationshipId
    }
  });
}
