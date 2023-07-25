import clsx from 'clsx';
import Image from 'next/image';
import { useState } from 'react';
import { format } from 'date-fns';
import { useSession } from 'next-auth/react';
import { Message } from '@/lib/api/schemas';

import Avatar from '@/components/Avatar';
import ImageModal from './ImageModal';

interface MessageBoxProps {
  message: Message;
  isLast?: boolean;
}

const MessageBox: React.FC<MessageBoxProps> = ({ message, isLast }) => {
  const session = useSession({ required: true });
  const [imageModalOpen, setImageModalOpen] = useState(false);

  if (session.status === 'loading') return null;

  const isOwn = session.data?.user?.email === message?.author?.email;
  const seenList = (message.seen_by || [])
    .filter((user) => user.email !== message?.author?.email)
    .map((user) => user.username)
    .join(', ');

  const container = clsx('flex gap-3 p-4', isOwn && 'justify-end');
  const avatar = clsx(isOwn && 'order-2');
  const body = clsx('flex flex-col gap-2', isOwn && 'items-end');

  return (
    <div className={container}>
      <div className={avatar}>
        <Avatar image={message.author.image} />
      </div>
      <div className={body}>
        <div className="flex items-center gap-1">
          <div className="text-sm text-gray-500">{message.author.username}</div>
          <div className="text-xs text-gray-400">{format(new Date(message.created_at), 'p')}</div>
        </div>
        <div
          className={clsx(
            'w-fit overflow-hidden text-sm',
            isOwn ? 'bg-sky-500 text-white' : 'bg-gray-100'
            // message.image ? 'rounded-md p-0' : 'rounded-full py-2 px-3'
          )}
        >
          <ImageModal
            src={message.image}
            isOpen={imageModalOpen}
            onClose={() => setImageModalOpen(false)}
          />
          {message.image ? (
            <Image
              alt="Image"
              height="288"
              width="288"
              onClick={() => setImageModalOpen(true)}
              src={message.image}
              className="
                translate
                cursor-pointer
                object-cover
                transition
                hover:scale-110
              "
            />
          ) : (
            <div>{message.text}</div>
          )}
        </div>
        {isLast && isOwn && seenList.length > 0 && (
          <div
            className="
            text-xs
            font-light
            text-gray-500
            "
          >
            {`Seen by ${seenList}`}
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageBox;
