import { useCallback, useState } from 'react';

export const useModal = () => {
  const [isOpen, setIsOpen] = useState(false);

  const onModalOpen = useCallback(() => setIsOpen(true), []);
  const onModalClose = useCallback(() => setIsOpen(false), []);

  return [isOpen, onModalOpen, onModalClose] as const;
};
