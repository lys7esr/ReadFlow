import { useEffect, useState } from 'react';

let cached = null;

export const usePdfLibrary = () => {
  const [lib, setLib] = useState(cached);

  useEffect(() => {
    if (cached) return;

    let cancelled = false;

    (async () => {
      const reactPdf = await import('react-pdf');

      reactPdf.pdfjs.GlobalWorkerOptions.workerSrc =
        '/pdf.worker.min.mjs';

      cached = reactPdf;

      if (!cancelled) {
        setLib(reactPdf);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return lib;
};