import DesktopSidebar from '@/components/sidebar/DesktopSidebar';
import MobileFooter from '@/components/sidebar/MobileFooter';
import RightColumn from '@/components/RightColumn/RightColumn';

export default function DefaultLayout({ children }) {
  return (
    <div className="grid h-full md:grid-cols-[auto_auto_1fr]">
      <DesktopSidebar />
      <div className="col-span-full md:col-auto">{children}</div>
      <RightColumn />
      <MobileFooter />
    </div>
  );
}
