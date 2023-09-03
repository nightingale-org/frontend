import { Layout } from '@/layouts';
import * as React from 'react';
import { GetServerSideProps } from 'next';
import { DehydratedProps } from '@/@types';
import { createQueryClient } from '@/lib/api/query-client';
import { queryKeys } from '@/lib/api/query-keys';
import { getConversationById, getConversationPreviews } from '@/lib/api/query-functions';
import { dehydrate } from '@tanstack/react-query';
import ConversationList from '@/components/LeftColumn/conversations/ConversationList';

export const getServerSideProps: GetServerSideProps<DehydratedProps> = async (ctx) => {
  const queryClient = createQueryClient();

  const conversationId = ctx.query.id as string;

  void Promise.all([
    queryClient.prefetchInfiniteQuery(queryKeys.conversationsList(), async () => {
      return await getConversationPreviews({ ctx });
    }),
    queryClient.prefetchQuery(queryKeys.conversationById(conversationId, false), async () => {
      return await getConversationById({ ctx, id: conversationId, preview: false });
    })
  ]);

  return {
    props: {
      dehydratedState: dehydrate(queryClient)
    }
  };
};

export default function Page() {
  return <ConversationList />;
}

Page.getLayout = (page) => {
  return <Layout.Default>{page}</Layout.Default>;
};
Page.auth = {};
