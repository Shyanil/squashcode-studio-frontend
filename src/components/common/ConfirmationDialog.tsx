import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';

interface ConfirmationDialogProps {
  confirmLabel?: string;
  description: string;
  onCancel: () => void;
  onConfirm: () => void;
  open: boolean;
  title: string;
}

export function ConfirmationDialog({
  confirmLabel = 'Confirm',
  description,
  onCancel,
  onConfirm,
  open,
  title,
}: ConfirmationDialogProps) {
  return (
    <Modal description={description} onClose={onCancel} open={open} title={title}>
      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <Button onClick={onCancel} type="button" variant="secondary">
          Cancel
        </Button>
        <Button onClick={onConfirm} type="button">
          {confirmLabel}
        </Button>
      </div>
    </Modal>
  );
}

