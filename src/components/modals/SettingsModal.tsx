import React, { memo, useCallback, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';

import Modal from './Modal';
import { toast } from 'react-hot-toast';
import { post } from '@/lib/api/fetch/fetch';
import { useSession } from '@/hooks/use-session';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { checkIfUsernameIsAvailable } from '@/lib/api/query-functions';
import { debounce } from '@/utils/schedulers';
import { appendNonNullableValuesThatWereChanged, isFormValid } from '@/utils/forms';
import dynamic from 'next/dynamic';
import { MAX_LENGTH_OF_BIO } from '@/constants';
import { AvatarEditable } from '@/components/ui/avatar';
import { USERNAME_VALIDATOR } from '@/utils/validation';

const CropModal = dynamic(() => import('@/components/modals/CropModal'));

interface SettingsModalProps {
  isOpen?: boolean;
  onClose: () => void;
}

const formSchema = z.object({
  username: USERNAME_VALIDATOR.optional(),
  image: z.any(),
  bio: z.string().max(100, { message: 'Bio must be 100 characters or less' }).optional()
});

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const { session, update } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [croppedBlobUrl, setCroppedBlobUrl] = useState<string>(
    session.user.image || '/images/placeholder.jpg'
  );
  const [fileForCropping, setFileForCropping] = useState<File | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    defaultValues: {
      username: session.user.name,
      bio: session.user.bio ?? '',
      image: null
    },
    resolver: zodResolver(formSchema),
    mode: 'onChange'
  });
  const isFormValidFlag = isFormValid(form);

  const onUsernameChange = debounce((event) => {
    const fieldState = form.getFieldState('username');
    if (fieldState.invalid || !fieldState.isDirty) {
      return;
    }

    if (session.user.name === event.target.value) {
      return;
    }

    checkIfUsernameIsAvailable(event.target.value, session.accessToken).then(
      (usernameIsAvailable) => {
        if (!usernameIsAvailable) {
          form.setError('username', { message: 'This username is already taken.' });
        }
      }
    );
  }, 500);

  const onImageChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    if (!event.target.files?.[0]) {
      return;
    }

    setFileForCropping(event.target.files[0]);
  };

  const handleAvatarCrop = useCallback(
    (croppedImg: File) => {
      setFileForCropping(null);
      form.setValue('image', croppedImg, {
        shouldDirty: true
      });

      if (croppedBlobUrl && croppedBlobUrl !== session.user.image) {
        URL.revokeObjectURL(croppedBlobUrl);
      }
      setCroppedBlobUrl(URL.createObjectURL(croppedImg));
    },
    [form, croppedBlobUrl, session.user.image]
  );

  const handleCropModalClose = useCallback(() => {
    form.setValue('image', null);
    setFileForCropping(null);
  }, [form]);

  const handleModalClose = useCallback(() => {
    form.reset();
    setFileForCropping(null);
    setCroppedBlobUrl(session.user.image || '/images/placeholder.jpg');

    if (croppedBlobUrl && croppedBlobUrl !== session.user.image) {
      URL.revokeObjectURL(croppedBlobUrl);
    }
    onClose();
  }, [onClose, form, croppedBlobUrl, session.user.image]);

  const onSubmit: SubmitHandler<z.infer<typeof formSchema>> = (data) => {
    setIsLoading(true);
    const formData = new FormData();
    appendNonNullableValuesThatWereChanged(form, data, formData);
    // TODO figure out why react-hook-form doesn't mark image dirty after modifying
    if (data.image) {
      formData.append('image', data.image);
    }

    if (formData.entries().next().done) {
      setIsLoading(false);
      return onClose();
    }

    post({
      url: `/users/${session.user.id}`,
      data: formData,
      headers: {
        Authorization: `Bearer ${session.accessToken}`
      }
    })
      .then(() => {
        update({
          name: data.username,
          bio: data.bio,
          image: data.image ? URL.createObjectURL(data.image) : session.user.image
        }).then(handleModalClose);
      })
      .catch(() => toast.error('Something went wrong!'))
      .finally(() => setIsLoading(false));
  };

  return (
    <Modal isOpen={isOpen} onClose={handleModalClose}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="space-y-12">
            <div className="border-b border-gray-900/10 pb-12">
              <h2 className="text-base font-semibold leading-7 text-gray-900">Profile</h2>
              <p className="mt-1 text-sm leading-6 text-gray-600">Edit your public information.</p>

              <div className="mt-10 flex flex-col gap-y-8">
                <FormField
                  control={form.control}
                  rules={{
                    onChange: onUsernameChange
                  }}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username (required)</FormLabel>
                      <FormControl>
                        <Input placeholder="" {...field} />
                      </FormControl>
                      <FormDescription>
                        This is your public username. It&apos;s case-insensitive.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  rules={{
                    maxLength: MAX_LENGTH_OF_BIO
                  }}
                  name="bio"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bio (optional)</FormLabel>
                      <FormControl>
                        <Input
                          maxLength={MAX_LENGTH_OF_BIO}
                          type="text"
                          placeholder=""
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Any details such as age, occupation or city.
                        <br />
                        Example: 19 y.o. developer from New York
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="image"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Avatar</FormLabel>
                      <FormControl>
                        <AvatarEditable
                          name={field.name}
                          onImageChange={onImageChange}
                          imagePreviewUrl={croppedBlobUrl}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-end gap-x-6">
            <Button
              type="button"
              disabled={isLoading}
              variant="secondary"
              onClick={handleModalClose}
            >
              Cancel
            </Button>
            <Button disabled={!isFormValidFlag || isLoading} type="submit">
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Save
            </Button>
          </div>
        </form>
      </Form>
      <CropModal
        file={fileForCropping}
        onClose={handleCropModalClose}
        onChange={handleAvatarCrop}
      />
    </Modal>
  );
};

export default memo(SettingsModal);
