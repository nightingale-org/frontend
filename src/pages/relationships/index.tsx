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
import { createPortal } from 'react-dom';
import AddFriendModal from '@/components/LeftColumn/relationships/AddFriendModal';
import dynamic from 'next/dynamic';
import { useWebsocket } from '@/hooks/websocket/use-websocket';
import { FriendRequestRejectedEvent, RelationshipDeletedEvent } from '@/lib/api/websockets/types';
import { useRouter } from 'next/router';
import { createQueryClient } from '@/lib/api/query-client';
import Aside from '@/components/LeftColumn/Aside';
import { UserPlus2 } from 'lucide-react';
import { Icon } from '@/components/ui/icon';

const RelationShipList = dynamic(
  () => import('@/components/LeftColumn/relationships/RelationShipList'),
  {
    ssr: false
  }
);

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
          if (!oldRelationships) {
            return [relationship];
          }

          return [relationship, ...oldRelationships];
        }
      );
    };

    const onRelationshipDelete = ({ type, relationship_id }: RelationshipDeletedEvent) => {
      queryClient.setQueryData(
        queryKeys.relationshipsList(foldRelationshipType(type)),
        (old?: RelationShip[]) => {
          return old?.filter((r) => r.id !== relationship_id);
        }
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
    <Aside className="relative" name="Friends">
      <Icon className="absolute right-0 top-4" onClick={onAddFriendModalOpen}>
        <UserPlus2 size={20} />
      </Icon>
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
    </Aside>
  );
}

RelationShipPage.getLayout = (page) => {
  return <Layout.Default>{page}</Layout.Default>;
};
RelationShipPage.auth = {};
