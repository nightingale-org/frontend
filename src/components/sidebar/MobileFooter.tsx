import useActiveConversationStatus from '@/hooks/use-active-conversation-status';
import useRoutes from '@/hooks/use-routes';
import MobileItem from './MobileItem';
import { useModal } from '@/hooks/use-modal';
import SettingsModal from '@/components/modals/SettingsModal';
import { Settings } from 'lucide-react';
import type { Route } from '@/@types';

const MobileFooter = () => {
  const routes = useRoutes();
  const { isOpen: isInConversation } = useActiveConversationStatus();
  const [isOpen, onModalOpen, onModalClose] = useModal();

  if (isInConversation) {
    return null;
  }

  return (
    <div className="fixed bottom-0 z-40 flex w-full items-center justify-between border-t-[1px] bg-white lg:hidden">
      {[{ label: 'Settings', onClick: onModalOpen, icon: Settings } as Route, ...routes].map(
        (route) => (
          <MobileItem key={route.href} {...route} />
        )
      )}
      <SettingsModal isOpen={isOpen} onClose={onModalClose} />
    </div>
  );
};

export default MobileFooter;
