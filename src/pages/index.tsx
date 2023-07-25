import { GetServerSideProps } from 'next';
import { Conversation, RelationShip } from '@/lib/api/schemas';
import { getConversations, getRelationships } from '@/lib/api/query-functions';
import { Layout } from '@/layouts';
import ConversationList from '@/components/ConversationList';
import LoadingModal from '@/components/modals/LoadingModal';

type ConversationLayoutProps = {
  relationships: RelationShip[];
  conversations: Conversation[];
};

export default function Home({ relationships, conversations }: ConversationLayoutProps) {
  return (
    <ConversationList
      relationships={relationships}
      title="Messages"
      conversations={conversations}
    />
  );
}

Home.getLayout = (page) => {
  return <Layout.Default>{page}</Layout.Default>;
};
Home.auth = {
  loader: <LoadingModal />
};

export const getServerSideProps: GetServerSideProps<ConversationLayoutProps> = async (context) => {
  const [conversations, relationships] = await Promise.all([
    getConversations({ctx: context}),
    getRelationships({ctx: context})
  ]);

  return {
    props: {
      conversations,
      relationships
    }
  };
};
