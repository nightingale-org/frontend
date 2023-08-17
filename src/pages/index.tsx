import { GetServerSideProps } from 'next';
import { RelationshipType } from '@/lib/api/schemas';
import { getConversationPreviews, getRelationships } from '@/lib/api/query-functions';
import { Layout } from '@/layouts';
import ConversationList from '@/components/conversations/ConversationList';
import LoadingModal from '@/components/modals/LoadingModal';
import { dehydrate } from '@tanstack/react-query';
import { queryKeys } from '@/lib/api/query-keys';
import type { DehydratedProps } from '@/@types';
import { createQueryClient } from '@/lib/api/query-client';

export const getServerSideProps: GetServerSideProps<DehydratedProps> = async (ctx) => {
  const queryClient = createQueryClient();

  await Promise.all([
    queryClient.prefetchQuery(queryKeys.relationshipsList(RelationshipType.settled), () =>
      getRelationships({ ctx })
    ),
    queryClient.prefetchQuery(queryKeys.conversationsList(), () => getConversationPreviews({ ctx }))
  ]);

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
Home.auth = {
  loader: <LoadingModal />
};
