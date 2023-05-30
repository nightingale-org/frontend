import { Prisma } from '@prisma/client';

export type MessageWithSeen = Prisma.MessageGetPayload<{
  include: { seen: true };
}>;

export type MessageWithSenderAndSeen = Prisma.MessageGetPayload<{
  include: { sender: true };
}> &
  MessageWithSeen;

export type ConversationWithUserAndMessages = Prisma.ConversationGetPayload<{
  include: { users: true; messages: true };
}>;

export type User = {
  id: string
  username: string | null
  email: string | null
  emailVerified: Date | null
  image: string | null
  createdAt: Date | null
}

export type ExistsResponse = {
  exists: boolean;
}