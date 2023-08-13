import DesktopItem from './DesktopItem';
import useRoutes from '@/hooks/use-routes';
import SettingsModal from '../modals/SettingsModal';
import { useCallback, useState } from 'react';
import { useSession } from '@/hooks/use-session';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface DesktopSidebarProps {}

const DesktopSidebar: React.FC<DesktopSidebarProps> = () => {
  const routes = useRoutes();
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const { session } = useSession();

  const onSettingsModalClose = useCallback(() => {
    setIsSettingsModalOpen(false);
  }, []);

  return (
    <>
      <SettingsModal isOpen={isSettingsModalOpen} onClose={onSettingsModalClose} />
      <div className="hidden justify-between lg:fixed lg:inset-y-0 lg:left-0 lg:z-40 lg:flex lg:w-20 lg:flex-col lg:overflow-y-auto lg:border-r-[1px] lg:bg-white lg:pb-4 xl:px-6">
        <nav className="mt-4 flex flex-col justify-between">
          <ul className="flex flex-col items-center space-y-1">
            {routes.map((route) => (
              <DesktopItem key={route.label} {...route} />
            ))}
          </ul>
        </nav>
        <nav className="mt-4 flex flex-col items-center justify-between">
          <div
            onClick={() => setIsSettingsModalOpen(true)}
            className="cursor-pointer transition hover:opacity-75"
            role="button"
            tabIndex={0}
          >
            <Avatar>
              <AvatarImage src={session.user.image ?? '/images/placeholder.jpg'} />
              <AvatarFallback>{session.user.name}</AvatarFallback>
            </Avatar>
          </div>
        </nav>
      </div>
    </>
  );
};

export default DesktopSidebar;
