import { Skeleton } from '@/components/ui/skeleton';

export default function UserBoxSkeleton() {
  return (
    <div className="flex w-full items-center space-x-4">
      <Skeleton className="h-12 w-12 rounded-full" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-[20px] w-full" />
        <Skeleton className="h-[20px] w-[calc(100%-1rem)] pr-4" />
      </div>
    </div>
  );
}
