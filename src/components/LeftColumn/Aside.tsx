import { cn } from '@/utils/css-class-merge';

type AsideProps = {
  children?: React.ReactNode;
  name: string;
  className?: string;
};

export default function Aside({ children, name, className }: AsideProps) {
  return (
    <aside className={cn('w-full md:w-80', className)}>
      <div className="flex h-full flex-col">
        <div className="mb-4 ml-2 flex justify-between pt-4">
          <div className="text-2xl font-bold text-neutral-800">{name}</div>
        </div>
        {children}
      </div>
    </aside>
  );
}
