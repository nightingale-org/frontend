import Sidebar from '@/components/sidebar/Sidebar';
import clsx from 'clsx';
import EmptyState from '@/components/EmptyState';
import useActiveConversationStatus from '@/hooks/use-active-conversation-status';

export default function DefaultLayout({ children }) {
  const { isOpen } = useActiveConversationStatus();

  return (
    <Sidebar>
      <div className="h-full">
        {children}
        <div className={clsx('h-full lg:block lg:pl-80', isOpen ? 'block' : 'hidden')}>
          <EmptyState />
        </div>
      </div>
    </Sidebar>
  );
}
