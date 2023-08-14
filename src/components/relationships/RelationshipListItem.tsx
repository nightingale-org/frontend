import type { RelationShip } from '@/lib/api/schemas';
import { RelationshipTypeExpanded } from '@/lib/api/schemas';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { CheckCircle2, MessageCircle, MoreVertical, XCircle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { memo } from 'react';
import { updateRelationshipStatus } from '@/lib/api/query-functions';
import { useSession } from '@/hooks/use-session';
import { formatRelationshipType } from '@/utils/formatting';
import { Skeleton } from '@/components/ui/skeleton';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';

interface RelationshipListItemProps {
  relationship: RelationShip;
  onRelationshipStatusUpdate?: (arg: RelationShip, new_status: 'ignored' | 'accepted') => void;
}

export function RelationshipListItemSkeleton() {
  return (
    <div className="flex items-center space-x-4">
      <Skeleton className="h-12 w-12 rounded-full" />
      <div className="space-y-2">
        <Skeleton className="h-[20px] w-[250px]" />
        <Skeleton className="h-[20px] w-[200px]" />
      </div>
    </div>
  );
}

const RelationshipListItem = ({
  relationship,
  onRelationshipStatusUpdate
}: RelationshipListItemProps) => {
  const { session } = useSession();

  const handleAcceptRequest = () => {
    updateRelationshipStatus('accepted', relationship.id, session.accessToken).then(() =>
      onRelationshipStatusUpdate?.(relationship, 'accepted')
    );
  };
  const handleIgnoreRequest = () => {
    updateRelationshipStatus('ignored', relationship.id, session.accessToken).then(() => {
      onRelationshipStatusUpdate?.(relationship, 'ignored');
    });
  };

  return (
    <div className="group relative flex w-full cursor-pointer items-center space-x-3 rounded-lg p-3 transition hover:bg-neutral-100">
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
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 p-2 transition group-hover:brightness-[98%]">
                <MessageCircle />
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-xs">Message</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <DropdownMenu>
              <TooltipTrigger asChild>
                <DropdownMenuTrigger asChild>
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 p-2 transition group-hover:brightness-[98%]">
                    <MoreVertical />
                  </div>
                </DropdownMenuTrigger>
              </TooltipTrigger>
              <DropdownMenuContent className="w-16 text-red-500">
                <DropdownMenuItem>
                  <span className="text-xs">Remove friend</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
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
