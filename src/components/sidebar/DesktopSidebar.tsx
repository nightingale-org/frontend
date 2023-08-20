import DesktopItem from './DesktopItem';
import useRoutes from '@/hooks/use-routes';
import SettingsModal from '../LeftColumn/SettingsModal';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useModal } from '@/hooks/use-modal';
import { useSession } from 'next-auth/react';
import { createPortal } from 'react-dom';

const DesktopSidebar = () => {
  const routes = useRoutes();
  const [isOpen, onModalOpen, onModalClose] = useModal();
  const { data: session, status } = useSession();

  if (status === 'loading' || status === 'unauthenticated') {
    return null;
  }

  return (
    <div className="hidden shrink-0 justify-between lg:flex lg:h-full lg:w-20 lg:flex-col lg:overflow-y-auto lg:border-r-[1px] lg:bg-white lg:pb-4 xl:px-6">
      {createPortal(<SettingsModal isOpen={isOpen} onClose={onModalClose} />, document.body)}
      <nav className="mt-4 flex flex-col justify-between">
        <ul className="flex flex-col items-center space-y-1">
          {routes.map((route) => (
            <DesktopItem key={route.label} {...route} />
          ))}
        </ul>
      </nav>
      <nav className="mt-4 flex flex-col items-center justify-between">
        <div
          onClick={onModalOpen}
          className="cursor-pointer transition hover:opacity-75"
          role="button"
          tabIndex={0}
        >
          <Avatar>
            <AvatarImage src={session!.user!.image} />
            <AvatarFallback>{session!.user!.name}</AvatarFallback>
          </Avatar>
        </div>
      </nav>
    </div>
  );
};

export default DesktopSidebar;
