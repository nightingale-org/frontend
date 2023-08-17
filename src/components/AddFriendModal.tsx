import Modal from '@/components/modals/Modal';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { BadRequestError } from '@/lib/api/fetch/errors';
import { useToast } from '@/hooks/use-toast';
import { USERNAME_VALIDATOR } from '@/utils/validation';
import { Label } from '@/components/ui/label';
import { cn } from '@/utils/css-class-merge';
import { z } from 'zod';
import { useAddToFriends } from '@/hooks/queries/use-relationship-relationships';

interface InProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddFriendModal({ isOpen, onClose }: InProps) {
  const { toast } = useToast();
  const [username, setUsername] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const addToFriends = useAddToFriends({
    onSuccess: () => {
      toast({
        title: `Friend request to ${username} was sent.`
        // action: TODO: make undo
      });
      onModalClose();
    }
  });

  const buttonDisabled = Boolean(errorMessage) || username === '';

  const onModalClose = () => {
    setUsername('');
    setErrorMessage('');
    onClose();
  };

  const onUsernameChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    setUsername(event.target.value);

    if (event.target.value === '') {
      return setErrorMessage('');
    }

    try {
      USERNAME_VALIDATOR.parse(event.target.value);
    } catch (e: unknown) {
      if (e instanceof z.ZodError) {
        return setErrorMessage(e.issues[0].message);
      }
    }

    setErrorMessage('');
  };

  const onClick = () =>
    addToFriends.mutate(username, {
      onError: (e) => {
        if (e instanceof BadRequestError) {
          setErrorMessage(e.data.detail);
        } else {
          setErrorMessage('Unknown error. Please try again later.');
        }
      }
    });

  return (
    <Modal isOpen={isOpen} onClose={onModalClose}>
      <div className="space-y-2 pb-6">
        <h2 className="text-xl font-semibold leading-7 text-gray-900">Add friend</h2>
      </div>
      <Label>
        <span className={cn('mb-2 block', { 'text-destructive': errorMessage })}>
          Friend&apos;s username
        </span>
        <Input
          value={username}
          onChange={onUsernameChange}
          placeholder="You can add friends with their Nightingale username"
        />
      </Label>
      <p className={cn({ hidden: !errorMessage }, 'mt-2 text-sm font-medium text-destructive')}>
        {errorMessage}
      </p>
      <Button disabled={buttonDisabled} onClick={onClick} type="submit" className="mt-6">
        Add friend
      </Button>
    </Modal>
  );
}
