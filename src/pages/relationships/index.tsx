import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Layout } from '@/layouts';
import { getRelationships } from '@/lib/api/query-functions';
import { GetServerSideProps } from 'next';
import * as React from 'react';
import { useCallback, useEffect, useState } from 'react';
import { dehydrate, QueryClient, useQueryClient } from '@tanstack/react-query';
import type { DehydratedProps } from '@/@types';
import { queryKeys } from '@/lib/api/query-keys';
import { foldRelationshipType, RelationShip, RelationshipType } from '@/lib/api/schemas';
import { MdPersonAddAlt } from 'react-icons/md';
import { Icon } from '@/components/ui/icon';
import { createPortal } from 'react-dom';
import AddFriendModal from '@/components/AddFriendModal';
import dynamic from 'next/dynamic';
import LoadingModal from '@/components/modals/LoadingModal';
import { useWebsocket } from '@/hooks/websocket/use-websocket';
import { FriendRequestRejectedEvent, RelationshipDeletedEvent } from '@/lib/api/websockets/types';

const RelationShipList = dynamic(() => import('@/components/relationships/RelationShipList'), {
  ssr: false
});

const tabToEnumMapping = {
  all: RelationshipType.settled,
  pending: RelationshipType.pending,
  blocked: RelationshipType.blocked
};

type TabName = 'all' | 'pending' | 'blocked';

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
  const websocket = useWebsocket();
  const queryClient = useQueryClient();
  const [currentTabName, setCurrentTabName] = useState('all' as TabName);
  const [crossTabRelationshipCounts, setCrossTabRelationshipCounts] = useState({
    all: 0,
    pending: 0,
    blocked: 0
  } as Record<TabName, number>);

  const onTabChange = useCallback(
    (newTab: string) => {
      setCurrentTabName(newTab as TabName);

      if (!websocket) return;

      websocket.emit(`relationship:events_seen`, { type: tabToEnumMapping[newTab] });
    },
    [websocket]
  );

  useEffect(() => {
    if (!websocket) {
      return;
    }

    const onNewRelationship = (relationship: RelationShip) => {
      queryClient.setQueryData(
        queryKeys.relationshipsList(foldRelationshipType(relationship.type)),
        (oldRelationships: RelationShip[]) => {
          return [relationship, ...oldRelationships];
        }
      );
    };

    const onRelationshipDelete = ({ type, relationship_id }: RelationshipDeletedEvent) => {
      queryClient.setQueryData(
        queryKeys.relationshipsList(foldRelationshipType(type)),
        (old: RelationShip[]) => old.filter((r) => r.id !== relationship_id)
      );
    };

    const onFriendRequestReject = ({ relationship_id, type }: FriendRequestRejectedEvent) => {
      queryClient.setQueryData(queryKeys.relationshipsList(type), (old: RelationShip[]) =>
        old.filter((r) => r.id !== relationship_id)
      );
    };

    websocket.on('relationship:request_rejected', onFriendRequestReject);
    websocket.on('relationship:new', onNewRelationship);
    websocket.on('relationship:delete', onRelationshipDelete);

    return () => {
      websocket.off('relationship:new', onNewRelationship);
      websocket.off('relationship:delete', onRelationshipDelete);
      websocket.removeAllListeners('relationship:request_rejected');
    };
  }, [websocket, queryClient]);

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
        <Tabs
          onValueChange={onTabChange}
          value={currentTabName}
          defaultValue="all"
          className="flex flex-1 flex-col px-0.5"
        >
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
