'use client';

import * as React from 'react';
import { useRef } from 'react';
import * as AvatarPrimitive from '@radix-ui/react-avatar';
import { cn } from '@/utils/css-class-merge';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';

const Avatar = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Root
    ref={ref}
    className={cn(
      'relative flex h-10 w-10 shrink-0 select-none overflow-hidden rounded-full',
      className
    )}
    {...props}
  />
));
Avatar.displayName = AvatarPrimitive.Root.displayName;

const AvatarImage = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Image>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Image
    ref={ref}
    className={cn('aspect-square h-full w-full', className)}
    {...props}
  />
));
AvatarImage.displayName = AvatarPrimitive.Image.displayName;

const AvatarFallback = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Fallback>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Fallback
    ref={ref}
    className={cn(
      'flex h-full w-full items-center justify-center rounded-full bg-muted',
      className
    )}
    {...props}
  />
));
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName;

type AvatarEditableProps = {
  imagePreviewUrl: string;
  name: string;
  onImageChange?: React.ChangeEventHandler<HTMLInputElement>;
  wrapperClassName?: string;
  imageWidth?: number;
  imageHeight?: number;
};

const AvatarEditable: React.FC<AvatarEditableProps> = ({
  imagePreviewUrl,
  name,
  onImageChange,
  wrapperClassName,
  imageWidth = 64,
  imageHeight = 64
}: AvatarEditableProps) => {
  const avatarInputRef = useRef<HTMLInputElement | null>(null);

  const handleUpload: React.MouseEventHandler<HTMLButtonElement> = () => {
    avatarInputRef.current?.click();
  };

  return (
    <div className={cn('mt-2 flex items-center gap-x-3', wrapperClassName)}>
      <Image
        width={imageWidth}
        height={imageHeight}
        className="rounded-full"
        src={imagePreviewUrl}
        alt="Avatar"
        unoptimized
      />
      <input
        type="file"
        className="hidden"
        name={name}
        accept="image/png, image/jpeg"
        onChange={onImageChange}
        ref={avatarInputRef}
      />
      <Button type="button" onClick={handleUpload} variant="secondary">
        <Upload className="mr-2 h-4 w-4" /> Upload
      </Button>
    </div>
  );
};
AvatarEditable.displayName = 'AvatarEditable';

export { Avatar, AvatarImage, AvatarFallback, AvatarEditable };
