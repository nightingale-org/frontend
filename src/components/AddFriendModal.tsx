import Modal from '@/components/modals/Modal';
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { put } from '@/lib/api/fetch/fetch';
import { useSession } from '@/hooks/use-session';
import { BadRequestError } from '@/lib/api/fetch/errors';
import { useToast } from '@/hooks/use-toast';
import { USERNAME_VALIDATOR } from '@/utils/validation';

interface InProps {
  isOpen: boolean;
  onClose: () => void;
}

const formSchema = z.object({
  username: USERNAME_VALIDATOR
});

export default function AddFriendModal({ isOpen, onClose }: InProps) {
  const { session } = useSession();
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    defaultValues: {
      username: ''
    },
    resolver: zodResolver(formSchema)
  });

  const onModalClose = () => {
    form.reset();
    onClose();
  };

  const onSubmit: SubmitHandler<z.infer<typeof formSchema>> = async (data) => {
    try {
      await put({
        url: '/relationships',
        data: {
          username: data.username
        },
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
          'Content-Type': 'application/json'
        }
      });
      toast({
        title: `Friend request to ${data.username} was sent.`
        // action: TODO: make undo
      });
      onClose();
    } catch (e: unknown) {
      if (e instanceof BadRequestError) {
        form.setError('username', {
          message: e.data.detail
        });
      } else {
        form.setError('username', { message: 'Unknown error. Please try again later.' });
      }
    }
  };

  const username = form.watch('username');

  return (
    <Modal isOpen={isOpen} onClose={onModalClose}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="space-y-2 pb-4">
            <h2 className="text-xl font-semibold leading-7 text-gray-900">Add friend</h2>
          </div>
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Friend&apos;s username</FormLabel>
                <FormControl>
                  <Input
                    autoComplete="off"
                    placeholder="You can add friends with their Nightingale username"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button disabled={!username} type="submit" className="mt-6">
            Add friend
          </Button>
        </form>
      </Form>
    </Modal>
  );
}
