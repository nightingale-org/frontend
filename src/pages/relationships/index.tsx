import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Layout } from '@/layouts';
import { getRelationships } from '@/lib/api/query-functions';
import { GetServerSideProps } from 'next';
import * as React from 'react';
import { useState } from 'react';
import { dehydrate, QueryClient } from '@tanstack/react-query';
import type { DehydratedProps } from '@/@types';
import { queryKeys } from '@/lib/api/query-keys';
import { RelationshipType } from '@/lib/api/schemas';
import { MdPersonAddAlt } from 'react-icons/md';
import { Icon } from '@/components/ui/icon';
import { createPortal } from 'react-dom';
import AddFriendModal from '@/components/AddFriendModal';
import dynamic from 'next/dynamic';
import LoadingModal from '@/components/modals/LoadingModal';

const RelationShipList = dynamic(() => import('@/components/relationships/RelationShipList'), {
  ssr: false
});

export const getServerSideProps: GetServerSideProps<DehydratedProps> = async (ctx) => {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery(queryKeys.relationshipsList(RelationshipType.settled), () =>
    getRelationships({ ctx, type: RelationshipType.settled })
  );

  return {
    props: {
      dehydratedState: dehydrate(queryClient)
    }
  };
};

export default function RelationShipPage() {
  const [isAddFriendModalOpened, setIsAddFriendModalOpened] = useState(false);

  const onAddFriendModalOpen = () => {
    setIsAddFriendModalOpened(true);
  };

  const onAddFriendModalClose = () => {
    setIsAddFriendModalOpened(false);
  };

  return (
    <aside className="fixed inset-y-0 left-0 w-full overflow-y-auto border-r border-gray-200 pb-20 lg:left-20 lg:block lg:w-80 lg:pb-0">
      <div className="flex h-full flex-col">
        <div className="flex items-center justify-between">
          <div className="py-4 pl-4 text-2xl font-bold text-neutral-800">Friends</div>
          <Icon onClick={onAddFriendModalOpen}>
            <MdPersonAddAlt size={20} />
          </Icon>
        </div>
        <Tabs defaultValue="all" className="flex flex-1 flex-col px-0.5">
          <TabsList className="w-full justify-stretch bg-inherit">
            <TabsTrigger className="flex-1 data-[state=active]:bg-slate-100" value="all">
              <span className="text-base font-medium">All</span>
            </TabsTrigger>
            <TabsTrigger className="flex-1 data-[state=active]:bg-slate-100" value="pending">
              <span className="text-base font-medium">Pending</span>
            </TabsTrigger>
            <TabsTrigger className="flex-1 data-[state=active]:bg-slate-100" value="blocked">
              <span className="text-base font-medium">Blocked</span>
            </TabsTrigger>
          </TabsList>
          <TabsContent className="h-full" value="all">
            <RelationShipList type={RelationshipType.settled} />
          </TabsContent>
          <TabsContent className="h-full" value="pending">
            {
              // TODO: It should fetch ingoing + outgoing but changes on the backend required
            }
            <RelationShipList type={RelationshipType.pending} />
          </TabsContent>
          <TabsContent className="h-full" value="blocked">
            <RelationShipList type={RelationshipType.blocked} />
          </TabsContent>
        </Tabs>
        {
          // TODO: Consider moving createPortal inside the component
          createPortal(
            <AddFriendModal isOpen={isAddFriendModalOpened} onClose={onAddFriendModalClose} />,
            document.body
          )
        }
      </div>
    </aside>
  );
}

RelationShipPage.getLayout = (page) => {
  return <Layout.Default>{page}</Layout.Default>;
};
RelationShipPage.auth = {
  loader: <LoadingModal />
};
