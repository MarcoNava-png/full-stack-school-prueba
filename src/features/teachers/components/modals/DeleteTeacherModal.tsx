import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

export function DeleteTeacherModal({
  isOpen,
  onClose,
  onConfirm,
  teacherName,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  teacherName: string;
}) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>¿Estás seguro de eliminar este profesor?</DialogTitle>
          <DialogDescription>
            Esta acción no se puede deshacer. El profesor <span className="font-semibold">{teacherName}</span> será eliminado permanentemente.
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
