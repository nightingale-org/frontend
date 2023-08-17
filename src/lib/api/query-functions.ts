import { type AuthorizationData, get, post } from '@/lib/api/fetch';
import { z } from 'zod';
import {
  ConversationPreviewSchema,
  ExistsResponseSchema,
  RelationShipSchema,
  RelationshipType,
  UserSchema
} from '@/lib/api/schemas';

export async function getConversationPreviews({ ctx, accessToken }: AuthorizationData) {
  return await get({
    url: `/conversations`,
    validationModel: z.array(ConversationPreviewSchema),
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
