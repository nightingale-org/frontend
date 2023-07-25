import RelationShipList from '@/components/RelationShipList';
import UserBox from '@/components/UserBox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Layout } from '@/layouts';
import { getRelationships } from '@/lib/api/query-functions';
import { GetServerSideProps } from 'next';
import AddFriendModal from '@/components/AddFriendModal';
import * as React from 'react';
import { useState } from 'react';
import { dehydrate, QueryClient } from '@tanstack/react-query';
import type { DehydratedProps } from '@/@types';
import { queryKeys } from '@/lib/api/query-keys';
import { useGetRelationships } from '@/hooks/queries/use-get-relationships';

export const getServerSideProps: GetServerSideProps<DehydratedProps> = async (ctx) => {
  const queryClient = new QueryClient();
  console.log(ctx)
  await queryClient.prefetchQuery(queryKeys.relationshipsList(), () => getRelationships({ctx}));

  return {
    props: {
      dehydratedState: dehydrate(queryClient)
    }
  };
};

export default function RelationShip() {
  const [isAddFriendModalOpened, setIsAddFriendModalOpened] = useState(false);

  const { data: relationships } = useGetRelationships()

  const onAddFriendModalOpen = () => {
    setIsAddFriendModalOpened(true);
  };

  const onAddFriendModalClose = () => {
    setIsAddFriendModalOpened(false);
  };

  return (
    <aside
      className="
        fixed
        inset-y-0
        left-0
        block
        w-full
        overflow-y-auto
        border-r
        border-gray-200
        pb-20
        lg:left-20
        lg:block lg:w-80 lg:pb-0
      "
    >
      <div>
        <div className="flex-col">
          <div
            className="
              py-4
              pl-4
              text-2xl
              font-bold
              text-neutral-800
            "
          >
            Friends
          </div>
        </div>
        <Tabs defaultValue="all" className="px-0.5">
          <TabsList className="w-full justify-stretch bg-inherit">
            <TabsTrigger className="flex-1 data-[state=active]:bg-slate-100" value="all">
              All
            </TabsTrigger>
            <TabsTrigger className="flex-1 data-[state=active]:bg-slate-100" value="pending">
              Pending
            </TabsTrigger>
            <TabsTrigger className="flex-1 data-[state=active]:bg-slate-100" value="blocked">
              Blocked
            </TabsTrigger>
            <TabsTrigger
              onClick={onAddFriendModalOpen}
              className="flex-1 data-[state=active]:bg-emerald-100"
              value="add_friend"
            >
              Add friend
            </TabsTrigger>
          </TabsList>
          <TabsContent value="all">
            <RelationShipList relationships={[]} />
          </TabsContent>
          <TabsContent value="pending">
            <RelationShipList relationships={[]} />
          </TabsContent>
          <TabsContent value="blocked">
            <RelationShipList relationships={[]} />
          </TabsContent>
          <TabsContent value="add_friend">
            <AddFriendModal isOpen={isAddFriendModalOpened} onClose={onAddFriendModalClose} />
          </TabsContent>
        </Tabs>
        {[].map((relationship) => (
          <UserBox key={relationship.with_user.id} user={relationship.with_user} />
        ))}
      </div>
    </aside>
  );
}

RelationShip.getLayout = (page) => {
  return <Layout.Default>{page}</Layout.Default>;
};
RelationShip.auth = {};
