import { LucideProps } from 'lucide-react';
import { cn } from '@/utils/css-class-merge';

type AnimatedIconProps = {
  Icon: React.ComponentType<LucideProps>;
  fillColorOnHover?: boolean;
} & LucideProps;

export default function AnimatedIcon({
  Icon,
  fillColorOnHover,
  className,
  ...props
}: AnimatedIconProps) {
  return (
    <Icon
      className={cn(
        'transition-colors duration-300 hover:text-slate-950 dark:hover:text-slate-50',
        className,
        { 'hover:fill-slate-950': fillColorOnHover }
      )}
      {...props}
    />
  );
}
