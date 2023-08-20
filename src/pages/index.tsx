import { GetServerSideProps } from 'next';
import { getConversationPreviews } from '@/lib/api/query-functions';
import { Layout } from '@/layouts';
import ConversationList from '@/components/LeftColumn/conversations/ConversationList';
import { dehydrate } from '@tanstack/react-query';
import { queryKeys } from '@/lib/api/query-keys';
import type { DehydratedProps } from '@/@types';
import { createQueryClient } from '@/lib/api/query-client';

export const getServerSideProps: GetServerSideProps<DehydratedProps> = async (ctx) => {
  const queryClient = createQueryClient();

  void queryClient.prefetchInfiniteQuery(queryKeys.conversationsList(), async () => {
    return await getConversationPreviews({ ctx });
  });

  return {
    props: {
      dehydratedState: dehydrate(queryClient)
    }
  };
};

export default function Home() {
  return <ConversationList />;
}

Home.getLayout = (page) => {
  return <Layout.Default>{page}</Layout.Default>;
};
Home.auth = {};
