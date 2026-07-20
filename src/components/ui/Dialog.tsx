import type { PropsWithChildren } from 'react';

import { Modal } from '@/components/ui/Modal';

interface DialogProps extends PropsWithChildren {
  description?: string;
  onClose: () => void;
  open: boolean;
  title: string;
}

export function Dialog(props: DialogProps) {
  return <Modal {...props} />;
}

