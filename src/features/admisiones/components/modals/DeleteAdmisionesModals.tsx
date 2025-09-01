// features/admissions/components/modals/DeleteAdmisionesModals.ts

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface DeleteAdmisionesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  admissionName: string; // nombre del aspirante/admisión a mostrar
}

export function DeleteAdmisionesModal({
  isOpen,
  onClose,
  onConfirm,
  admissionName,
}: DeleteAdmisionesModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>¿Estás seguro de eliminar esta admisión?</DialogTitle>
          <DialogDescription>
            Esta acción no se puede deshacer. La admisión de{' '}
            <span className="font-semibold">{admissionName}</span> será eliminada permanentemente.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button variant="destructive" onClick={onConfirm}>
            Eliminar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
