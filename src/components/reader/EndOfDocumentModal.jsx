import { RotateCcw, FilePlus } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';

export const EndOfDocumentModal = ({ open, onRestart, onNew, onClose }) => (
  <Modal open={open} onClose={onClose}>
    <div className="text-center">
      <div className="mx-auto h-12 w-12 rounded-full bg-accent/15 grid place-items-center mb-4">
        <span className="text-accent text-xl">✓</span>
      </div>
      <h3 className="text-xl font-semibold">You reached the end</h3>
      <p className="mt-2 text-sm text-text-secondary">Nicely done. What's next?</p>
      <div className="mt-6 flex flex-col sm:flex-row gap-3">
        <Button variant="secondary" className="flex-1" onClick={onRestart}>
          <RotateCcw className="h-4 w-4" /> Read again
        </Button>
        <Button variant="primary" className="flex-1" onClick={onNew}>
          <FilePlus className="h-4 w-4" /> New PDF
        </Button>
      </div>
    </div>
  </Modal>
);