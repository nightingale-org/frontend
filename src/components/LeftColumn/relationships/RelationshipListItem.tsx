import type { RelationShip } from '@/lib/api/schemas';
import { RelationshipTypeExpanded } from '@/lib/api/schemas';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { CheckCircle2, MessageCircle, MoreVertical, XCircle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { memo, useCallback } from 'react';
import { formatRelationshipType } from '@/utils/formatting';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog';
import {
  useRemoveFriend,
  useUpdateRelationshipStatus
} from '@/hooks/queries/use-relationship-relationships';
import Link from 'next/link';
import AnimatedIcon from '@/components/common/AnimatedIcon';
import { useRouter } from 'next/router';

interface RelationshipListItemProps {
  relationship: RelationShip;
}

const RelationshipListItem = ({ relationship }: RelationshipListItemProps) => {
  const router = useRouter();
  const removeFriend = useRemoveFriend(relationship.id);
  const updateRelationshipStatus = useUpdateRelationshipStatus(relationship.id);

  const onFriendRemoval: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    // Prevent the click event from bubbling up to the parent element and opening a conversation
    e.stopPropagation();
    removeFriend.mutate();
  };
  const handleAcceptRequest = () => {
    updateRelationshipStatus.mutate('accepted');
  };
  const handleIgnoreRequest = () => {
    updateRelationshipStatus.mutate('ignored');
  };

  const handleOpenConversation: React.MouseEventHandler<HTMLDivElement> = useCallback(
    (e) => {
      if (relationship.type !== RelationshipTypeExpanded.settled) return;
      if (e.target instanceof HTMLElement) {
        if (e.target.dataset.stoppropagation === 'true') return;
      }

      void router.push(`/conversations/${relationship.conversation_id}/`);
    },
    [router, relationship.conversation_id, relationship.type]
  );

  return (
    <div
      role="button"
      onClick={handleOpenConversation}
      className="group relative flex w-full cursor-pointer items-center space-x-3 rounded-lg p-3 transition hover:bg-neutral-100"
    >
      <Avatar>
        <AvatarImage src={relationship.target.image} />
        <AvatarFallback>{relationship.target.username}</AvatarFallback>
      </Avatar>
      <div className="min-w-0 flex-1">
        <div className="focus:outline-none">
          <span className="absolute inset-0" aria-hidden="true" />
          <div className="mb-1 flex flex-col overflow-hidden">
            <p className="overflow-hidden text-sm font-medium text-gray-900">
              {relationship.target.username}
            </p>
            <p className="text-xs font-medium text-slate-400">
              {formatRelationshipType(relationship.type)}
            </p>
          </div>
        </div>
      </div>
      {relationship.type === RelationshipTypeExpanded.settled ? (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              {relationship.type === RelationshipTypeExpanded.settled &&
              relationship.conversation_id ? (
                <Link
                  className="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-gray-100 p-2 transition group-hover:brightness-[98%]"
                  href={`/conversations/${relationship.conversation_id}/`}
                >
                  <AnimatedIcon fillColorOnHover Icon={MessageCircle} />
                </Link>
              ) : null}
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-xs">Message</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <AlertDialog>
              <DropdownMenu>
                <TooltipTrigger asChild>
                  <DropdownMenuTrigger asChild>
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 p-2 transition group-hover:brightness-[98%]">
                      <AnimatedIcon fillColorOnHover Icon={MoreVertical} />
                    </div>
                  </DropdownMenuTrigger>
                </TooltipTrigger>
                <DropdownMenuContent className="w-16 text-red-500">
                  <AlertDialogTrigger asChild>
                    <DropdownMenuItem>
                      <span className="text-xs" data-stoppropagation="true">
                        Remove friend
                      </span>
                    </DropdownMenuItem>
                  </AlertDialogTrigger>
                </DropdownMenuContent>
              </DropdownMenu>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Remove {`'${relationship.target.username}'`}</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to permanently remove{' '}
                    {`'${relationship.target.username}'`} from your friends?
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel data-stoppropagation="true">Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={onFriendRemoval}>Remove friend</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            <TooltipContent>
              <p className="text-xs">More</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ) : null}
      {relationship.type === RelationshipTypeExpanded.ingoing_request ? (
        <div className="absolute right-4 flex gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <CheckCircle2
                  size={35}
                  strokeWidth={0.7}
                  className="transition duration-150 hover:text-green-500"
                  onClick={handleAcceptRequest}
                />
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs">Accept</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger>
                <XCircle
                  size={35}
                  strokeWidth={0.7}
                  className="transition duration-150 hover:text-red-500"
                  onClick={handleIgnoreRequest}
                />
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs">Ignore</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      ) : null}
    </div>
  );
};
export default memo(RelationshipListItem);
