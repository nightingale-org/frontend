import { cn } from '@/utils/css-class-merge';
import { useEffect, useState } from 'react';
import useResizeObserver from '@/hooks/use-resize-observer';

type RelationshipListSkeletonProps = {
  containerRef: React.RefObject<HTMLDivElement>;
  renderSkeleton: (key: number) => React.ReactElement;
};

function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('animate-pulse rounded-md bg-slate-100 dark:bg-slate-800', className)}
      {...props}
    />
  );
}

function SkeletonContainer({ containerRef, renderSkeleton }: RelationshipListSkeletonProps) {
  const [numberOfSkeletons, setNumberOfSkeletons] = useState(0);
  useEffect(() => {
    if (containerRef.current === null) {
      return;
    }

    setNumberOfSkeletons(Math.floor(containerRef.current.clientHeight / 70));
  }, []);

  useResizeObserver(containerRef, (entry) => {
    setNumberOfSkeletons(Math.floor(entry.contentRect.height / 70));
  });

  return (
    <div className="mt-1 flex flex-col gap-1 p-3">
      {[...Array(numberOfSkeletons)].map((_, index) => renderSkeleton(index))}
    </div>
  );
}

export { Skeleton, SkeletonContainer };
