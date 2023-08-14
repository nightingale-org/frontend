import clsx from 'clsx';
import Link from 'next/link';

type DesktopItemProps = {
  label: string;
  active?: boolean;
  icon: React.ElementType;
  href?: string;
  onClick?: (event: React.MouseEvent<HTMLLIElement, MouseEvent>) => void;
};

const DesktopItem: React.FC<DesktopItemProps> = ({ label, href, icon: Icon, active, onClick }) => {
  const handleClick = (event) => {
    onClick?.(event);
  };

  return (
    <li onClick={handleClick} key={label}>
      <Link
        href={href ?? '#'}
        className={clsx(
          `group flex gap-x-3 rounded-md p-3 text-sm font-semibold leading-6 text-gray-500 hover:bg-gray-100 hover:text-black`,
          active && 'bg-gray-100 text-black'
        )}
      >
        <Icon className="h-6 w-6 shrink-0" aria-hidden="true" />
        <span className="sr-only">{label}</span>
      </Link>
    </li>
  );
};

export default DesktopItem;
