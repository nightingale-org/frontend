import DesktopSidebar from './DesktopSidebar';
import MobileFooter from './MobileFooter';

type SidebarProps = {
  children: React.ReactNode;
};

function Sidebar({ children }: SidebarProps) {
  return (
    <div className="h-full">
      <DesktopSidebar />
      <MobileFooter />
      <div className="h-full lg:pl-20">{children}</div>
    </div>
  );
}

export default Sidebar;
