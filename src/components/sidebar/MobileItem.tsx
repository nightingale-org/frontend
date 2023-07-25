import Link from 'next/link';

import clsx from 'clsx';
import type { IconType } from 'react-icons/lib';

type MobileItemProps = {
  active?: boolean;
  icon: IconType;
  href?: string;
  onClick?: (event: React.MouseEvent<HTMLLIElement, MouseEvent>) => void;
};

const MobileItem: React.FC<MobileItemProps> = ({ href, icon: Icon, active, onClick }) => {
  const handleClick = (event) => {
    onClick?.(event);
  };

  return (
    <Link
      onClick={handleClick}
      href={href ?? '#'}
      className={clsx(
        `
        group
        flex
        w-full
        justify-center
        gap-x-3
        p-4
        text-sm
        font-semibold
        leading-6
        text-gray-500
        hover:bg-gray-100
        hover:text-black
      `,
        active && 'bg-gray-100 text-black'
      )}
    >
      <Icon className="h-6 w-6" />
    </Link>
  );
};

export default MobileItem;
