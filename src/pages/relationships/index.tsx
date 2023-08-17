import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Layout } from '@/layouts';
import { getRelationships } from '@/lib/api/query-functions';
import { GetServerSideProps } from 'next';
import * as React from 'react';
import { useCallback, useEffect, useState } from 'react';
import { dehydrate, useQueryClient } from '@tanstack/react-query';
import type { DehydratedProps } from '@/@types';
import { queryKeys } from '@/lib/api/query-keys';
import { foldRelationshipType, RelationShip, RelationshipType } from '@/lib/api/schemas';
import { Icon } from '@/components/ui/icon';
import { createPortal } from 'react-dom';
import AddFriendModal from '@/components/AddFriendModal';
import dynamic from 'next/dynamic';
import LoadingModal from '@/components/modals/LoadingModal';
import { useWebsocket } from '@/hooks/websocket/use-websocket';
import { FriendRequestRejectedEvent, RelationshipDeletedEvent } from '@/lib/api/websockets/types';
import { UserPlus2 } from 'lucide-react';
import { useRouter } from 'next/router';
import { createQueryClient } from '@/lib/api/query-client';

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
  const queryClient = createQueryClient();

  const relationshipType = ctx.query.tab
    ? tabToEnumMapping[ctx.query.tab as TabName]
    : RelationshipType.settled;

  await queryClient.prefetchQuery(queryKeys.relationshipsList(RelationshipType.settled), () =>
    getRelationships({ ctx, type: relationshipType })
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
  const router = useRouter();
  const [currentTabName, setCurrentTabName] = useState(
    (typeof router.query.tab === 'string'
      ? Object.keys(tabToEnumMapping).includes(router.query.tab)
        ? router.query.tab
        : 'all'
      : 'all') as TabName
  );

  const onTabChange = useCallback(
    (newTab: string) => {
      router.push(`/relationships?tab=${newTab}`, undefined, { shallow: true }).then(() => {
        setCurrentTabName(newTab as TabName);
        websocket?.emit(`relationship:events_seen`, { type: tabToEnumMapping[newTab] });
      });
    },
    [websocket, router]
  );

  useEffect(() => {
    if (!websocket) {
      return;
    }

    const onNewRelationship = (relationship: RelationShip) => {
      queryClient.setQueryData(
        queryKeys.relationshipsList(foldRelationshipType(relationship.type)),
        (oldRelationships?: RelationShip[]) => {
          if (!oldRelationships) return [relationship];

          return [relationship, ...oldRelationships];
        }
      );
    };

    const onRelationshipDelete = ({ type, relationship_id }: RelationshipDeletedEvent) => {
      queryClient.setQueryData(
        queryKeys.relationshipsList(foldRelationshipType(type)),
        (old?: RelationShip[]) => old?.filter((r) => r.id !== relationship_id)
      );
    };

    const onFriendRequestReject = ({ relationship_id, type }: FriendRequestRejectedEvent) => {
      queryClient.setQueryData(queryKeys.relationshipsList(type), (old?: RelationShip[]) =>
        old?.filter((r) => r.id !== relationship_id)
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
            <UserPlus2 size={20} />
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
