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
import { ApplicationError } from '@/lib/api/fetch/errors';

interface InProps {
  isOpen: boolean;
  onClose: () => void;
}

const formSchema = z.object({
  username: z
    .string()
    .min(5, 'Username must contain at least 5 characters')
    .regex(
      /^(?!.*\s)[a-z0-9_]+$/i,
      'Please use only lowercase letters (a-z), numbers (0-9), and underscores.'
    )
});

export default function AddFriendModal({ isOpen, onClose }: InProps) {
  const { session } = useSession();
  const form = useForm<z.infer<typeof formSchema>>({
    defaultValues: {
      username: ''
    },
    resolver: zodResolver(formSchema)
  });

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
      onClose();
    } catch (e) {
      if (e instanceof ApplicationError) {
        form.setError('username', {
          message: "Hm, didn't work. Double check that the username is correct."
        });
      } else {
        form.setError('username', { message: 'Unknown error. Please try again later.' });
      }
    }
  };

  const username = form.watch('username');

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="space-y-2 pb-4">
            <h2 className="text-xl font-semibold leading-7 text-gray-900">Friend request</h2>
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
