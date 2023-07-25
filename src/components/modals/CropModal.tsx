import { blobToDataUri, blobToFile } from '@/utils/files';
import React, { memo, useCallback, useRef } from 'react';
import Modal from '@/components/modals/Modal';
import { Button } from '@/components/ui/button';
import 'croppie/croppie.css';
import type { default as Croppie, ResultOptions } from 'croppie';

// Change to 'base64' to get base64-encoded string
const cropperResultOptions: ResultOptions & { type: 'blob' } = {
  type: 'blob',
  quality: 1,
  format: 'jpeg',
  circle: false,
  size: { width: 1024, height: 1024 }
};

type OwnProps = {
  file?: Blob | null;
  onChange: (file: File) => void;
  onClose: () => void;
};

const CropModal: React.FC<OwnProps> = ({ file, onChange, onClose }: OwnProps) => {
  const cropperRef = useRef<Croppie | null>(null);

  const cropContainerRefCallback: React.RefCallback<HTMLDivElement> = useCallback(
    (node) => {
      if (!node || !file) {
        return;
      }

      import('croppie')
        .then((module) => {
          const Cropper = module.default;

          const { clientWidth, clientHeight } = node;

          const cropper = new Cropper(node, {
            enableZoom: true,
            boundary: {
              width: clientWidth,
              height: clientHeight
            },
            viewport: {
              width: clientWidth,
              height: clientHeight,
              type: 'circle'
            }
          });
          cropperRef.current = cropper;
          return cropper;
        })
        .then((cropper) => blobToDataUri(file).then((dataUri) => cropper.bind({ url: dataUri })))
        .catch((err) => {
          if (process.env.NODE_ENV === 'development') {
            console.error(err);
          }
        });
    },
    [file]
  );

  const handleCropClick = async () => {
    if (!cropperRef.current) {
      return;
    }

    const result: Blob | string = await cropperRef.current.result(cropperResultOptions);
    const croppedImg = typeof result === 'string' ? result : blobToFile(result, 'avatar.jpg');

    onChange(croppedImg);
  };

  const handleModalClose = useCallback(() => {
    cropperRef.current = null;
    onClose();
  }, [cropperRef, onClose]);

  return (
    <Modal isOpen={Boolean(file)} onClose={handleModalClose}>
      <div className="space-y-2 pb-4">
        <h2 className="text-xl font-semibold leading-7 text-gray-900">Drag to reposition</h2>
      </div>
      <div
        id="avatar-crop"
        ref={cropContainerRefCallback}
        className="relative mx-auto my-0 max-w-[25rem] overflow-hidden before:block before:pt-[100%] before:content-[''] [&>.cr-boundary]:!absolute [&>.cr-boundary]:left-0 [&>.cr-boundary]:top-0 [&>.cr-viewport]:border-none"
      />
      <Button color="primary" onClick={handleCropClick} className="inset absolute bottom-4 right-4">
        Done
      </Button>
    </Modal>
  );
};

export default memo(CropModal);
