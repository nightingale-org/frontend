import { type AuthorizationData, get, post } from '@/lib/api/fetch';
import { z } from 'zod';
import type { Conversation, ConversationPreview } from '@/lib/api/schemas';
import {
  ConversationPreviewSchema,
  ConversationPreviewSchemaPaginated,
  ExistsResponseSchema,
  RelationShipSchema,
  UserSchema,
  RelationshipType,
  ConversationSchema
} from '@/lib/api/schemas';

export async function getConversationPreviews({
  ctx,
  accessToken,
  nextCursor
}: AuthorizationData & { nextCursor?: string }) {
  let url = '/conversations';
  if (nextCursor) {
    url = `${url}?next_cursor=${nextCursor}`;
  }

  return await get({
    url,
    validationModel: ConversationPreviewSchemaPaginated,
    // TODO: fix types
    ctx: ctx as any,
    accessToken: accessToken as any
  });
}

export async function getConversationById({
  id,
  ctx,
  accessToken,
  preview
}: AuthorizationData & { id: string; preview?: never }): Promise<Conversation>;
export async function getConversationById({
  id,
  ctx,
  accessToken,
  preview
}: AuthorizationData & { id: string; preview: false }): Promise<Conversation>;
export async function getConversationById({
  id,
  ctx,
  accessToken,
  preview
}: AuthorizationData & { id: string; preview: true }): Promise<ConversationPreview>;
export async function getConversationById({
  id,
  ctx,
  accessToken,
  preview = false
}: AuthorizationData & { id: string; preview?: boolean }): Promise<
  Conversation | ConversationPreview
> {
  let url = `/conversations/${id}`;
  if (preview) {
    url = `${url}?preview=true`;
  }

  const validationModel = preview ? ConversationPreviewSchema : ConversationSchema;

  return await get({
    url,
    // @ts-expect-error validationModel is not assignable to type
    validationModel: validationModel,
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
