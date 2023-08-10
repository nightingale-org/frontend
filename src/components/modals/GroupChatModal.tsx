import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';

import Input from '../inputs/Input';
import Select from '../inputs/Select';
import Modal from './Modal';
import Button from '../Button';
import { toast } from 'react-hot-toast';
import { RelationShip } from '@/lib/api/schemas';
import { post } from '@/lib/api/fetch';

interface GroupChatModalProps {
  isOpen?: boolean;
  onClose: () => void;
  relationships: RelationShip[];
}

const GroupChatModal: React.FC<GroupChatModalProps> = ({ isOpen, onClose, relationships }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm<FieldValues>({
    defaultValues: {
      name: '',
      members: []
    }
  });

  const members = watch('members');

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setIsLoading(true);

    post({
      url: '/api/conversations',
      data: {
        ...data,
        isGroup: true
      }
    })
      .then(() => {
        router.refresh();
        onClose();
      })
      .catch(() => toast.error('Something went wrong!'))
      .finally(() => setIsLoading(false));
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-12">
          <div className="border-b border-gray-900/10 pb-12">
            <h2 className="leading-7text-gray-900 text-base font-semibold">Create a group chat</h2>
            <p className="mt-1 text-sm leading-6 text-gray-600">
              Create a chat with more than 2 people.
            </p>
            <div className="mt-10 flex flex-col gap-y-8">
              <Input
                disabled={isLoading}
                label="Name"
                id="name"
                errors={errors}
                required
                register={register}
              />
              <Select
                disabled={isLoading}
                label="Members"
                options={relationships.map((relationship) => ({
                  value: relationship.target.id,
                  label: relationship.target.id
                }))}
                onChange={(value) =>
                  setValue('members', value, {
                    shouldValidate: true
                  })
                }
                value={members}
              />
            </div>
          </div>
        </div>
        <div className="mt-6 flex items-center justify-end gap-x-6">
          <Button disabled={isLoading} onClick={onClose} type="button" secondary>
            Cancel
          </Button>
          <Button disabled={isLoading} type="submit">
            Create
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default GroupChatModal;
