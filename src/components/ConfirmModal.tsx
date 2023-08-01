import React, { useCallback, useState } from 'react';
import { Dialog } from '@headlessui/react';
import { FiAlertTriangle } from 'react-icons/fi';
import { useRouter } from 'next/navigation';
import Modal from '@/components/modals/Modal';
import Button from '@/components/Button';
import useActiveConversationStatus from '@/hooks/use-active-conversation-status';
import { toast } from 'react-hot-toast';
import { del } from '@/lib/api/fetch/fetch';
import { useSession } from '@/hooks/use-session';

interface ConfirmModalProps {
  isOpen?: boolean;
  onClose: () => void;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({ isOpen, onClose }) => {
  const router = useRouter();
  const { conversationId } = useActiveConversationStatus();
  const [isLoading, setIsLoading] = useState(false);
  const { session } = useSession();

  const onDelete = useCallback(() => {
    setIsLoading(true);

    del({
      url: `/api/conversations/${conversationId}`,
      headers: {
        Authorization: `Bearer ${session.accessToken}`
      }
    })
      .then(() => {
        onClose();
        router.push('/conversations');
        router.refresh();
      })
      .catch(() => toast.error('Something went wrong!'))
      .finally(() => setIsLoading(false));
  }, [session.accessToken, router, conversationId, onClose]);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="sm:flex sm:items-start">
        <div className="mx-auto flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
          <FiAlertTriangle className="h-6 w-6 text-red-600" aria-hidden="true" />
        </div>
        <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
          <Dialog.Title as="h3" className="text-base font-semibold leading-6 text-gray-900">
            Delete conversation
          </Dialog.Title>
          <div className="mt-2">
            <p className="text-sm text-gray-500">
              Are you sure you want to delete this conversation? This action cannot be undone.
            </p>
          </div>
        </div>
      </div>
      <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
        <Button disabled={isLoading} danger onClick={onDelete}>
          Delete
        </Button>
        <Button disabled={isLoading} secondary onClick={onClose}>
          Cancel
        </Button>
      </div>
    </Modal>
  );
};

export default ConfirmModal;
