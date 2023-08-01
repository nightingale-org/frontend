import axios from 'axios';
import { useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';

import LoadingModal from '@/components/modals/LoadingModal';
import { User } from '@/lib/api/schemas';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

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
        className="relative flex w-full cursor-pointer items-center space-x-3 rounded-lg bg-white p-3 transition hover:bg-neutral-100"
      >
        <Avatar>
          <AvatarImage src={user.image} />
          <AvatarFallback>{user.username}</AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <div className="focus:outline-none">
            <span className="absolute inset-0" aria-hidden="true" />
            <div className="mb-1 flex items-center justify-between">
              <p className="text-sm font-medium text-gray-900">{user.username}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserBox;
