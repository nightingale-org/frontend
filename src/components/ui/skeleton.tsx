import { cn } from '@/utils/css-class-merge';
import { useEffect, useState } from 'react';

type RelationshipListSkeletonProps = {
  containerRef: React.RefObject<HTMLDivElement>;
  renderSkeleton: (key: number) => React.ReactElement;
  className?: string;
};

function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('animate-pulse rounded-md bg-slate-100 dark:bg-slate-800', className)}
      {...props}
    />
  );
}

function SkeletonContainer({
  containerRef,
  renderSkeleton,
  className
}: RelationshipListSkeletonProps) {
  const [numberOfSkeletons, setNumberOfSkeletons] = useState(0);

  useEffect(() => {
    if (containerRef.current === null) {
      return;
    }

    // TODO: we don't know for sure what is the height of the skeleton.
    // Pre-render a skeleton one time to get it's sizes might be a good idea, consider later.
    setNumberOfSkeletons(Math.floor(containerRef.current.clientHeight / 60));
  }, []);

  return (
    <div className={className}>
      {[...Array(numberOfSkeletons)].map((_, index) => renderSkeleton(index))}
    </div>
  );
}

export { Skeleton, SkeletonContainer };
