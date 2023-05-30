import axios from 'axios';
import { useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';

import Avatar from '@/components/Avatar';
import LoadingModal from '@/components/modals/LoadingModal';
import {User} from "@/types";

interface UserBoxProps {
  user: User;
}

const UserBox: React.FC<UserBoxProps> = ({ user }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = useCallback(() => {
    setIsLoading(true);

    axios
      .post('/api/conversations', { userId: user.id })
      .then((data) => {
        router.push(`/conversations/${data.data.id}`);
      })
      .finally(() => setIsLoading(false));
  }, [user, router]);

  return (
    <>
      {isLoading && <LoadingModal />}
      <div
        onClick={handleClick}
        className="
          relative
          flex
          w-full
          cursor-pointer
          items-center
          space-x-3
          rounded-lg
          bg-white
          p-3
          transition
          hover:bg-neutral-100
        "
      >
        <Avatar user={user} />
        <div className="min-w-0 flex-1">
          <div className="focus:outline-none">
            <span className="absolute inset-0" aria-hidden="true" />
            <div className="mb-1 flex items-center justify-between">
              <p className="text-sm font-medium text-gray-900">{user.name}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserBox;
