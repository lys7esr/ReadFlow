import { useCallback, useRef, useState } from 'react';
import { Upload } from 'lucide-react';
import { validatePdfFile } from '../../utils/fileValidation';
import { computeFileId } from '../../utils/fileHash';
import { pdfStorage } from '../../services/pdfStorage';
import { cn } from '../../utils/classNames';

export const UploadZone = ({ onReady }) => {
  const inputRef = useRef(null);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const handleFile = useCallback(async (file) => {
    setError('');
    const v = validatePdfFile(file);
    if (!v.ok) { setError(v.error); return; }
    setBusy(true);
    try {
      const id = await computeFileId(file);
      const url = pdfStorage.put(id, file);
      onReady?.({ id, url, name: file.name });
    } catch {
      setError('Could not read this file. Please try another PDF.');
    } finally {
      setBusy(false);
    }
  }, [onReady]);

  const onDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files?.[0];
    if (f) handleFile(f);
  };

  return (
    <div>
      <label
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        className={cn(
          'block cursor-pointer rounded-2xl border-2 border-dashed p-8 sm:p-12 text-center',
          'transition-all duration-300 focus-ring',
          dragging
            ? 'border-[var(--vibe-accent)] bg-[color-mix(in_srgb,var(--vibe-accent)_5%,transparent)] scale-[1.01]'
            : 'border-bg-border bg-bg-elevated hover:border-text-muted/50 hover:bg-bg-surface'
        )}
      >
        <input
          ref={inputRef}
          type="file"
          accept="application/pdf,.pdf"
          className="sr-only"
          onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
        />
        <div
          className={cn(
            'mx-auto h-12 w-12 rounded-full flex items-center justify-center mb-4',
            'transition-all duration-300',
            dragging
              ? 'bg-[color-mix(in_srgb,var(--vibe-accent)_15%,transparent)] scale-110'
              : 'bg-bg-surface'
          )}
        >
          <Upload
            className="h-5 w-5 transition-colors duration-300"
            style={{ color: dragging ? 'var(--vibe-accent)' : undefined }}
          />
        </div>
        <div className="text-base font-medium">
          {busy ? 'Preparing your PDF…' : 'Drop a PDF here or tap to upload'}
        </div>
        <div className="mt-1 text-xs text-text-muted">PDF only · up to 100 MB · stays on your device</div>
      </label>
      {error && (
        <div role="alert" className="mt-3 text-sm text-red-400 text-center animate-fade-in-fast">
          {error}
        </div>
      )}
    </div>
  );
};