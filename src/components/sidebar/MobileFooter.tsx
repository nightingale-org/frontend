import useActiveConversationStatus from '@/hooks/use-active-conversation-status';
import useRoutes from '@/hooks/use-routes';
import MobileItem from './MobileItem';

const MobileFooter = () => {
  const routes = useRoutes();
  const { isOpen: isInConversation } = useActiveConversationStatus();

  if (isInConversation) {
    return null;
  }

  return (
    <div
      className="
        fixed
        bottom-0
        z-40
        flex
        w-full
        items-center
        justify-between
        border-t-[1px]
        bg-white
        lg:hidden
      "
    >
      {routes.map((route) => (
        <MobileItem key={route.href} {...route} />
      ))}
    </div>
  );
};

export default MobileFooter;
